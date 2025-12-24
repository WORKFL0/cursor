import { NextRequest, NextResponse } from 'next/server';
import { WorkBot, ChatSession } from '@/lib/ai/chatbot';

const chatbot = new WorkBot();

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, issue, userInfo, ticketId } = await request.json();
    
    // Mock session for now - in production, retrieve from database
    const session: ChatSession = {
      id: sessionId || 'temp-session',
      messages: [],
      context: {
        userInfo: userInfo || {},
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    switch (action) {
      case 'create':
        if (!issue) {
          return NextResponse.json(
            { error: 'Issue description is required' },
            { status: 400 }
          );
        }
        
        const ticketResult = await chatbot.createSupportTicket(
          session,
          issue,
          userInfo
        );
        
        return NextResponse.json(ticketResult);
        
      case 'status':
        if (!ticketId) {
          return NextResponse.json(
            { error: 'Ticket ID is required' },
            { status: 400 }
          );
        }
        
        const status = await chatbot.checkTicketStatus(ticketId);
        
        return NextResponse.json({
          success: true,
          message: status,
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Halo ticket API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process ticket request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}