// Import the Google Generative AI library
const { GoogleGenerativeAI } = require("@google/generative-ai");

// This is the main handler for the Vercel Serverless Function
module.exports = async (req, res) => {
    // 1. Set CORS headers to allow requests from your frontend
    // Adjust the origin if your Vercel frontend has a specific production URL
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Ensure the request method is POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // 3. Get the Gemini API key from Vercel Environment Variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in environment variables.");
        }

        // 4. Initialize the generative AI model
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // 5. Get the user's prompt from the request body
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is missing from the request body." });
        }

        // 6. Create a more empathetic prompt for the AI
        const fullPrompt = `You are a warm, empathetic, and supportive friend from Myanmar. Your name is 'ဖွင့်ဟ'. A user is sharing their feelings with you in Burmese. Your task is to listen carefully and provide a comforting, encouraging, and non-judgmental response in Burmese. Do not give medical advice. Focus on validating their feelings and offering gentle support.

User's journal entry: "${prompt}"

Your supportive response (in Burmese):`;

        // 7. Call the Gemini API to get the response
        const result = await model.generateContent(fullPrompt);
        const aiResponse = await result.response.text();

        // 8. Send the AI's response back to the frontend
        res.status(200).json({ response: aiResponse });

    } catch (error) {
        // 9. Handle any errors that occur
        console.error("Error in serverless function:", error);
        res.status(500).json({ error: "An internal server error occurred while contacting the AI." });
    }
};
