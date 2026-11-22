export default function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method not allowed." });
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
        service: "MathLab AI Tutor API",
        status: "online",
        configured: Boolean(process.env.GEMINI_API_KEY),
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash"
    });
}
