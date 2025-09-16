# Koru – Your Mental Wellness Companion

Koru is a gentle, supportive app that helps you build healthier routines, reflect on your feelings, and find calm through simple, science‑informed practices.

## What you can do with Koru

- **AI Chat Companion**: Talk to a caring assistant that listens, validates, and suggests grounding techniques.
- **Guided Growth Plans**: Follow week‑by‑week plans for sleep, focus, and mood.
- **Zen Zone**: Try breathing exercises, quick meditations, and mindfulness breaks.
- **Reflection Journal**: Capture thoughts, gratitude, and daily reflections privately.
- **Mood Music**: Play ambient sounds to relax or focus.
- **Lifestyle Tracking**: Track sleep, movement, and healthy habits over time.
- **Crisis Resources**: Access helplines and safety guidance when you need it.

## Quick start
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **UI Components**: Radix UI for accessibility
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React
- **State Management**: React hooks with localStorage persistence.

1) Install dependencies

```
npm install
```

2) Add your environment variable (for the AI chat)

Create a `.env.local` file with:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

3) Run the app

```
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Deploying

- Deploy to your preferred host (e.g., Netlify, Render, Fly.io, or your own server). Add this server env var:
  - `GEMINI_API_KEY`
- Optional: If you use the Vertex route, also set `GCLOUD_PROJECT`, `GCLOUD_LOCATION`, and `VERTEX_MODEL`.
- Your key is used server‑side and is not exposed to users.

## Privacy & safety

- Personal data is stored locally in your browser by default.
- The AI chat uses your server’s API key to generate responses.
- If you are in crisis or at risk of harm, use in‑app helplines and seek local emergency support immediately.

## Support & feedback

Issues and ideas are welcome. Please open an issue or start a discussion.

## License

For educational and personal use. Please be mindful of the mental health focus and use responsibly.