import { NextRequest, NextResponse } from 'next/server';
import { getHaloClient } from '@/lib/integrations/halo-itsm';

/**
 * Main Halo API route for general integration
 * Provides endpoints for knowledge base search and system status
 */

// GET: Search knowledge base or check status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const query = searchParams.get('query');
    
    const haloClient = getHaloClient();
    
    switch (action) {
      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Query parameter is required for search' },
            { status: 400 }
          );
        }
        
        // For now, return mock knowledge base results
        // This would integrate with Halo's knowledge base API when available
        const searchResults = getMockKnowledgeBase(query);
        
        return NextResponse.json({
          success: true,
          results: searchResults,
          total: searchResults.length,
        });
        
      case 'status':
        // Check Halo system status
        return NextResponse.json({
          success: true,
          status: 'operational',
          message: 'Halo ITSM is operational',
          features: {
            ticketing: true,
            knowledgeBase: true,
            chat: true,
          },
        });
        
      default:
        return NextResponse.json({
          success: true,
          message: 'Halo API is ready',
          availableActions: ['search', 'status'],
        });
    }
  } catch (error) {
    console.error('Halo API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST: Create ticket or add note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    
    const haloClient = getHaloClient();
    
    switch (action) {
      case 'create-ticket':
        const { issue, userInfo, sessionId, conversationHistory } = data;
        
        if (!issue) {
          return NextResponse.json(
            { error: 'Issue description is required' },
            { status: 400 }
          );
        }
        
        const ticketResponse = await haloClient.createTicketFromChat(
          {
            sessionId: sessionId || 'web-' + Date.now(),
            conversationHistory: conversationHistory || [],
            metadata: {
              source: 'chatbot',
              page: data.page,
            },
          },
          issue,
          userInfo
        );
        
        return NextResponse.json({
          success: true,
          ticket: ticketResponse,
        });
        
      case 'add-note':
        const { ticketId, note, isPublic = true } = data;
        
        if (!ticketId || !note) {
          return NextResponse.json(
            { error: 'Ticket ID and note are required' },
            { status: 400 }
          );
        }
        
        const noteAdded = await haloClient.addTicketNote(ticketId, note, isPublic);
        
        return NextResponse.json({
          success: noteAdded,
          message: noteAdded ? 'Note added successfully' : 'Failed to add note',
        });
        
      case 'search-tickets':
        const { email, status } = data;
        
        const tickets = await haloClient.searchTickets({
          email,
          status,
          createdAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        });
        
        return NextResponse.json({
          success: true,
          tickets,
          total: tickets.length,
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Halo API POST error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Mock knowledge base for development/fallback
function getMockKnowledgeBase(query: string): Array<{
  id: string;
  title: string;
  content: string;
  category: string;
  url: string;
  relevance: number;
}> {
  const lowerQuery = query.toLowerCase();
  const knowledgeBase = [
    {
      id: 'kb-001',
      title: 'Wachtwoord resetten in Microsoft 365',
      content: 'Om je wachtwoord te resetten: 1. Ga naar portal.office.com, 2. Klik op "Wachtwoord vergeten", 3. Volg de instructies in je e-mail',
      category: 'Microsoft 365',
      url: '/kb/password-reset',
    },
    {
      id: 'kb-002',
      title: 'VPN verbinding instellen',
      content: 'Download de VPN client van het bedrijfsportaal. Voer je gebruikersnaam en wachtwoord in. Selecteer de Amsterdam server.',
      category: 'Netwerk',
      url: '/kb/vpn-setup',
    },
    {
      id: 'kb-003',
      title: 'E-mail instellen op mobiel',
      content: 'Voeg een Exchange account toe met server: mail.workflo.it, gebruikersnaam: je e-mailadres, SSL vereist.',
      category: 'E-mail',
      url: '/kb/mobile-email',
    },
    {
      id: 'kb-004',
      title: 'Backup terugzetten',
      content: 'Neem contact op met IT support voor het terugzetten van backups. Geef de datum en bestanden door die je nodig hebt.',
      category: 'Backup',
      url: '/kb/restore-backup',
    },
    {
      id: 'kb-005',
      title: 'Printer installeren',
      content: 'Ga naar Instellingen > Printers. Klik op "Printer toevoegen". Selecteer de netwerkprinter uit de lijst.',
      category: 'Hardware',
      url: '/kb/printer-setup',
    },
  ];
  
  // Simple relevance scoring
  const results = knowledgeBase
    .map(article => {
      let relevance = 0;
      const lowerTitle = article.title.toLowerCase();
      const lowerContent = article.content.toLowerCase();
      
      if (lowerTitle.includes(lowerQuery)) relevance += 2;
      if (lowerContent.includes(lowerQuery)) relevance += 1;
      
      // Check for word matches
      const queryWords = lowerQuery.split(' ');
      queryWords.forEach(word => {
        if (word.length > 2) {
          if (lowerTitle.includes(word)) relevance += 0.5;
          if (lowerContent.includes(word)) relevance += 0.25;
        }
      });
      
      return { ...article, relevance };
    })
    .filter(article => article.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);
  
  return results;
}