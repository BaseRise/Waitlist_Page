const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// 1. Setup Clients
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true }); // Token name check kr lena
const ai = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1", 
});

console.log("BaseRise AI Agent is now thinking... 🚀");

// 2. The Main Logic
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;

    if (!userText) return; 

    // Console mein dikhaye ke kya message aaya
    console.log(`User said: ${userText}`);

    try {
        // AI Request
        const response = await ai.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Ya "llama-3.1-8b-instant"
            messages: [
                { role: "system", content: "You are BaseRise AI Manager. Be helpful and professional." },
                { role: "user", content: userText }
            ]
        });

        // Jawab nikalna
        const aiReply = response.choices[0].message.content;
        
        // Jawab bhejna
        await bot.sendMessage(chatId, aiReply);

    } catch (error) {
        // Error logging
        console.error("AI Error:", error.message); // Sirf message print karein
        await bot.sendMessage(chatId, "Bhai, server busy hai, thori der baad try karein.");
    }
});