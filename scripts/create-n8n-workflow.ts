/**
 * Automatically create N8N workflow via API
 * Creates AI-powered FreshRSS to Supabase workflow with filtering
 */

const N8N_API_KEY = process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YWNmNzNjNi1mZmE4LTQ3NDEtYjhmNi1mOGUwZDhhYzVmMzAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MzgyNjc3fQ.4MRPRAsWVzrNptCXaMsGoBaQQpUknuP1wyafhR0ijqg'
const N8N_URL = process.env.N8N_URL || 'https://n8n.workflo.it' // N8N instance URL

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_service_role
const AUTHOR_ID = 'b07398bf-9ad4-4a44-8d54-66d6974a6f20'

interface N8NWorkflow {
  name: string
  nodes: any[]
  connections: any
  active: boolean
  settings: any
}

const workflow: N8NWorkflow = {
  name: 'FreshRSS → AI Filter → Supabase Blog',
  settings: {
    timezone: 'Europe/Amsterdam'
  },
  nodes: [
    // Node 1: Manual Trigger (for testing)
    {
      parameters: {},
      id: 'manual-trigger',
      name: 'Manual Trigger',
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [250, 300]
    },

    // Node 2: FreshRSS Fetch (HTTP Request)
    {
      parameters: {
        url: 'https://rss.workflo.it/i/?a=rss&rid=691df618d13c7&user=workflo&token=n8n_rss_automation_2025&hours=24',
        authentication: 'none',
        options: {
          response: {
            response: {
              responseFormat: 'text'
            }
          }
        }
      },
      id: 'freshrss-fetch',
      name: 'Fetch FreshRSS',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1,
      position: [450, 300]
    },

    // Node 3: Prepare Relevance Check
    {
      parameters: {
        jsCode: `// Prepare relevance check prompt
const items = $input.all();

return items.map(item => {
  const rss = item.json;
  const title = rss.title || 'No title';
  const content = rss.content || rss.description || '';
  const excerpt = content.substring(0, 800);
  const source = rss.link || '';

  const relevancePrompt = \`Bepaal of dit nieuwsartikel RELEVANT is voor een IT services bedrijf (Workflo) dat zich richt op:
- Managed IT Services
- Cybersecurity
- Cloud Solutions (Azure, Microsoft 365)
- Networking & Infrastructure
- Business IT support

ARTIKEL BRON: \${source}
TITEL: \${title}

CONTENT PREVIEW:
\${excerpt}

RELEVANTIE CRITERIA:
✅ RELEVANT als het gaat over:
- IT technologie, software, hardware
- Cybersecurity, hacking, datalekken, privacy
- Cloud computing, SaaS, Microsoft, Azure, AWS
- Bedrijfs-IT, digitalisering, automatisering
- Tech trends relevant voor bedrijven
- IT wetgeving (GDPR, NIS2, etc)

❌ NIET RELEVANT als het gaat over:
- Algemeen nieuws (politiek, economie, sport)
- Entertainment, lifestyle
- Consumer tech zonder business angle

ANTWOORD FORMAT (JSON):
{
  "is_relevant": true of false,
  "relevance_score": 0-100,
  "reasoning": "korte uitleg",
  "suggested_category": "categorie of null",
  "business_value": "waarde voor Workflo klanten"
}

Antwoord ALLEEN met valid JSON.\`;

  return {
    json: {
      ...rss,
      relevance_prompt: relevancePrompt,
      original_title: title,
      original_content: content,
      content_excerpt: excerpt
    }
  };
});`
      },
      id: 'prep-relevance',
      name: 'Prepare Relevance Check',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [650, 300]
    },

    // Node 4: AI Relevance Check (OpenAI LLM)
    {
      parameters: {
        model: 'gpt-4o-mini',
        options: {
          temperature: 0.2,
          maxTokens: 500
        },
        messages: {
          values: [
            {
              role: 'system',
              content: 'Je bent een content filter voor Workflo IT services. Beoordeel relevantie van artikelen. Antwoord ALLEEN met valid JSON.'
            },
            {
              role: 'user',
              content: '={{ $json.relevance_prompt }}'
            }
          ]
        },
        jsonOutput: true
      },
      id: 'ai-relevance',
      name: 'AI Relevance Check',
      type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
      typeVersion: 1,
      position: [850, 300],
      credentials: {
        openAiApi: {
          id: 'openai-workflo',
          name: 'OpenAI Workflo'
        }
      }
    },

    // Node 5: Parse Relevance
    {
      parameters: {
        jsCode: `// Parse AI relevance response
const items = $input.all();

return items.map(item => {
  let relevanceData;

  try {
    const content = item.json.choices[0].message.content;
    relevanceData = JSON.parse(content);
  } catch (error) {
    console.error('Parse error:', error);
    relevanceData = {
      is_relevant: false,
      relevance_score: 0,
      reasoning: 'Parse error'
    };
  }

  return {
    json: {
      ...item.json,
      relevance: relevanceData,
      is_relevant: relevanceData.is_relevant,
      relevance_score: relevanceData.relevance_score || 0
    }
  };
});`
      },
      id: 'parse-relevance',
      name: 'Parse Relevance',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [1050, 300]
    },

    // Node 6: Filter (only relevant)
    {
      parameters: {
        conditions: {
          boolean: [
            {
              value1: '={{ $json.is_relevant }}',
              value2: true
            },
            {
              value1: '={{ $json.relevance_score }}',
              operation: 'largerEqual',
              value2: 60
            }
          ]
        },
        combineOperation: 'all'
      },
      id: 'filter-relevant',
      name: 'Filter Relevant Only',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [1250, 300]
    },

    // Node 7: Prepare Metadata Prompt
    {
      parameters: {
        jsCode: `// Prepare metadata generation for relevant articles
const items = $input.all();

return items.map(item => {
  const rss = item.json;
  const relevance = item.json.relevance || {};

  const metadataPrompt = \`Genereer metadata voor dit IT artikel.

TITEL: \${rss.original_title}
CONTENT: \${rss.original_content || rss.content_excerpt}
RELEVANTIE: \${relevance.relevance_score}/100

Geef JSON response met:
{
  "category": "IT Support, Cybersecurity, Cloud Solutions, Microsoft 365, Networking, Trends, Nieuws",
  "tags": ["4-6 Nederlandse tags"],
  "excerpt": "pakkende samenvatting (140-160 karakters)",
  "meta_description": "SEO description (150-160 karakters)",
  "target_audience": "specifieke doelgroep",
  "difficulty_level": "beginner/intermediate/advanced",
  "reading_time": minuten als integer,
  "keywords": ["5-8 SEO keywords"],
  "call_to_action": "concrete CTA",
  "related_services": ["Workflo diensten"],
  "workflo_angle": "hoe Workflo kan helpen"
}

Antwoord ALLEEN met valid JSON.\`;

  return {
    json: {
      ...rss,
      metadata_prompt: metadataPrompt
    }
  };
});`
      },
      id: 'prep-metadata',
      name: 'Prepare Metadata Prompt',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [1450, 200]
    },

    // Node 8: AI Metadata Generation (OpenAI LLM)
    {
      parameters: {
        model: 'gpt-4o-mini',
        options: {
          temperature: 0.3,
          maxTokens: 1000
        },
        messages: {
          values: [
            {
              role: 'system',
              content: 'Je bent SEO specialist voor Workflo IT services. Genereer metadata voor artikelen. Antwoord ALLEEN met valid JSON.'
            },
            {
              role: 'user',
              content: '={{ $json.metadata_prompt }}'
            }
          ]
        },
        jsonOutput: true
      },
      id: 'ai-metadata',
      name: 'Generate Metadata',
      type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
      typeVersion: 1,
      position: [1650, 200],
      credentials: {
        openAiApi: {
          id: 'openai-workflo',
          name: 'OpenAI Workflo'
        }
      }
    },

    // Node 9: Parse & Transform
    {
      parameters: {
        jsCode: `// Parse metadata and transform to Supabase format
const items = $input.all();
const AUTHOR_ID = '${AUTHOR_ID}';

return items.map(item => {
  let metadata;

  try {
    metadata = JSON.parse(item.json.choices[0].message.content);
  } catch {
    metadata = {
      category: 'Nieuws',
      tags: ['IT'],
      excerpt: item.json.content_excerpt?.substring(0, 160) || '',
      reading_time: 5
    };
  }

  const rss = item.json;

  // Clean slug
  const slug = (rss.original_title || 'untitled')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);

  // Merge tags
  const allTags = [
    ...(metadata.tags || []),
    ...(Array.isArray(rss.categories) ? rss.categories : [])
  ];
  const uniqueTags = [...new Set(allTags)].slice(0, 10);

  return {
    json: {
      title: rss.original_title || 'Untitled',
      slug: slug,
      content: rss.original_content || '',
      excerpt: metadata.excerpt,
      featured_image: rss.image || null,
      author_id: AUTHOR_ID,
      status: 'published',
      published_at: rss.pubDate || new Date().toISOString(),
      tags: uniqueTags,
      read_time_minutes: metadata.reading_time || 5,
      view_count: 0,
      meta_title: (metadata.meta_description || metadata.excerpt || '').substring(0, 60),
      meta_description: metadata.meta_description || metadata.excerpt || ''
    }
  };
});`
      },
      id: 'transform-supabase',
      name: 'Transform to Supabase',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [1850, 200]
    },

    // Node 10: Insert into Supabase
    {
      parameters: {
        operation: 'insert',
        tableId: 'blog_posts',
        options: {
          returning: 'minimal'
        }
      },
      id: 'supabase-insert',
      name: 'Insert into Supabase',
      type: 'n8n-nodes-base.supabase',
      typeVersion: 1,
      position: [2050, 200]
    }
  ],
  connections: {
    'manual-trigger': {
      main: [[{ node: 'freshrss-fetch', type: 'main', index: 0 }]]
    },
    'freshrss-fetch': {
      main: [[{ node: 'prep-relevance', type: 'main', index: 0 }]]
    },
    'prep-relevance': {
      main: [[{ node: 'ai-relevance', type: 'main', index: 0 }]]
    },
    'ai-relevance': {
      main: [[{ node: 'parse-relevance', type: 'main', index: 0 }]]
    },
    'parse-relevance': {
      main: [[{ node: 'filter-relevant', type: 'main', index: 0 }]]
    },
    'filter-relevant': {
      main: [
        [{ node: 'prep-metadata', type: 'main', index: 0 }], // TRUE branch
        [] // FALSE branch (discard)
      ]
    },
    'prep-metadata': {
      main: [[{ node: 'ai-metadata', type: 'main', index: 0 }]]
    },
    'ai-metadata': {
      main: [[{ node: 'transform-supabase', type: 'main', index: 0 }]]
    },
    'transform-supabase': {
      main: [[{ node: 'supabase-insert', type: 'main', index: 0 }]]
    }
  }
}

async function createWorkflow() {
  try {
    console.log('🚀 Creating N8N workflow...')

    const response = await fetch(`${N8N_URL}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workflow)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create workflow: ${response.status} - ${error}`)
    }

    const result = await response.json()
    console.log('✅ Workflow created successfully!')
    console.log(`📋 Workflow ID: ${result.id}`)
    console.log(`🔗 URL: ${N8N_URL}/workflow/${result.id}`)

    return result
  } catch (error) {
    console.error('❌ Error creating workflow:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  createWorkflow()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

export { createWorkflow, workflow }
