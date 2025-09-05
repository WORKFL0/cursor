# AI Integration Guide for Workflo IT Services

## Overview
This guide provides comprehensive instructions for integrating and using the AI-powered features in the Workflo Next.js application.

## Features Implemented

### 1. AI Chatbot with Markdown Support
- **Location**: `/components/ai/AIChatbot.tsx`
- **Features**:
  - Real-time streaming responses
  - Markdown rendering with syntax highlighting
  - Chat history persistence
  - Typing indicators with animation
  - Copy message functionality
  - Suggested actions
  - Ticket creation capability

### 2. Global Command Palette (Cmd+K)
- **Location**: `/components/ai/CommandPalette.tsx`
- **Features**:
  - Fuzzy search across all services and pages
  - Keyboard navigation
  - Recent searches
  - Category grouping
  - Quick actions
  - AI-powered search

### 3. Semantic Search
- **Location**: `/lib/ai/search.ts` & `/app/api/ai/search/route.ts`
- **Features**:
  - Fuzzy text matching with Fuse.js
  - Semantic search capabilities
  - Search suggestions
  - Content ranking

### 4. Content Recommendations
- **Location**: `/components/ai/ContentRecommendations.tsx`
- **Features**:
  - Personalized content suggestions
  - Context-aware recommendations
  - User behavior tracking

### 5. Intent Detection
- **Location**: `/lib/ai/intent-detection.ts`
- **Features**:
  - Rule-based intent detection
  - AI-powered intent classification
  - Urgency detection
  - Entity extraction
  - Automatic routing

## Setup Instructions

### 1. Environment Variables
Add the following to your `.env.local` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Anthropic Configuration (Optional)
ANTHROPIC_API_KEY=sk-ant-...

# Pinecone Configuration (Optional for vector search)
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
PINECONE_INDEX_NAME=workflo-content
```

### 2. Install Dependencies
All required packages have been installed:
- `openai` - OpenAI SDK
- `@anthropic-ai/sdk` - Anthropic SDK
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown
- `fuse.js` - Fuzzy search
- `cmdk` - Command palette
- `ai` - Vercel AI SDK

### 3. Integration in Layout

Add the AIProvider to your root layout (`app/layout.tsx`):

```tsx
import { AIProvider } from '@/components/ai';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <AIProvider
          enableChat={true}
          enableCommandPalette={true}
          enableIntentDetection={true}
        >
          {children}
        </AIProvider>
      </body>
    </html>
  );
}
```

### 4. Using AI Features in Components

#### Example: Using the AI Chat
```tsx
import { useAIFeatures } from '@/components/ai';

function MyComponent() {
  const { chat } = useAIFeatures();
  
  return (
    <button onClick={chat.open}>
      Open AI Assistant
    </button>
  );
}
```

#### Example: Intent Detection
```tsx
import { useAIFeatures } from '@/components/ai';

function ContactForm() {
  const { intent } = useAIFeatures();
  
  const handleMessageChange = async (text: string) => {
    const result = await intent.detect(text);
    
    if (result.intent === 'urgent_issue') {
      // Show emergency contact info
    }
  };
  
  return (
    <textarea onChange={(e) => handleMessageChange(e.target.value)} />
  );
}
```

#### Example: Smart Search Integration
```tsx
import { SmartSearch } from '@/components/ai';

function Header() {
  return (
    <nav>
      <SmartSearch />
    </nav>
  );
}
```

## Keyboard Shortcuts

- **⌘+K** or **Ctrl+K**: Open command palette
- **⌘+/** or **Ctrl+/**: Open AI chat
- **ESC**: Close any open modal

## API Endpoints

### Chat Endpoint
- **POST** `/api/ai/chat`
- Handles chat messages and streaming responses

### Search Endpoint
- **POST** `/api/ai/search` - Perform search
- **GET** `/api/ai/search?q=query` - Get search suggestions

### Recommendations Endpoint
- **POST** `/api/ai/recommendations`
- Returns personalized content recommendations

### FAQ Endpoint
- **POST** `/api/ai/faq`
- Intelligent FAQ responses

## Customization

### Modifying the Chatbot Appearance
Edit `/components/ai/AIChatbot.tsx`:
- Change colors in className attributes
- Modify the welcome message
- Adjust positioning (default: bottom-right)

### Adding New Intents
Edit `/lib/ai/intent-detection.ts`:
1. Add new intent to `UserIntent` enum
2. Add patterns to `INTENT_PATTERNS`
3. Add routing rules in `getRouting()`

### Extending Command Palette
Edit `/components/ai/CommandPalette.tsx`:
- Add items to `commandItems` array
- Include appropriate icons and categories
- Add keyboard shortcuts if needed

## Testing Checklist

- [ ] AI Chatbot opens and responds correctly
- [ ] Markdown formatting works in chat messages
- [ ] Command palette opens with Cmd+K
- [ ] Search returns relevant results
- [ ] Intent detection works for common queries
- [ ] Content recommendations load properly
- [ ] API endpoints respond correctly
- [ ] Keyboard shortcuts work as expected
- [ ] Mobile responsiveness is maintained

## Production Considerations

1. **API Keys**: Ensure all API keys are properly configured
2. **Rate Limiting**: Implement rate limiting on API endpoints
3. **Error Handling**: All AI features have fallbacks
4. **Performance**: Components are optimized with lazy loading
5. **Security**: Input sanitization is implemented
6. **Analytics**: Track AI feature usage for optimization

## Monitoring

### Key Metrics to Track
- Chat engagement rate
- Average response time
- Search query patterns
- Intent detection accuracy
- User satisfaction scores

### Error Monitoring
All AI features log errors to console with detailed context. In production, integrate with error tracking service (e.g., Sentry).

## Support

For issues or questions about AI integration:
1. Check error logs in browser console
2. Verify API keys are correctly set
3. Ensure all dependencies are installed
4. Review this documentation

## Next Steps

1. Configure API keys in environment variables
2. Test all features in development
3. Customize branding and messages
4. Deploy to staging for UAT
5. Monitor usage and optimize based on feedback