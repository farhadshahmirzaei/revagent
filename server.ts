import express from 'express';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import dotenv from 'dotenv';
import viteExpress from 'vite-express';

dotenv.config();

const app = express();
app.use(express.json());

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getLanguageName(lang: string): string {
  if (lang === 'fa') return 'Persian (فارسی)';
  if (lang === 'id') return 'Bahasa Indonesia';
  return 'English';
}

// Streaming SSE endpoint for RevAgent AI Sales Agent (Advisor & WhatsApp/Instagram Customer Simulator)
app.post('/api/ai/chat', async (req, res) => {
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(500).json({
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in Settings > Secrets.',
    });
  }

  try {
    const {
      message,
      language = 'fa',
      mode = 'advisor',
      businessProfile = {},
      history = [],
      stream = true,
    } = req.body;

    const targetLangName = getLanguageName(language);
    const bizName = businessProfile.businessName || 'کسب‌وکار نمونه';
    const channels = businessProfile.channels || 'WhatsApp & Instagram';
    const handoffPolicy = businessProfile.handoffPolicy || 'Escalate custom enterprise discounts >15% or refund disputes to human manager';

    const systemInstruction =
      mode === 'simulator'
        ? `You are the RevAgent AI Digital Sales Agent (Version 1 Core Sales Agent) representing the business "${bizName}" on ${channels}.
You are speaking directly to a prospective customer in a realistic live test conversation.
Your workflow:
1. Greet warmly and identify buying intent.
2. Ask concise clarifying questions about customer need, priority, and budget.
3. Present the verified product/service value clearly.
4. Handle common objections (price, trust, delivery timeline) calmly without inventing unauthorized discounts.
5. Guide the buyer toward confirming an order or booking, OR escalate cleanly to a human specialist if the request falls outside policy (${handoffPolicy}).
CRITICAL RULE: Respond EXCLUSIVELY in ${targetLangName}. Do not mix words from other languages unless it is a brand name.`
        : `You are RevAgent Strategic Sales Copilot helping a subscribed business owner launch and optimize their AI Digital Sales Agent for ${channels} (initially targeting the Indonesian market).
Help the business owner configure sales scripts, qualification questions, objection-handling playbooks, WhatsApp/Instagram funnel steps, and revenue forecasts.
CRITICAL RULE: Respond EXCLUSIVELY in ${targetLangName}. Be structured, concise, practical, and tailored to business owners. Do not mix words from other languages unless it is a brand name.`;

    const chatHistory = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-4-hydrogen',
      config: {
        systemInstruction,
      },
      history: chatHistory,
    });

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const streamResponse = await chat.sendMessageStream({ message });
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          res.write(`data: ${JSON.stringify({ chunk: c.text })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      const result: GenerateContentResponse = await chat.sendMessage({ message });
      res.json({ response: result.text || '' });
    }
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    const statusCode = error?.status || 500;
    const errMsg = error?.message || 'Failed to communicate with Gemini AI';
    if (!res.headersSent) {
      res.status(statusCode).json({ error: errMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
      res.end();
    }
  }
});

// Analysis endpoint for Lead Outreach & Revenue Forecast
app.post('/api/ai/analyze', async (req, res) => {
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(500).json({
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in Settings > Secrets.',
    });
  }

  try {
    const { type, data, language = 'fa' } = req.body;
    const targetLangName = getLanguageName(language);

    let prompt = '';
    if (type === 'outreach') {
      const { lead, channel = 'WhatsApp' } = data;
      prompt = `Draft a natural, high-converting ${channel} sales message for this buyer: ${JSON.stringify(lead)}.
Respond EXCLUSIVELY in ${targetLangName}. Keep it short, persuasive, respectful, and ready to send without placeholders.`;
    } else if (type === 'deal_forecast') {
      prompt = `Analyze these revenue metrics and scenario parameters: ${JSON.stringify(data)}.
Provide 3 concrete, actionable recommendations for the business owner to improve WhatsApp/Instagram conversion rate and deal velocity.
Respond EXCLUSIVELY in ${targetLangName}.`;
    } else {
      prompt = `Analyze this business data and provide clear, practical insights exclusively in ${targetLangName}: ${JSON.stringify(data)}`;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
    });

    res.json({ result: response.text || '' });
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    const statusCode = error?.status || 500;
    res.status(statusCode).json({ error: error?.message || 'Failed to generate AI analysis' });
  }
});

const PORT = Number(process.env.PORT) || 3000;
viteExpress.listen(app, PORT, () => {
  console.log(`RevAgent server running on http://localhost:${PORT}`);
});
