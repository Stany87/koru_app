import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const project = process.env.GCLOUD_PROJECT;
    if (!project) return NextResponse.json({ error: "Missing GCLOUD_PROJECT" }, { status: 500 });

    const client = new VertexAI({ project, location: process.env.GCLOUD_LOCATION ?? "us-central1" });
    const model = client.getGenerativeModel({ model: process.env.VERTEX_MODEL ?? "gemini-1.5-flash" });

    const prompt = messages
      .map((m: any) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const reply = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm here with you.";

    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}



