import { NextRequest, NextResponse } from 'next/server';
import { WorkBot, ChatSession, ChatMessage } from '@/lib/ai/chatbot';

// In-memory session storage (in production, use database)
const sessions = new Map<string, ChatSession>();
const chatbot = new WorkBot();

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userInfo, createTicket } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = chatbot.createSession(userInfo);
      sessions.set(sessionId || session.id, session);
    }
    
    // Add user message to session
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    session = chatbot.addMessageToSession(session, userMessage);
    
    // Check if user wants to create a ticket
    const lowerMessage = message.toLowerCase();
    const wantsTicket = createTicket || 
      lowerMessage.includes('ticket aanmaken') ||
      lowerMessage.includes('maak een ticket') ||
      lowerMessage.includes('nieuwe ticket') ||
      lowerMessage.includes('probleem melden') ||
      lowerMessage.includes('storing melden');
    
    if (wantsTicket && !createTicket) {
      // Ask for confirmation and details
      const response = {
        message: 'Ik kan een support ticket voor je aanmaken. Beschrijf het probleem dat je ervaart zo gedetailleerd mogelijk.',
        suggestedActions: ['E-mail werkt niet', 'Kan niet inloggen', 'Systeem is traag', 'Anders'],
        shouldCollectInfo: true,
        requiresTicket: true,
      };
      
      return NextResponse.json({
        sessionId: session.id,
        response: response.message,
        suggestedActions: response.suggestedActions,
        shouldCollectInfo: response.shouldCollectInfo,
        requiresTicket: response.requiresTicket,
      });
    }
    
    if (createTicket) {
      // Create the actual ticket
      const ticketResult = await chatbot.createSupportTicket(session, message, userInfo);
      
      return NextResponse.json({
        sessionId: session.id,
        response: ticketResult.message,
        ticketNumber: ticketResult.ticketNumber,
        ticketCreated: ticketResult.success,
        suggestedActions: ticketResult.success 
          ? ['Check ticket status', 'Nieuw probleem melden', 'Contact opnemen']
          : ['Probeer opnieuw', 'Bel support', 'E-mail sturen'],
      });
    }
    
    // Generate normal response
    const response = await chatbot.generateResponse(message, session);
    
    // Add assistant message to session
    const assistantMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      metadata: {
        suggestedActions: response.suggestedActions,
        relatedContent: response.relatedContent,
      },
    };
    session = chatbot.addMessageToSession(session, assistantMessage);
    
    // Update session
    sessions.set(sessionId || session.id, session);
    
    return NextResponse.json({
      sessionId: session.id,
      response: response.message,
      suggestedActions: response.suggestedActions,
      relatedContent: response.relatedContent,
      shouldCollectInfo: response.shouldCollectInfo,
      nextQuestion: response.nextQuestion,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Chat failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'SessionId is required' },
        { status: 400 }
      );
    }
    
    const session = sessions.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      sessionId: session.id,
      messages: session.messages,
      context: session.context,
    });
  } catch (error) {
    console.error('Chat history API error:', error);
    return NextResponse.json(
      { error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}