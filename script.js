document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');

    // --- Data for Journal Types including new questions and icons ---
    const journalTypes = {
        'morning': {
            title: 'မနက်ခင်းသုံးသပ်ခြင်း',
            description: 'နေ့သစ်ကို ကြည်လင်စွာစတင်ပါ။',
            prompts: [
                'ဒီနေ့အတွက် သင်ရဲ့အဓိကရည်မှန်းချက်တစ်ခုက ဘာဖြစ်မလဲ။',
                'သင်ဘယ်လိုခံစားချက်နဲ့ ဒီနေ့ကို စတင်ချင်ပါသလဲ။',
                'ဒီနေ့ သင်မျှော်လင့်နေတဲ့အရာတစ်ခုက ဘာဖြစ်မလဲ။'
            ],
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L12 5"/><path d="M12 19L12 22"/><path d="M5 12H2"/><path d="M22 12H19"/><path d="M17 17L19 19"/><path d="M5 5L7 7"/><path d="M17 7L19 5"/><path d="M5 19L7 17"/><circle cx="12" cy="12" r="4"/></svg>`,
            className: 'card-morning'
        },
        'night': {
            title: 'ညနေသုံးသပ်ခြင်း',
            description: 'တစ်နေ့တာကို ပြန်လည်သုံးသပ်ပါ။',
            prompts: [
                'ဒီနေ့ သင်သင်ယူလိုက်ရတဲ့ သင်ခန်းစာတစ်ခုက ဘာလဲ။',
                'ဒီနေ့ဖြစ်ခဲ့တဲ့အရာတွေထဲမှာ ဘာကိုသင်ပြောင်းလဲချင်ပါသလဲ။',
                'မနက်ဖြန်မှာ ဒီနေ့ထက်ပိုကောင်းအောင် ဘာလုပ်နိုင်မလဲ။'
            ],
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
            className: 'card-night'
        },
        'gratitude': {
            title: 'ကျေးဇူးမှတ်တမ်း',
            description: 'ကောင်းခြင်းတွေကို ရေးမှတ်ပါ။',
            prompts: [
                'သင်အခုလေးတင် ကျေးဇူးတင်လိုက်မိတဲ့အရာက ဘာလဲ။',
                'သင့်ဘဝထဲမှာရှိနေတဲ့ ဘယ်သူ့ကို သင်ကျေးဇူးတင်ချင်လဲ။',
                'သင့်မှာရှိနေတဲ့ သာမန်အရာလေးတစ်ခုအတွက် ကျေးဇူးတင်စကားဆိုပါ။'
            ],
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15.5 5.5a5 5 0 0 1 5 5v3a5 5 0 0 1-5 5h-3.4a2 2 0 0 0-1.4.6L10 23v-8.4a.6.6 0 0 0-.6-.6H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1.4a.6.6 0 0 0 .6-.6V3a1 1 0 0 1 1-1h1a2 2 0 0 1 2 2Z"/></svg>`,
            className: 'card-gratitude'
        },
        'therapist': {
            title: 'AI Therapist',
            description: 'သင့်စိတ်ကို ရင်ဖွင့်ပြောပါ။',
            prompts: [
                'သင့်စိတ်ထဲမှာ အခုအလေးလံဆုံးဖြစ်နေတဲ့အရာက ဘာလဲ။',
                'သင်ရှောင်ဖယ်နေတဲ့ ခံစားချက်တစ်ခုများ ရှိနေမလား။',
                'သင်တကယ်တမ်း လိုအပ်နေတာက ဘာဖြစ်မလဲ။'
            ],
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
            className: 'card-therapist'
        }
    };

    let currentState = { view: 'home', activeType: null };

    function getRandomPrompt(prompts) {
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    function render() {
        appContainer.innerHTML = ''; // Clear screen
        if (currentState.view === 'home') {
            renderHomeScreen();
        } else {
            renderWritingScreen();
        }
    }

    function renderHomeScreen() {
        const header = `<div class="greeting-header"><h1>မင်္ဂလာပါရှင်</h1><p>ဒီနေ့ သင့်စိတ်ကလေးကို ဂရုစိုက်ဖို့ အဆင်သင့်ဖြစ်ပြီလား။</p></div>`;
        const homeGrid = document.createElement('div');
        homeGrid.className = 'home-grid';
        
        for (const type in journalTypes) {
            const data = journalTypes[type];
            const card = document.createElement('div');
            card.className = `feature-card ${data.className}`;
            card.dataset.type = type;
            card.innerHTML = `<div class="icon-bg">${data.icon}</div><h2>${data.title}</h2><p>${data.description}</p>`;
            card.addEventListener('click', () => {
                currentState.view = 'writing';
                currentState.activeType = type;
                render();
            });
            homeGrid.appendChild(card);
        }
        appContainer.innerHTML = header;
        appContainer.appendChild(homeGrid);
    }

    function renderWritingScreen() {
        const type = currentState.activeType;
        const data = journalTypes[type];
        const screen = document.createElement('div');
        screen.className = 'writing-screen';
        
        const prompt = getRandomPrompt(data.prompts);

        screen.innerHTML = `
            <div class="writing-header">
                <button class="back-btn" aria-label="Back to home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                </button>
                <h2>${data.title}</h2>
            </div>
            <div class="prompt-area">${prompt}</div>
            <form id="journal-form">
                <textarea id="journal-entry" rows="12" placeholder="ဒီနေရာမှာ ရင်ဖွင့်ရေးသားပါ..."></textarea>
                <button type="submit" id="submit-btn" class="submit-btn">AI ထံသို့ ပေးပို့မည်</button>
            </form>
            <div id="loading-indicator" class="hidden"><p>ခေတ္တစောင့်ဆိုင်းပါ...</p></div>
            <div id="response-container"></div>
        `;

        screen.querySelector('.back-btn').addEventListener('click', () => {
            currentState.view = 'home';
            currentState.activeType = null;
            render();
        });
        screen.querySelector('#journal-form').addEventListener('submit', (e) => handleFormSubmit(e, prompt));
        appContainer.appendChild(screen);
    }
    
    async function handleFormSubmit(event, prompt) {
        event.preventDefault();
        const userText = document.getElementById('journal-entry').value.trim();
        if (userText === '') {
            alert('ကျေးဇူးပြု၍ သင်၏ခံစားချက်များကို အရင်ရေးသားပါရှင်။');
            return;
        }

        const loading = document.getElementById('loading-indicator');
        const responseContainer = document.getElementById('response-container');
        const submitBtn = document.getElementById('submit-btn');
        
        loading.classList.remove('hidden');
        responseContainer.innerHTML = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'စဉ်းစားနေပါသည်...';

        try {
            const response = await fetch('/api/analyze.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userText,
                    type: currentState.activeType,
                    question: prompt // Send the specific question to AI
                }),
            });
            if (!response.ok) throw new Error('Server error');
            const data = await response.json();
            responseContainer.innerHTML = `<div id="response-card">${data.response}</div>`;
        } catch (error) {
            responseContainer.innerHTML = `<div id="response-card">အမှားအယွင်းတစ်ခု ဖြစ်ပွားခဲ့ပါသည်။ AI နှင့် ဆက်သွယ်၍မရပါရှင်။</div>`;
        } finally {
            loading.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'AI ထံသို့ ပေးပို့မည်';
        }
    }

    render(); // Initial Render
});
