"use strict";

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const PROJECT_ROOT = path.resolve(__dirname, "..");

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "40kb" }));

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many messages in a short time. Please wait a minute and try again." }
});

const SYSTEM_INSTRUCTION = [
    "You are MathLab AI Tutor, a patient and accurate mathematics learning assistant.",
    "Help with mathematics at any level requested, not only the Class 9 syllabus.",
    "When solving a problem, explain the reasoning in clear numbered steps and show calculations.",
    "Do not jump to the final answer unless the learner explicitly asks for only the answer.",
    "Adapt the explanation to the learner's stated level. Define unfamiliar symbols.",
    "For ambiguous or incomplete questions, ask one concise clarification instead of guessing.",
    "Check arithmetic and algebra before responding. If uncertain, say so and explain what needs checking.",
    "For follow-up questions, use the previous conversation context.",
    "Do not claim to have checked an official textbook or source unless that source was actually provided in the conversation.",
    "Keep the tone respectful, encouraging and focused on learning."
].join(" ");

app.get("/api/health", function (_req, res) {
    res.json({ ok: true, configured: Boolean(API_KEY) });
});

app.post("/api/chat", chatLimiter, async function (req, res) {
    if (!API_KEY) {
        return res.status(503).json({ error: "Gemini is not configured yet. Add GEMINI_API_KEY to the server .env file." });
    }

    const incoming = req.body && req.body.messages;
    if (!Array.isArray(incoming) || incoming.length === 0 || incoming.length > 16) {
        return res.status(400).json({ error: "Send between 1 and 16 recent chat messages." });
    }

    const contents = [];
    for (const item of incoming) {
        if (!item || !["user", "assistant"].includes(item.role) || typeof item.text !== "string") {
            return res.status(400).json({ error: "The chat message format is invalid." });
        }
        const text = item.text.trim();
        if (!text || text.length > 4000) {
            return res.status(400).json({ error: "Each message must contain 1–4000 characters." });
        }
        contents.push({ role: item.role === "assistant" ? "model" : "user", parts: [{ text }] });
    }

    try {
        const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(MODEL) + ":generateContent?key=" + encodeURIComponent(API_KEY);
        const apiResponse = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                contents,
                generationConfig: { temperature: 0.35, maxOutputTokens: 1800 }
            }),
            signal: AbortSignal.timeout(45000)
        });

        const payload = await apiResponse.json().catch(function () { return {}; });
        if (!apiResponse.ok) {
            const providerMessage = payload.error && payload.error.message;
            console.error("Gemini API request failed:", apiResponse.status, providerMessage || "Unknown provider error");
            return res.status(502).json({ error: "Gemini could not complete the request. Check the model setting, API key and API usage limits." });
        }

        const reply = (payload.candidates || [])
            .flatMap(function (candidate) { return candidate.content && candidate.content.parts ? candidate.content.parts : []; })
            .map(function (part) { return part.text || ""; })
            .join("\n")
            .trim();

        if (!reply) return res.status(502).json({ error: "Gemini returned no text. Please try again." });
        return res.json({ reply });
    } catch (error) {
        console.error("MathLab tutor error:", error.message);
        return res.status(504).json({ error: "The AI Tutor request timed out or could not reach Gemini. Please try again." });
    }
});

app.use(express.static(PROJECT_ROOT, { extensions: ["html"] }));

app.listen(PORT, function () {
    console.log("MathLab server running at http://localhost:" + PORT);
    console.log("Gemini API key configured:", Boolean(API_KEY));
});
