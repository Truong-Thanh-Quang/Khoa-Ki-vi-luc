import "dotenv/config";
import express from "express";
import cors from "cors";
//import { handleDemo } from "./routes/demo";
import bodyParser from "body-parser";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // --- Example routes ---
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  //app.get("/api/demo", handleDemo);

  // --- 🧠 Chatbot route ---
  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
        }),
      });

      const data = await response.json();
      res.json({ reply: data.choices?.[0]?.message?.content ?? "No reply received." });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to fetch from OpenAI" });
    }
  });

  return app;
}
