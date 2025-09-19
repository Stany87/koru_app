# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start production server (after build)
- `npm run lint` - Run ESLint for code quality checks

### Testing and Quality
- No test suite is currently configured
- Linting is available via `npm run lint`
- TypeScript compilation is checked via `tsc --noEmit`

### Environment Setup
Create `.env.local` file with required environment variables:
```
GEMINI_API_KEY=your_gemini_api_key_here
# Optional Vertex AI settings:
GCLOUD_PROJECT=your-project-id
GCLOUD_LOCATION=us-central1  
VERTEX_MODEL=gemini-1.5-flash
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **UI Components**: Radix UI for accessibility
- **AI Integration**: Google Gemini API
- **Authentication**: NextAuth.js (with Firebase backend)
- **Database**: Firebase Firestore (optional, falls back to localStorage)
- **State Management**: React hooks with localStorage persistence

### Key Architectural Patterns

#### Feature-Based Component Structure
Each major feature has its own component in `/components/`:
- `enhanced-chat-interface.tsx` - AI companion chat
- `personal-dashboard.tsx` - User dashboard with analytics
- `guided-growth-plans.tsx` - Structured wellness programs
- `zen-zone.tsx` - Meditation and mindfulness exercises
- `reflection-journal.tsx` - Mood tracking and journaling
- `lifestyle.tsx` - Habit tracking (sleep, water, exercise)
- `mood-music.tsx` - Ambient sound player

#### Data Persistence Strategy
The app uses a hybrid approach:
1. **Primary**: Firebase Firestore (when configured)
2. **Fallback**: localStorage (for offline/demo mode)
3. **Local caching**: All Firestore data is cached in localStorage for performance

#### API Route Architecture
- `/api/chat/route.ts` - Gemini AI chat integration
- `/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `/api/ai/route.ts` - Alternative AI endpoint
- `/api/recipes/route.ts` - Wellness content generation

#### Authentication Flow
1. Users land on auth screens (login/signup)
2. Profile setup if first time user
3. Optional onboarding flow
4. Main app with personalized dashboard

### Component Communication Patterns

#### Mode-Based Navigation
The main app (`app/page.tsx`) uses a mode-based navigation system:
- Each wellness feature is a "mode" 
- Modes are selected via cards on the main screen
- Each mode renders its own full-screen component
- `onBack` callback returns to mode selection

#### State Management
- User profile: Shared via props and local state
- Authentication: Custom `useAuth` hook with Firebase
- Preferences: localStorage with Firestore sync
- Real-time data: Direct API calls with local caching

### Mental Health Focus Considerations

#### Crisis Intervention
- Keywords in chat trigger automatic crisis resources
- `emergency-helpline.tsx` provides immediate access to crisis support
- Safety prompts built into AI system prompt

#### Privacy by Design
- Local-first data storage
- No tracking or analytics
- User data never leaves device unless explicitly consented
- Crisis situations may override privacy for safety

#### Therapeutic Approaches
- AI companion trained on supportive, non-directive responses
- Grounding techniques (5-4-3-2-1, box breathing)
- Mood tracking with trend visualization  
- Gentle goal setting and habit formation

## Development Guidelines

### Adding New Wellness Features
1. Create component in `/components/your-feature.tsx`
2. Add mode definition to `modes` array in `app/page.tsx`
3. Add route handling in main component's mode selection
4. Implement `onBack` callback for navigation
5. Use glass morphism styling (`glass`, `glass-strong` classes)
6. Follow accessibility patterns from existing Radix UI components

### Working with AI Integration
- Chat API expects `{ message, conversationHistory }` 
- Responses include fallback handling for missing API key
- System prompt emphasizes mental health support role
- Safety settings configured to block harmful content

### Firebase Integration
- All Firebase operations include error handling
- Functions check `isFirebaseEnabled` flag before attempting Firestore ops
- Local fallbacks ensure app works without Firebase configuration
- User data structure: `users/{uid}` with nested collections for chats, moods, achievements

### Styling Patterns
- Glass morphism effects via custom CSS classes
- Gradient backgrounds and accent colors
- Mobile-first responsive design
- Dark theme optimized (theme provider configured)
- Custom starry background animation

### Testing Considerations
When adding tests, focus on:
- Mental health content appropriateness
- Crisis intervention triggers
- Offline functionality
- Data persistence across browser sessions
- Accessibility compliance

## Common Development Tasks

### Adding New Grounding Techniques
1. Add technique to `/components/zen-zone.tsx`
2. Include instructions and timing guidance
3. Add trigger keywords to chat API system prompt
4. Test with various mental health scenarios

### Extending Mood Tracking
1. Update mood data structure in `/lib/db.ts`
2. Add new visualizations to `/components/personal-dashboard.tsx`
3. Update journal prompts in `/components/reflection-journal.tsx`

### Integrating New AI Providers
1. Add new route in `/app/api/`
2. Update environment variable documentation
3. Add fallback handling for API failures
4. Ensure safety filtering is maintained

### Customizing Onboarding
1. Modify `/components/onboarding-flow.tsx`
2. Update user profile setup in `/components/user-profile-setup.tsx`
3. Adjust onboarding completion tracking in main app

## Project-Specific Context

This is a mental wellness application designed for young people experiencing mental health challenges. The app emphasizes:
- **Safety first**: Crisis detection and resource provision
- **Privacy**: Local data storage with opt-in cloud sync
- **Accessibility**: Screen reader support and simple navigation
- **Evidence-based**: Grounding techniques and therapeutic approaches
- **Non-directive**: Supportive but not prescriptive responses

The codebase balances modern web development practices with the serious responsibility of supporting vulnerable users. Always test mental health-related features carefully and consider consulting with mental health professionals for significant changes to therapeutic content.