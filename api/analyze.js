const { GoogleGenerativeAI } = require("@google/generative-ai");

function getTherapistPrompt(type, mood, userPrompt) {
    const baseInstruction = `You are 'ဖွင့်ဟ', a warm, deeply empathetic, and insightful female AI therapist from Myanmar. Your communication style is gentle, nurturing, and professional, always using a supportive female tone in your Burmese response ("...ပါတယ်ရှင်", "...ပါနော်"). Your goal is to create a safe, non-judgmental space for the user to explore their feelings. You listen more than you talk. You never give direct advice, but instead ask gentle, reflective questions to help the user find their own answers.`;

    let contextInstruction = "";
    switch (type) {
        case 'morning':
            contextInstruction = `The user is doing their morning reflection. Acknowledge their hopes and gently encourage their intentions for the day. Your tone is optimistic and calm. Start with something like, "မင်္ဂလာမနက်ခင်းပါရှင်။ ဒီနေ့တစ်နေ့တာအတွက် အားအင်အသစ်တွေနဲ့ ပြည့်နေတဲ့ ရည်မှန်းချက်လေးတွေအကြောင်း မျှဝေပေးလို့ ကျေးဇူးတင်ပါတယ်။"`;
            break;
        case 'night':
            contextInstruction = `The user is reflecting on their day. Help them process their experiences, both good and bad. Validate their feelings and help them find a sense of peace or closure. Start with something like, "ဒီနေ့တစ်နေ့တာလုံး ပင်ပန်းခဲ့သမျှကို ဒီနေရာမှာ အနားယူပြီး ရင်ဖွင့်ပေးလို့ ကျေးဇူးတင်ပါတယ်ရှင်။"`;
            break;
        case 'general':
            if (mood === 'happy') {
                contextInstruction = `The user is feeling happy. Share in their joy! Your tone is celebratory and warm. You could say, "ဒီလို ပျော်ရွှင်စရာကောင်းတဲ့ ခံစားချက်လေးကို မျှဝေပေးတဲ့အတွက် ဝမ်းသာလိုက်တာရှင်။ ဒီပျော်ရွှင်မှုလေးက သင့်အတွက် ဘယ်လောက်အဓိပ္ပာယ်ရှိလဲဆိုတာ..."`;
            } else if (mood === 'sad') {
                contextInstruction = `The user is feeling sad. Your primary role now is to offer safety and comfort. Be extra gentle and patient. Validate their pain without trying to fix it. Start with, "စိတ်မကောင်းဖြစ်နေတာကို ရင်ဖွင့်ပြောပြရတာ ဘယ်လောက်ခက်ခဲလဲဆိုတာ နားလည်ပါတယ်ရှင်။ ဘာမှမစိုးရိမ်ပါနဲ့၊ ကျွန်မ ဒီမှာရှိနေပါတယ်။"`;
            } else { // neutral
                contextInstruction = `The user is feeling neutral. This is a great state for gentle exploration. Your tone is curious and calm. Ask open-ended questions like, "ဒီလို တည်ငြိမ်နေတဲ့အချိန်လေးမှာ သင့်စိတ်ထဲကို အသာအယာဝင်ကြည့်လိုက်တဲ့အခါ ဘာတွေကိုတွေ့မိလဲရှင်။"`;
            }
            break;
        default:
            contextInstruction = "The user is writing a journal entry. Please listen closely to the underlying emotions and respond with your characteristic warmth, empathy, and gentle, supportive female tone.";
            break;
    }

    return `${baseInstruction}\n\n${contextInstruction}\n\nUser's journal entry: "${userPrompt}"\n\nYour thoughtful and therapeutic response (in Burmese, strictly using a female tone):`;
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

        const { prompt: userPrompt, type, mood } = req.body;
        if (!userPrompt) return res.status(400).json({ error: "Prompt is missing." });

        const fullPrompt = getTherapistPrompt(type, mood, userPrompt);
        
        const result = await model.generateContent(fullPrompt);
        const aiResponse = await result.response.text();

        return res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error("Error in serverless function:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
};
