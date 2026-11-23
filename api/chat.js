import { GoogleGenAI } from "@google/genai";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const DEFAULT_ALLOWED_ORIGIN = "https://arradhyasharma.github.io";
const MAX_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_TOTAL_LENGTH = 32000;
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 8;

// Best-effort per-instance protection. Serverless instances may restart,
// so use a durable rate-limit service before treating this as abuse-proof.
const requestLog = new Map();

const TUTOR_INSTRUCTIONS = `You are MathLab AI Tutor, a patient, accurate educational tutor.

Your main purpose is to teach mathematics clearly, but you may also help with other school subjects and general academic questions when asked. You can explain topics beyond the student's current syllabus.

Teaching approach:
- Explain the idea before using a formula when that helps understanding.
- For calculations and problem-solving, show the steps in a logical order and explain why each step is valid.
- Define symbols, state assumptions, use correct units, and check the result when practical.
- If a question is ambiguous or missing information, ask a focused clarifying question instead of guessing.
- If the student's working is supplied, examine that working and identify the first incorrect or incomplete step respectfully.
- Use examples appropriate to a school learner; increase depth when the student asks for it.
- For follow-up questions, use the conversation history and do not restart the explanation unnecessarily.
- Be honest when uncertain. Do not invent facts, formulas, citations, or textbook claims.
- Do not claim that an answer is guaranteed correct. Encourage checking important work against class materials or a teacher.
- Keep answers organized and readable. Use plain text and simple mathematical notation that displays well in a chat window.
- Do not request personal information. Keep the conversation focused on learning.`;

function getAllowedOrigins() {
    const configured = String(process.env.MATHLAB_ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN);
    return configured.split(",").map((value) => value.trim()).filter(Boolean);
}

function applyCors(req, res) {
    const origin = req.headers.origin;
    const allowedOrigins = getAllowedOrigins();

    if (!origin || !allowedOrigins.includes(origin)) {
    console.log("[MathLab CORS diagnostic]", {
        method: req.method,
        receivedOrigin: origin || "(missing)",
        allowedOrigins
    });
    }

    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    res.setHeader("Cache-Control", "no-store");

    if (!origin) {
        return true;
    }

    if (!allowedOrigins.includes(origin)) {
        return false;
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    return true;
}

function checkRateLimit(req) {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : String(forwarded || "").split(",")[0]).trim() || "unknown";
    const now = Date.now();
    const existing = requestLog.get(ip) || [];
    const recent = existing.filter((timestamp) => now - timestamp < RATE_WINDOW_MS);

    if (recent.length >= RATE_LIMIT) {
        requestLog.set(ip, recent);
        return false;
    }

    recent.push(now);
    requestLog.set(ip, recent);

    if (requestLog.size > 500) {
        for (const [key, timestamps] of requestLog.entries()) {
            if (!timestamps.some((timestamp) => now - timestamp < RATE_WINDOW_MS)) {
                requestLog.delete(key);
            }
        }
    }

    return true;
}

function buildConversation(messages) {
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
        throw new Error("Send between 1 and 16 conversation messages.");
    }

    const normalized = messages.map((message) => {
        if (!message || !["user", "assistant"].includes(message.role) || typeof message.text !== "string") {
            throw new Error("The conversation format is invalid. Please start a new chat.");
        }

        const text = message.text.trim();
        if (!text || text.length > MAX_MESSAGE_LENGTH) {
            throw new Error("Each message must contain 1 to 4,000 characters.");
        }

        return {
            role: message.role,
            text
        };
    });

    const transcript = normalized.map((message) => {
        const speaker = message.role === "user" ? "Student" : "MathLab AI Tutor";
        return speaker + ":\n" + message.text;
    }).join("\n\n");

    if (transcript.length > MAX_TOTAL_LENGTH) {
        throw new Error("This conversation is too long. Start a new chat and try again.");
    }

    return transcript;
}

export default async function handler(req, res) {
    const originAllowed = applyCors(req, res);

    if (req.method === "OPTIONS") {
        return res.status(originAllowed ? 204 : 403).end();
    }

    if (!originAllowed) {
        return res.status(403).json({ error: "This website is not allowed to use the MathLab AI service." });
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST, OPTIONS");
        return res.status(405).json({ error: "Method not allowed." });
    }

    if (!checkRateLimit(req)) {
        return res.status(429).json({ error: "Too many questions in a short time. Please wait a minute and try again." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(503).json({ error: "The AI Tutor backend is deployed, but its Gemini API key has not been configured in Vercel yet." });
    }

    let input;
    try {
        input = buildConversation(req.body && req.body.messages);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const interaction = await ai.interactions.create({
            model: MODEL,
            input,
            system_instruction: TUTOR_INSTRUCTIONS,
            store: false
        });

        const reply = String(interaction.output_text || "").trim();
        if (!reply) {
            return res.status(502).json({ error: "Gemini returned an empty answer. Please try asking in a different way." });
        }

        return res.status(200).json({ reply });
    } catch (error) {
        console.error("MathLab Gemini request failed:", error && error.message ? error.message : "Unknown error");
        return res.status(502).json({ error: "Gemini could not complete that request. Please try again in a moment." });
    }
}
