import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().slice(0, 10)

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      // Simple deterministic fallback rotation based on date
      const pool = [
        {
          title: "Masala Oats Bowl",
          tags: ["fiber", "savory", "10 min"],
          desc: "Oats with onions, tomatoes, peas, mild spices; lemon & coriander.",
          link: "https://www.google.com/search?q=masala+oats+recipe",
        },
        {
          title: "Paneer Veg Wrap",
          tags: ["protein", "on-the-go", "15 min"],
          desc: "Whole-wheat roti, sautéed paneer + mixed veggies, yogurt-mint spread.",
          link: "https://www.google.com/search?q=paneer+veg+wrap+healthy",
        },
        {
          title: "Chickpea Chaat",
          tags: ["plant protein", "fresh", "10 min"],
          desc: "Boiled chana with cucumber, tomato, onion, lemon, chaat masala.",
          link: "https://www.google.com/search?q=chana+chaat+healthy",
        },
        {
          title: "Curd Rice + Veggies",
          tags: ["comfort", "cooling", "15 min"],
          desc: "Cooked rice mixed with curd, tempered mustard & curry leaves; serve with salad.",
          link: "https://www.google.com/search?q=curd+rice+recipe+healthy",
        },
        {
          title: "Moong Dal Khichdi",
          tags: ["light", "soothing", "20 min"],
          desc: "Moong dal + rice with turmeric & cumin; top with ghee and veggies.",
          link: "https://www.google.com/search?q=moong+dal+khichdi+healthy",
        },
      ]
      const dayIndex = Math.abs(hashString(date)) % pool.length
      const recipes = [pool[dayIndex], pool[(dayIndex + 1) % pool.length], pool[(dayIndex + 2) % pool.length]]
      return NextResponse.json({ date, recipes })
    }

    const systemPrompt = `You are a nutrition-savvy assistant for mental wellness in India.
Return EXACTLY this JSON format and nothing else:
{
  "recipes": [
    {"title": string, "tags": string[], "desc": string, "link": string},
    {"title": string, "tags": string[], "desc": string, "link": string},
    {"title": string, "tags": string[], "desc": string, "link": string}
  ]
}
Rules:
- Focus on quick, healthy, tasty Indian-friendly ideas that support mood.
- Keep tags short (e.g., "protein", "fiber", "15 min").
- Use widely available ingredients; prefer vegetarian options.
- Provide a helpful web link for each.
`

    const body = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: `Date: ${date}. Generate 3 unique options.` },
          ],
        },
      ],
      generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 512 },
    }

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    )
    if (!resp.ok) {
      const t = await resp.text()
      throw new Error(`Gemini error: ${resp.status} ${t}`)
    }
    const data = await resp.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
    let parsed: any
    try {
      parsed = JSON.parse(text)
    } catch {
      // attempt to extract JSON block
      const match = text.match(/\{[\s\S]*\}/)
      parsed = match ? JSON.parse(match[0]) : { recipes: [] }
    }
    if (!Array.isArray(parsed.recipes) || parsed.recipes.length === 0) {
      throw new Error("No recipes returned")
    }
    return NextResponse.json({ date, recipes: parsed.recipes.slice(0, 3) })
  } catch (err) {
    console.error("Recipes API error:", err)
    return NextResponse.json({ error: "Failed to generate recipes" }, { status: 500 })
  }
}

function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return h | 0
}



