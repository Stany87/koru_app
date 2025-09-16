# Koru - Project Documentation

## Project Overview

Koru is a comprehensive mental wellness application designed to provide support, guidance, and resources for mental health and personal growth. The application focuses on creating a safe, supportive environment for users to track their mental wellness journey.

## Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **UI Components**: Radix UI for accessibility
- **State Management**: React hooks with localStorage persistence

### Backend
- **API Routes**: Next.js API routes
- **AI Integration**: Google Gemini API
- **Data Storage**: Local storage (client-side)

### Key Features

#### 1. AI Chat Companion
- Intelligent chatbot powered by Google Gemini
- Keyword recognition for mental health symptoms
- Real-time grounding techniques and therapeutic responses
- Crisis intervention guidance

#### 2. Personal Dashboard
- Time-based personalized greetings
- Visual analytics and progress tracking
- Habit monitoring (water, exercise, sleep)
- Mood trend visualization
- Exercise completion tracking

#### 3. Guided Growth Plans
- 5-week structured wellness programs
- Progressive difficulty levels
- Task completion tracking
- Unlock system for motivation

#### 4. Zen Zone
- Breathing exercises with visual guides
- Guided meditation programs
- Yoga postures with instructions
- Daily affirmations

#### 5. Reflection Journal
- Mood tracking with emoji selection
- Gratitude journaling
- Writing prompts for self-reflection
- Local storage for privacy

#### 6. Mood Music
- Curated ambient sounds
- Music player with controls
- Nature sounds and relaxation audio

#### 7. Lifestyle Tracking
- Water intake monitoring
- Exercise and step tracking
- Sleep schedule management
- Healthy habit checklists

#### 8. Emergency Resources
- Crisis helpline information
- Safety planning resources
- Coping strategies
- Professional support contacts

## File Structure

```
koru-mental-wellness-app/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   └── recipes/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── auth-login.tsx
│   ├── auth-signup.tsx
│   ├── chat-interface.tsx
│   ├── emergency-helpline.tsx
│   ├── guided-growth-plans.tsx
│   ├── lifestyle.tsx
│   ├── mood-assessment-popup.tsx
│   ├── mood-music.tsx
│   ├── onboarding-flow.tsx
│   ├── personal-dashboard.tsx
│   ├── reflection-journal.tsx
│   ├── splash-loader.tsx
│   ├── user-profile-setup.tsx
│   └── zen-zone.tsx
├── lib/
│   └── utils.ts
├── public/
│   ├── asanas/
│   └── music/
└── styles/
    └── globals.css
```

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `env.example` to `.env.local`
4. Add your Gemini API key to `.env.local`
5. Run development server: `npm run dev`

## Privacy & Security

- All personal data is stored locally on the user's device
- No user data is sent to external servers without explicit consent
- Crisis situations may involve sharing information with emergency services
- Full privacy policy and terms of use are included in the app

## Deployment

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Render / Fly.io
- Self-hosted servers

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.




