// File: /api/analyze.js

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { journalText, mood, mode, gender } = request.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("API Key is not configured on the server.");
    }
    let genderInstruction = "သင့်အနေနဲ့ ကျား/မ လိင်ကွဲပြားမှုမရှိတဲ့ ယေဘုယျလေသံ (gender-neutral tone) ကိုသာ အသုံးပြုပြီး ရေးသားပေးပါ။";
    if (gender === 'male') {
        genderInstruction = "အရေးကြီး: သင်၏တုံ့ပြန်မှုသည် အသုံးပြုသူကို 'မောင်လေး' သို့မဟုတ် 'သား' ဟု နွေးထွေးစွာခေါ်ပြီး 'ခင်ဗျာ' ဆိုသည့်နောက်ဆက်တွဲဖြင့် ယဉ်ကျေးစွာရေးသားရမည်။";
    } else if (gender === 'female') {
        genderInstruction = "အရေးကြီး: သင်၏တုံ့ပြန်မှုသည် အသုံးပြုသူကို 'ညီမလေး' သို့မဟုတ် 'သမီး' ဟု နွေးထွေးစွာခေါ်ပြီး 'ရှင့်' ဆိုသည့်နောက်ဆက်တွဲဖြင့် ယဉ်ကျေးစွာရေးသားရမည်။";
    }
    const moodText = (mood === 'မသတ်မှတ်ထား') ? "The user has not specified a mood." : `Their stated mood is '${mood}'.`;
    const prompt = `You are a warm, wise, and deeply compassionate Burmese mind therapist. ${genderInstruction} A user has just completed a '${mode}' reflection. ${moodText} Their journal entry is below.\n\n---\n${journalText}\n---\n\nYour task is to respond in flawless, natural, and flowing Burmese that feels like a heartfelt message from a caring, wise friend, not an AI. Strictly avoid robotic phrasing and clinical jargon. Follow these steps precisely:\n1. Acknowledge their feelings with genuine, deep empathy.\n2. Offer a fresh, gentle perspective on their thoughts.\n3. Provide one or two simple, truly actionable suggestions.\n4. End with a sincerely warm and encouraging closing statement.\nYour entire response must be a single, coherent block of text in perfect Burmese.`;
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "text/plain" },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }, { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }, { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
        }),
    });
    if (!geminiResponse.ok) {
        console.error('Gemini API Error:', await geminiResponse.text());
        throw new Error('An error occurred with the AI service.');
    }
    const result = await geminiResponse.json();
    const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    response.status(200).json({ suggestion: analysisText });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to get analysis from the server.' });
  }
}
