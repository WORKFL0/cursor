import { NextRequest, NextResponse } from 'next/server';
import { WorkBot, ChatSession, ChatMessage } from '@/lib/ai/chatbot';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// In-memory session storage (fallback when Supabase is not configured)
const sessions = new Map<string, ChatSession>();
const chatbot = new WorkBot();

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userInfo, createTicket, stream = true } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Get or create session
    let session = await getOrCreateSession(sessionId, userInfo);
    
    // Add user message to session
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    session = await addMessageToSession(session, userMessage);
    
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
      
      await saveConversation(session);
      
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
      
      await saveConversation(session);
      
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
    
    // If streaming is requested, use streaming response
    if (stream) {
      return streamResponse(message, session);
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
    session = await addMessageToSession(session, assistantMessage);
    
    // Save conversation to database
    await saveConversation(session);
    
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

// Stream response for better UX
async function streamResponse(message: string, session: ChatSession) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Generate response
        const response = await chatbot.generateResponse(message, session);
        
        // Simulate streaming by sending chunks
        const chunks = response.message.split(' ');
        let accumulated = '';
        
        for (let i = 0; i < chunks.length; i++) {
          accumulated += (i === 0 ? '' : ' ') + chunks[i];
          const chunk = encoder.encode(chunks[i] + (i < chunks.length - 1 ? ' ' : ''));
          controller.enqueue(chunk);
          
          // Add small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Add metadata at the end
        const metadata = JSON.stringify({
          suggestedActions: response.suggestedActions,
          relatedContent: response.relatedContent,
        });
        controller.enqueue(encoder.encode(`\n\n[METADATA]${metadata}[/METADATA]`));
        
        // Save the complete message to session
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
        session = await addMessageToSession(session, assistantMessage);
        await saveConversation(session);
        
        controller.close();
      } catch (error) {
        console.error('Streaming error:', error);
        controller.error(error);
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Get or create session from database or memory
async function getOrCreateSession(
  sessionId: string | undefined, 
  userInfo?: any
): Promise<ChatSession> {
  // Try to get from database first
  if (sessionId && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (data && !error) {
        return {
          id: data.id,
          messages: data.messages || [],
          context: data.context || { userInfo },
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };
      }
    } catch (error) {
      console.error('Error fetching session from database:', error);
    }
  }
  
  // Fallback to memory storage
  let session = sessions.get(sessionId || '');
  if (!session) {
    session = chatbot.createSession(userInfo);
    sessions.set(session.id, session);
  }
  
  return session;
}

// Add message to session
async function addMessageToSession(
  session: ChatSession,
  message: ChatMessage
): Promise<ChatSession> {
  const updatedSession = chatbot.addMessageToSession(session, message);
  
  // Update in memory
  sessions.set(session.id, updatedSession);
  
  return updatedSession;
}

// Save conversation to Supabase
async function saveConversation(session: ChatSession): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('Supabase not configured, using memory storage only');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .upsert({
        id: session.id,
        messages: session.messages,
        context: session.context,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error saving conversation to database:', error);
    }
  } catch (error) {
    console.error('Error saving conversation:', error);
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
    
    // Try to get from database first
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();
        
        if (data && !error) {
          return NextResponse.json({
            sessionId: data.id,
            messages: data.messages || [],
            context: data.context || {},
          });
        }
      } catch (error) {
        console.error('Error fetching session from database:', error);
      }
    }
    
    // Fallback to memory storage
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