# AI Chatbot Integration Guide

## Overview
The Workflo AI chatbot (WorkBot) has been enhanced with multiple integrations and fallback mechanisms to ensure reliable operation even when external services are not fully configured.

## Current Status ✅
- **AI Chatbot Component**: `/components/ai/AIChatbot.tsx` - Fully functional
- **Chat API**: `/app/api/ai/chat/route.ts` - Working with fallback support
- **Streaming API**: `/app/api/ai/chat-stream/route.ts` - Implemented for better UX
- **Halo PSA Integration**: `/app/api/halo/route.ts` - Ready with mock mode
- **Supabase Storage**: Migration ready at `/supabase/migrations/20250904_create_chat_sessions.sql`
- **Test Page**: `/app/test-chat` - Available for testing

## Features Implemented

### 1. Multi-Provider AI Support
- **OpenAI Integration**: GPT-4o-mini for intelligent responses
- **Anthropic Integration**: Claude 3 Haiku as alternative
- **Mock Responses**: Built-in fallback when no API keys configured
- **Smart Fallback Chain**: OpenAI → Anthropic → Mock responses

### 2. Halo PSA Integration
- **Ticket Creation**: Automatically create support tickets from chat
- **Knowledge Base Search**: Search Halo knowledge base (mock available)
- **Ticket Status Tracking**: Check ticket status via chat
- **Mock Mode**: Fully functional without Halo credentials for testing

### 3. Data Persistence
- **Supabase Integration**: Store all chat sessions and tickets
- **Memory Fallback**: Works without database using in-memory storage
- **Session Management**: Maintains conversation context
- **Analytics Ready**: Views for metrics and recent sessions

### 4. Streaming Responses
- **Real-time Streaming**: Better UX with progressive response display
- **Typing Indicators**: Shows when bot is processing
- **Smooth Animations**: Professional chat experience

## Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
# AI Integration (Optional - will use mock if not provided)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Halo PSA Integration (Optional - will use mock if not provided)
HALO_API_URL=https://servicedesk.workflo.it
HALO_CLIENT_ID=your-client-id
HALO_CLIENT_SECRET=your-client-secret
HALO_TENANT_ID=your-tenant-id
HALO_AUTH_METHOD=oauth

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@workflo.it
SMTP_PASSWORD=your-password
SUPPORT_EMAIL=support@workflo.it

# Supabase (Already configured in your .env.local)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Database Setup
Run the Supabase migration to create necessary tables:

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase Dashboard
# Copy contents of /supabase/migrations/20250904_create_chat_sessions.sql
```

## Testing

### Test Page
Navigate to `http://localhost:3000/test-chat` to access the comprehensive test page with:
- Test scenarios for different features
- Environment status indicators
- Quick action buttons
- Clear instructions

### Test Scenarios

1. **Basic Conversation**
   - Open chat and say "Hallo"
   - Ask about services: "Vertel over jullie diensten"
   - Request pricing: "Wat kosten jullie diensten?"

2. **Ticket Creation**
   - Say: "Ik wil een ticket aanmaken"
   - Or: "Mijn systeem werkt niet"
   - Follow the prompts to create a ticket

3. **Knowledge Base**
   - Ask: "Hoe reset ik mijn wachtwoord?"
   - Or: "Hoe stel ik VPN in?"

4. **Contact Flow**
   - Say: "Ik wil contact opnemen"
   - Or: "Kan ik jullie bellen?"

## API Endpoints

### Chat API
- **POST** `/api/ai/chat` - Regular chat endpoint
- **POST** `/api/ai/chat-stream` - Streaming chat endpoint
- **GET** `/api/ai/chat?sessionId={id}` - Get chat history

### Halo Integration
- **GET** `/api/halo?action=search&query={query}` - Search knowledge base
- **GET** `/api/halo?action=status` - Check Halo status
- **POST** `/api/halo` - Create tickets and add notes

## How It Works

### Without API Keys (Mock Mode)
1. Chatbot uses pre-configured responses for common questions
2. Tickets are created with mock ticket numbers (MOCK-XXXXXX)
3. Knowledge base returns sample articles
4. All features remain functional for testing

### With OpenAI/Anthropic
1. Intelligent, context-aware responses
2. Natural language understanding
3. Dynamic content generation
4. Personalized interactions

### With Halo PSA
1. Real ticket creation in Halo system
2. Live knowledge base search
3. Ticket status tracking
4. Automated escalation

## Deployment Considerations

### Production Checklist
- [ ] Add production API keys to environment variables
- [ ] Run Supabase migrations in production
- [ ] Configure CORS settings for production domain
- [ ] Set up rate limiting for API endpoints
- [ ] Enable monitoring and error tracking
- [ ] Test all integrations in staging environment

### Security
- API keys are server-side only (never exposed to client)
- Session IDs are randomly generated
- Input sanitization implemented
- Rate limiting recommended for production

## Troubleshooting

### Common Issues

1. **Chat not responding**
   - Check browser console for errors
   - Verify API endpoint is accessible
   - Check if session storage is enabled

2. **Tickets not creating**
   - Verify Halo credentials in .env.local
   - Check network tab for API responses
   - Mock mode should always work

3. **Streaming not working**
   - Ensure browser supports EventSource
   - Check for proxy/firewall blocking streaming
   - Fallback to regular responses automatically

## Future Enhancements

### Planned Features
- [ ] Multi-language support (English + Dutch)
- [ ] Voice input/output
- [ ] File attachments in chat
- [ ] Proactive chat triggers
- [ ] Advanced analytics dashboard
- [ ] Integration with CRM systems
- [ ] WhatsApp/Telegram integration

### Performance Optimizations
- [ ] Implement Redis caching for responses
- [ ] Add CDN for static assets
- [ ] Optimize bundle size
- [ ] Implement lazy loading

## Support

For questions or issues:
- Email: support@workflo.it
- Phone: 020-30 80 465
- Documentation: This file

## Credits
Developed for Workflo B.V. by the development team.
AI Integration implemented on September 4, 2025.