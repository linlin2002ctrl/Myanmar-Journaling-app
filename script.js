document.addEventListener('DOMContentLoaded', () => {

    // --- App State and Data ---
    const appData = {
        'general': {
            title: 'အထွေထွေ',
            prompts: {
                happy: 'ဒီနေ့ သင့်ကိုပျော်ရွှင်စေတဲ့အရာတွေအကြောင်း ပြောပြပေးပါ။',
                neutral: 'ဒီနေ့ သင့်စိတ်ထဲမှာ အလေးအနက်မထားမိဘဲ ရှိနေတဲ့အတွေးက ဘာဖြစ်မလဲ။',
                sad: 'သင့်ကို စိတ်မကောင်းဖြစ်စေတဲ့ ခံစားချက်ကို ဒီနေရာမှာ ရင်ဖွင့်လိုက်ပါနော်။'
            },
            placeholder: 'စိတ်ခံစားမှုတစ်ခုကို ရွေးချယ်ပြီး စတင်ရေးသားပါ။'
        },
        'morning': {
            title: 'Morning',
            prompt: 'ဒီမနက်ခင်းမှာ ဘယ်လိုရည်မှန်းချက်တွေနဲ့ နေ့သစ်ကိုစတင်ချင်လဲ။',
            placeholder: 'သင်၏ မျှော်လင့်ချက်များ၊ ရည်မှန်းချက်များကို ရေးသားပါ...'
        },
        'night': {
            title: 'Night',
            prompt: 'ဒီနေ့တာကို ပြန်လည်သုံးသပ်ကြည့်တဲ့အခါ ဘာကိုအမှတ်ရဆုံးလဲ။',
            placeholder: 'သင်၏ တစ်နေ့တာအတွေ့အကြုံကို ပြန်လည်သုံးသပ်ပါ...'
        }
    };

    let currentState = {
        activeTab: 'general',
        mood: null // 'happy', 'neutral', 'sad'
    };

    const appContainer = document.getElementById('app-container');

    // --- Build the entire UI ---
    function buildUI() {
        appContainer.innerHTML = `
            <header class="header">
                <h1>ဖွင့်ဟ (Pwin Ha)</h1>
                <p>သင်၏ AI စိတ်ကျန်းမာရေး အဖော်မွန်</p>
            </header>

            <nav class="tabs">
                <button class="tab-btn" data-tab="general">အထွေထွေ</button>
                <button class="tab-btn" data-tab="morning">Morning</button>
                <button class="tab-btn" data-tab="night">Night</button>
            </nav>

            <main class="main-content">
                <div id="mood-selector" class="mood-selector">
                    <h3>ဒီနေ့ ဘယ်လိုခံစားနေရလဲ။</h3>
                    <div class="mood-options">
                        <button class="mood-btn" data-mood="happy" aria-label="Happy">😊</button>
                        <button class="mood-btn" data-mood="neutral" aria-label="Neutral">😐</button>
                        <button class="mood-btn" data-mood="sad" aria-label="Sad">😢</button>
                    </div>
                </div>

                <div class="prompt-area" id="prompt-area"></div>
                
                <form id="journal-form">
                    <textarea id="journal-entry" rows="10"></textarea>
                    <button type="submit" id="submit-btn" class="submit-btn">AI ထံသို့ ပေးပို့မည်</button>
                </form>
            </main>

            <div id="loading-indicator" class="hidden">
                <p>ခေတ္တစောင့်ဆိုင်းပါ... AI က သင့်အတွက် စဉ်းစားပေးနေပါတယ်ရှင်...</p>
            </div>
            <div id="response-container"></div>
        `;
        updateUI(); // Set initial UI state
    }

    // --- Update UI based on the current state ---
    function updateUI() {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === currentState.activeTab);
        });

        const moodSelector = document.getElementById('mood-selector');
        const journalEntry = document.getElementById('journal-entry');
        const submitBtn = document.getElementById('submit-btn');
        const promptArea = document.getElementById('prompt-area');
        
        // Handle 'General' tab logic
        if (currentState.activeTab === 'general') {
            moodSelector.classList.remove('hidden');
            document.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.mood === currentState.mood);
            });
            
            if (currentState.mood) {
                promptArea.textContent = appData.general.prompts[currentState.mood];
                journalEntry.placeholder = 'ဒီမေးခွန်းလေးကို အခြေခံပြီး ရင်ဖွင့်နိုင်ပါတယ်...';
                journalEntry.disabled = false;
                submitBtn.disabled = false;
            } else {
                promptArea.textContent = 'ရင်ဖွင့်မရေးခင် သင်၏စိတ်ခံစားချက်ကို ရွေးချယ်ပေးပါနော်။';
                journalEntry.placeholder = appData.general.placeholder;
                journalEntry.disabled = true;
                submitBtn.disabled = true;
            }
        } else {
            // Handle 'Morning' and 'Night' tabs
            moodSelector.classList.add('hidden');
            const tabData = appData[currentState.activeTab];
            promptArea.textContent = tabData.prompt;
            journalEntry.placeholder = tabData.placeholder;
            journalEntry.disabled = false;
            submitBtn.disabled = false;
        }
    }

    // --- Event Handlers ---
    function attachEventListeners() {
        appContainer.addEventListener('click', (e) => {
            // Handle tab switching
            if (e.target.matches('.tab-btn')) {
                currentState.activeTab = e.target.dataset.tab;
                currentState.mood = null; // Reset mood when changing tabs
                document.getElementById('journal-entry').value = '';
                document.getElementById('response-container').innerHTML = '';
                updateUI();
            }
            // Handle mood selection
            if (e.target.matches('.mood-btn')) {
                currentState.mood = e.target.dataset.mood;
                updateUI();
            }
        });
        
        document.getElementById('journal-form').addEventListener('submit', handleFormSubmit);
    }
    
    // --- Handle Form Submission ---
    async function handleFormSubmit(event) {
        event.preventDefault();
        const userText = document.getElementById('journal-entry').value.trim();
        if (userText === '') {
            alert('ကျေးဇူးပြု၍ သင်၏ခံစားချက်များကို အရင်ရေးသားပါရှင်။');
            return;
        }

        const loadingIndicator = document.getElementById('loading-indicator');
        const responseContainer = document.getElementById('response-container');
        const submitBtn = document.getElementById('submit-btn');
        
        loadingIndicator.classList.remove('hidden');
        responseContainer.innerHTML = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'စဉ်းစားနေပါသည်...';

        try {
            const response = await fetch('/api/analyze.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userText,
                    type: currentState.activeTab,
                    mood: currentState.mood
                }),
            });
            if (!response.ok) throw new Error('Server error');
            const data = await response.json();
            responseContainer.innerHTML = `<div id="response-card">${data.response}</div>`;
        } catch (error) {
            responseContainer.innerHTML = `<div id="response-card">အမှားအယွင်းတစ်ခု ဖြစ်ပွားခဲ့ပါသည်။ AI နှင့် ဆက်သွယ်၍မရပါရှင်။</div>`;
        } finally {
            loadingIndicator.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'AI ထံသို့ ပေးပို့မည်';
        }
    }

    // --- Initialize the App ---
    buildUI();
    attachEventListeners();
});
