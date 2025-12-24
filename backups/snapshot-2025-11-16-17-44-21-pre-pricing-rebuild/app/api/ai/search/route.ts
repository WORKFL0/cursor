import { NextRequest, NextResponse } from 'next/server';
import { getSearchEngine, SearchableContent } from '@/lib/ai/search';

// Initialize search engine with sample content
const searchEngine = getSearchEngine();

// Add sample searchable content (in production, this would come from database)
const sampleContent: SearchableContent[] = [
  {
    id: 'service-managed-it',
    title: 'Managed IT Services',
    content: 'Complete IT management and support for your business. 24/7 monitoring, helpdesk support, and proactive maintenance.',
    type: 'service',
    url: '/diensten/managed-it',
    keywords: ['managed services', 'IT support', 'helpdesk', 'monitoring'],
  },
  {
    id: 'service-cloud',
    title: 'Cloud Solutions',
    content: 'Scalable cloud infrastructure, migration services, and cloud optimization for modern businesses.',
    type: 'service',
    url: '/diensten/cloud',
    keywords: ['cloud', 'Azure', 'AWS', 'migration', 'infrastructure'],
  },
  {
    id: 'service-cybersecurity',
    title: 'Cybersecurity',
    content: 'Comprehensive security solutions including firewall management, threat detection, and security awareness training.',
    type: 'service',
    url: '/diensten/cybersecurity',
    keywords: ['security', 'firewall', 'antivirus', 'threat protection', 'cyber'],
  },
  {
    id: 'service-backup',
    title: 'Backup & Disaster Recovery',
    content: 'Reliable data backup solutions and disaster recovery planning to ensure business continuity.',
    type: 'service',
    url: '/diensten/backup-disaster-recovery',
    keywords: ['backup', 'disaster recovery', 'data protection', 'business continuity'],
  },
  {
    id: 'article-remote-work',
    title: 'Best Practices for Remote Work Security',
    content: 'Learn how to secure your remote workforce with VPN, MFA, and endpoint protection strategies.',
    type: 'article',
    url: '/nieuws/remote-work-security',
    keywords: ['remote work', 'VPN', 'security', 'work from home'],
  },
  {
    id: 'faq-password-reset',
    title: 'How do I reset my password?',
    content: 'To reset your password, click on the "Forgot Password" link on the login page or contact our helpdesk.',
    type: 'faq',
    url: '/faq#password-reset',
    keywords: ['password', 'reset', 'login', 'access'],
  },
];

// Initialize with sample content
searchEngine.addContent(sampleContent);

export async function POST(request: NextRequest) {
  try {
    const { query, options } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Perform search
    const results = await searchEngine.search(query, {
      limit: options?.limit || 10,
      type: options?.type,
      useSemanticSearch: options?.useSemanticSearch !== false,
    });
    
    return NextResponse.json({
      results,
      query,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partial = searchParams.get('q');
    
    if (!partial) {
      return NextResponse.json(
        { error: 'Query parameter q is required' },
        { status: 400 }
      );
    }
    
    // Get search suggestions
    const suggestions = await searchEngine.getSuggestions(partial, 5);
    
    return NextResponse.json({
      suggestions,
      partial,
    });
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}