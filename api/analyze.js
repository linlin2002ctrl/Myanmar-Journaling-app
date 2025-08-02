const { GoogleGenerativeAI } = require("@google/generative-ai");

function getTherapistPrompt(type, question, userPrompt) {
    const baseInstruction = `You are 'ဖွင့်ဟ', a warm, deeply empathetic, and insightful female AI therapist from Myanmar. Your communication style is gentle, nurturing, and professional, always using a supportive female tone ("...ပါတယ်ရှင်", "...ပါနော်"). Your primary goal is to help the user reflect on their thoughts and feelings. You must provide two sections in your response: 1. **သုံးသပ်ချက် (Analysis):** Gently analyze their response in a validating way. 2. **တိုးတက်စေရန်အကြံပြုချက် (Suggestion for Growth):** Offer a gentle, actionable suggestion or a reflective question to help them grow. Never give direct medical advice.`;

    let contextInstruction = `The user is doing a journaling exercise. The specific question they were asked is: "${question}". Based on their journal entry, provide your response structured with the two required sections.`;

    return `${baseInstruction}\n\n${contextInstruction}\n\nUser's journal entry: "${userPrompt}"\n\nYour thoughtful and structured response (in Burmese, strictly using a female tone and the two sections):`;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) throw new Error("API key not found.");

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const { prompt: userPrompt, type, question } = req.body;
        if (!userPrompt || !type || !question) {
            return res.status(400).json({ error: "Required fields are missing." });
        }
        
        const fullPrompt = getTherapistPrompt(type, question, userPrompt);
        
        const result = await model.generateContent(fullPrompt);
        const aiResponse = await result.response.text();

        return res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error("Error in serverless function:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
};
