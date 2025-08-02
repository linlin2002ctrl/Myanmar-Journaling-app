// Wait for the entire page to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    const appContainer = document.getElementById('app-container');

    // --- Dynamically generate the User Interface (UI) ---
    function buildUI() {
        appContainer.innerHTML = `
            <!-- Header Section -->
            <header class="text-center mt-3 mb-4">
                <h1 class="header-title">
                    <i data-feather="edit-3" class="header-icon"></i>ဖွင့်ဟ (Pwin Ha)
                </h1>
                <p class="header-subtitle">သင်၏စိတ်ခံစားမှုများကို ရင်ဖွင့်ရေးသားပြီး AI ထံမှ နွေးထွေးသောအကြံပြုချက်များ ရယူပါ</p>
            </header>

            <!-- Journal Form -->
            <main>
                <form id="journal-form">
                    <div class="mb-3">
                        <label for="journal-entry" class="form-label visually-hidden">Journal Entry</label>
                        <textarea class="form-control" id="journal-entry" rows="8" placeholder="ဒီနေရာမှာ ရင်ဖွင့်ရေးသားပါ..."></textarea>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary submit-btn">
                            <i data-feather="send" style="vertical-align: text-top; margin-right: 5px;"></i> အကြံဉာဏ်တောင်းမည်
                        </button>
                    </div>
                </form>

                <!-- Loading Spinner -->
                <div id="loading-indicator" class="text-center hidden">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">AI က သင့်အတွက် အကြံဉာဏ်ပေးရန် စဉ်းစားနေပါသည်...</p>
                </div>

                <!-- AI Response Card -->
                <div id="response-container">
                    <!-- AI response will be injected here -->
                </div>
            </main>
        `;

        // After creating the UI, render the icons
        feather.replace();
    }

    // --- Event Handlers ---
    function attachEventListeners() {
        const journalForm = document.getElementById('journal-form');
        if (journalForm) {
            journalForm.addEventListener('submit', handleFormSubmit);
        }
    }

    // --- Main Logic: Handle Form Submission ---
    async function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default page reload

        const journalEntry = document.getElementById('journal-entry');
        const loadingIndicator = document.getElementById('loading-indicator');
        const responseContainer = document.getElementById('response-container');
        const submitButton = document.querySelector('.submit-btn');

        const userText = journalEntry.value.trim();

        if (userText === '') {
            alert('ကျေးဇူးပြု၍ သင်၏ခံစားချက်များကို အရင်ရေးသားပါ။');
            return;
        }

        // --- UI Updates: Show loading state ---
        loadingIndicator.classList.remove('hidden');
        responseContainer.innerHTML = ''; // Clear previous response
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  ခေတ္တစောင့်ဆိုင်းပါ...`;

        try {
            // --- Call the Backend Proxy (Vercel Function) ---
            const response = await fetch('/api/analyze.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userText }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.response;

            // --- UI Updates: Display AI response ---
            responseContainer.innerHTML = `
                <div id="response-card">${aiResponse}</div>
            `;

        } catch (error) {
            console.error('Error fetching AI response:', error);
            responseContainer.innerHTML = `
                <div id="response-card" class="bg-danger-subtle border-danger">
                    <strong>အမှားအယွင်းတစ်ခု ဖြစ်ပွားခဲ့ပါသည်</strong>
                    <p class="mt-2 mb-0">AI နှင့်ဆက်သွယ်ရာတွင် အဆင်မပြေဖြစ်သွားပါသည်။ ကျေးဇူးပြု၍ ခဏအကြာတွင် ထပ်မံကြိုးစားကြည့်ပါ။</p>
                </div>
            `;
        } finally {
            // --- UI Updates: Hide loading state ---
            loadingIndicator.classList.add('hidden');
            submitButton.disabled = false;
            // Restore button text using innerHTML to include the icon
            submitButton.innerHTML = `<i data-feather="send" style="vertical-align: text-top; margin-right: 5px;"></i> အကြံဉာဏ်တောင်းမည်`;
            feather.replace(); // Re-render icons if they are in the button
        }
    }

    // --- Initialize the App ---
    buildUI();
    attachEventListeners();
});
