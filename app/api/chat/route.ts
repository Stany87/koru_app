import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      const fallbackResponses = [
        "I hear you, and I want you to know that your feelings are completely valid. It takes courage to reach out and share what you're going through. What you're experiencing matters, and you matter.",
        "Thank you for trusting me with your thoughts. Sometimes just expressing what we're feeling can be the first step toward healing. How are you taking care of yourself today?",
        "I can sense that you're dealing with something difficult right now. Please remember that you don't have to face this alone. What kind of support feels most helpful to you right now?",
        "Your willingness to open up shows incredible strength. Mental health challenges can feel overwhelming, but taking it one moment at a time can help. What's one small thing that might bring you a bit of comfort today?",
        "I'm here to listen and support you through whatever you're experiencing. Your mental health journey is unique, and there's no right or wrong way to feel. What would help you feel a little more grounded right now?",
      ]

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]

      return NextResponse.json({
        response:
          randomResponse +
          "\n\n(Note: To enable full AI capabilities, please provide your Gemini API key in the environment variables.)",
      })
    }

    const systemPrompt = `You are Koru, a supportive mental health companion for young people.

Be warm, genuine, and caring in your responses. Listen actively and validate their feelings. Ask thoughtful questions to help them reflect. Offer gentle support and practical suggestions when appropriate.

If someone mentions:
- Attention/focus issues: suggest grounding techniques like the 5-4-3-2-1 method
- Depression/sadness: validate feelings and offer gentle reframing
- Anxiety/worry: guide through breathing exercises
- Sleep problems: share sleep hygiene tips

For grounding, try:
- 5-4-3-2-1: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste
- Box breathing: in for 4, hold 4, out 4, hold 4
- Body scan: notice tension from toes up and gently release

Safety: If someone mentions self-harm or suicide, provide crisis resources immediately. Don't give medical advice - encourage professional help for serious concerns.

Be real, be caring, and be there for them.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `Previous conversation context: ${JSON.stringify(conversationHistory.slice(-3))}` },
                { text: `User message: ${message}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    const aiResponse =
      data.candidates[0]?.content?.parts[0]?.text ||
      "I'm here to listen. Could you tell me more about what you're feeling?"

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        response:
          "I'm sorry, I'm having trouble connecting right now. Your feelings are important, and I want to be here for you. Please try again in a moment, and remember that if you're in crisis, please reach out to a trusted adult or emergency services immediately.",
      },
      { status: 500 },
    )
  }
}
