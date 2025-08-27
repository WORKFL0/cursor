import { NextRequest, NextResponse } from 'next/server';
import { getFAQSystem, FAQ } from '@/lib/ai/faq-intelligence';

// Sample FAQs (in production, these would come from database)
const sampleFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What services does Workflo offer?',
    answer: 'Workflo offers comprehensive IT services including Managed IT, Cloud Solutions, Cybersecurity, Microsoft 365, VoIP Telefonie, Hardware as a Service, and Backup & Disaster Recovery.',
    category: 'General',
    tags: ['services', 'offerings', 'solutions'],
    relatedQuestions: ['faq-2', 'faq-3'],
  },
  {
    id: 'faq-2',
    question: 'How much does Managed IT cost?',
    answer: 'Our Managed IT services start from €99 per user per month for small businesses. Pricing is customized based on your specific needs, number of users, and required service level.',
    category: 'Pricing',
    tags: ['pricing', 'managed-it', 'cost'],
    relatedQuestions: ['faq-1', 'faq-8'],
  },
  {
    id: 'faq-3',
    question: 'Do you provide 24/7 support?',
    answer: 'Yes, we provide 24/7 monitoring and support for critical issues. Our standard helpdesk hours are Monday-Friday 8:00-18:00, with emergency support available outside these hours.',
    category: 'Support',
    tags: ['support', 'availability', 'helpdesk'],
    relatedQuestions: ['faq-4'],
  },
  {
    id: 'faq-4',
    question: 'How quickly do you respond to support tickets?',
    answer: 'Our SLA guarantees: Critical issues - 1 hour, High priority - 2 hours, Medium priority - 4 hours, Low priority - 8 hours. Most issues are resolved within the first response.',
    category: 'Support',
    tags: ['support', 'response-time', 'SLA'],
    relatedQuestions: ['faq-3'],
  },
  {
    id: 'faq-5',
    question: 'Can you help us migrate to the cloud?',
    answer: 'Absolutely! We provide complete cloud migration services including assessment, planning, migration, and optimization. We work with Azure, AWS, and other major cloud platforms.',
    category: 'Cloud',
    tags: ['cloud', 'migration', 'Azure', 'AWS'],
    relatedQuestions: ['faq-6'],
  },
  {
    id: 'faq-6',
    question: 'How do you ensure data security during cloud migration?',
    answer: 'We use encrypted transfer protocols, maintain data redundancy, perform thorough testing, and follow industry best practices. Your data security is our top priority throughout the migration process.',
    category: 'Cloud',
    tags: ['security', 'cloud', 'migration', 'data-protection'],
    relatedQuestions: ['faq-5', 'faq-7'],
  },
  {
    id: 'faq-7',
    question: 'What cybersecurity measures do you implement?',
    answer: 'We implement multi-layered security including firewalls, antivirus, anti-malware, email security, MFA, security awareness training, and regular security assessments.',
    category: 'Security',
    tags: ['cybersecurity', 'protection', 'security-measures'],
    relatedQuestions: ['faq-6'],
  },
  {
    id: 'faq-8',
    question: 'Do you offer custom packages for small businesses?',
    answer: 'Yes, we offer flexible packages specifically designed for small businesses, starting from just 5 users. These include essential services at affordable prices.',
    category: 'Pricing',
    tags: ['small-business', 'packages', 'pricing'],
    relatedQuestions: ['faq-2'],
  },
  {
    id: 'faq-9',
    question: 'How often do you perform backups?',
    answer: 'We perform incremental backups every hour and full backups daily. Critical systems can be configured for continuous replication. All backups are encrypted and stored in multiple locations.',
    category: 'Backup',
    tags: ['backup', 'frequency', 'disaster-recovery'],
    relatedQuestions: ['faq-10'],
  },
  {
    id: 'faq-10',
    question: 'What is your disaster recovery RTO and RPO?',
    answer: 'Our standard RTO (Recovery Time Objective) is 4 hours and RPO (Recovery Point Objective) is 1 hour. Premium plans offer RTO of 1 hour and RPO of 15 minutes.',
    category: 'Backup',
    tags: ['disaster-recovery', 'RTO', 'RPO', 'backup'],
    relatedQuestions: ['faq-9'],
  },
];

// Initialize FAQ system
const faqSystem = getFAQSystem(sampleFAQs);

// Search FAQs
export async function POST(request: NextRequest) {
  try {
    const { query, options } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Find matching FAQs
    const matches = await faqSystem.findMatches(query, {
      limit: options?.limit || 5,
      category: options?.category,
      useSemanticSearch: options?.useSemanticSearch !== false,
      includeRelated: options?.includeRelated,
    });
    
    // If no matches found, try to generate an answer
    let generatedAnswer = null;
    if (matches.length === 0 && options?.generateAnswer) {
      generatedAnswer = await faqSystem.generateAnswer(query);
    }
    
    return NextResponse.json({
      matches,
      generatedAnswer,
      query,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('FAQ search API error:', error);
    return NextResponse.json(
      { error: 'FAQ search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Get FAQ suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'suggestions') {
      const partial = searchParams.get('q');
      if (!partial) {
        return NextResponse.json(
          { error: 'Query parameter q is required' },
          { status: 400 }
        );
      }
      
      const suggestions = await faqSystem.suggestQuestions(partial, 5);
      return NextResponse.json({ suggestions });
    }
    
    if (action === 'trending') {
      const trending = faqSystem.getTrendingQuestions(5);
      return NextResponse.json({ trending });
    }
    
    if (action === 'categories') {
      const categories = faqSystem.getCategories();
      return NextResponse.json({ categories });
    }
    
    if (action === 'by-category') {
      const category = searchParams.get('category');
      if (!category) {
        return NextResponse.json(
          { error: 'Category parameter is required' },
          { status: 400 }
        );
      }
      
      const faqs = faqSystem.getFAQsByCategory(category);
      return NextResponse.json({ faqs, category });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: suggestions, trending, categories, or by-category' },
      { status: 400 }
    );
  } catch (error) {
    console.error('FAQ API error:', error);
    return NextResponse.json(
      { error: 'FAQ operation failed' },
      { status: 500 }
    );
  }
}

// Update FAQ metrics
export async function PUT(request: NextRequest) {
  try {
    const { faqId, metric } = await request.json();
    
    if (!faqId || !metric) {
      return NextResponse.json(
        { error: 'faqId and metric are required' },
        { status: 400 }
      );
    }
    
    if (!['view', 'helpful', 'notHelpful'].includes(metric)) {
      return NextResponse.json(
        { error: 'Invalid metric. Use: view, helpful, or notHelpful' },
        { status: 400 }
      );
    }
    
    faqSystem.updateFAQMetrics(faqId, metric as 'view' | 'helpful' | 'notHelpful');
    
    return NextResponse.json({
      success: true,
      faqId,
      metric,
    });
  } catch (error) {
    console.error('FAQ update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ metrics' },
      { status: 500 }
    );
  }
}