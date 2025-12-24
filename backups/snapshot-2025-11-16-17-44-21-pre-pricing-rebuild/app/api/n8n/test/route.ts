/**
 * n8n LinkedIn Webhook Test Endpoint
 * 
 * This endpoint simulates n8n webhook calls for testing the LinkedIn integration
 * Provides both automated tests and a simple UI for manual testing
 * 
 * GET /api/n8n/test - Shows test interface and sample payloads
 * POST /api/n8n/test - Sends test webhook to the LinkedIn endpoint
 * 
 * Author: Claude Code - n8n Testing Suite
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'

// Sample LinkedIn post payloads for testing
const samplePayloads = {
  basic: {
    linkedinId: `urn:li:share:${Date.now()}`,
    author: "Workflo B.V.",
    content: "Excited to announce our latest IT innovation! 🚀 We've successfully implemented a cutting-edge cloud infrastructure solution that reduces deployment time by 70%. #CloudComputing #Innovation #ITServices",
    url: "https://www.linkedin.com/posts/workflo_cloudcomputing-innovation-itservices-activity-1234567890",
    publishedAt: new Date().toISOString(),
    likes: 42,
    comments: 5,
    shares: 3,
    hashtags: ["#CloudComputing", "#Innovation", "#ITServices"]
  },
  withImage: {
    linkedinId: `urn:li:share:${Date.now()}_img`,
    author: "Florian - Workflo B.V.",
    content: "Check out our new office setup in Amsterdam! 🏢 Our team is growing and we're excited about the amazing projects ahead. Join us on this journey! #Amsterdam #TechOffice #TeamWorkflo",
    url: "https://www.linkedin.com/posts/workflo_amsterdam-techoffice-teamworkflo-activity-9876543210",
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    imageUrl: "https://media.licdn.com/dms/image/example-office-photo.jpg",
    likes: 128,
    comments: 12,
    shares: 8,
    hashtags: ["#Amsterdam", "#TechOffice", "#TeamWorkflo"],
    companyPage: "Workflo B.V.",
    postType: "image"
  },
  withMetrics: {
    linkedinId: `urn:li:share:${Date.now()}_metrics`,
    author: "Workflo Team",
    content: "🎯 Key achievements this quarter:\n\n✅ 15 successful project deliveries\n✅ 98% client satisfaction rate\n✅ 3 new team members joined\n✅ Launched our new AI-powered support system\n\nThank you to our amazing clients and team! #Success #Quarterly #Achievement",
    url: "https://www.linkedin.com/posts/workflo_success-quarterly-achievement-activity-5555555555",
    publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    imageUrl: "https://media.licdn.com/dms/image/quarterly-report.png",
    likes: 256,
    comments: 23,
    shares: 15,
    hashtags: ["#Success", "#Quarterly", "#Achievement", "#TeamWork"],
    companyPage: "Workflo B.V.",
    postType: "image",
    metrics: {
      impressions: 5420,
      clicks: 312,
      engagementRate: 5.76
    }
  },
  article: {
    linkedinId: `urn:li:activity:${Date.now()}`,
    author: "Workflo B.V.",
    content: "New blog post: \"The Future of Cloud Infrastructure in 2025\"\n\nWe explore emerging trends, best practices, and what businesses should prepare for in the coming year.\n\nRead more on our website! #CloudInfrastructure #TechTrends #Blog",
    url: "https://www.linkedin.com/posts/workflo_cloudinfrastructure-techtrends-blog-activity-7777777777",
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    likes: 89,
    comments: 7,
    shares: 12,
    hashtags: ["#CloudInfrastructure", "#TechTrends", "#Blog"],
    postType: "article"
  },
  minimal: {
    author: "Workflo B.V.",
    content: "Happy Monday everyone! Ready for another productive week ahead. 💪"
  },
  withSpecialChars: {
    linkedinId: `urn:li:share:${Date.now()}_special`,
    author: "Workflo B.V. | IT & Cloud",
    content: "Code snippet of the day:\n\n```\nconst success = dedication + innovation + teamwork;\nconsole.log('Result:', success); // Output: 🚀\n```\n\n#Coding #JavaScript #Development",
    url: "https://www.linkedin.com/posts/workflo_coding-javascript-development-activity-3333333333",
    publishedAt: new Date().toISOString(),
    likes: 67,
    comments: 4,
    shares: 2,
    hashtags: ["#Coding", "#JavaScript", "#Development"]
  }
}

/**
 * GET handler - Display test interface and documentation
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format')
  
  // Return JSON if requested
  if (format === 'json') {
    return NextResponse.json({
      endpoint: '/api/n8n/linkedin',
      testEndpoint: '/api/n8n/test',
      samplePayloads,
      instructions: {
        manual: 'POST to /api/n8n/test with { "payload": "basic" | "withImage" | "withMetrics" | "article" | "minimal" | "withSpecialChars" | <custom-object> }',
        n8n: 'Use HTTP Request node with POST method to /api/n8n/linkedin',
        curl: 'curl -X POST http://localhost:3000/api/n8n/test -H "Content-Type: application/json" -d \'{"payload": "basic"}\''
      }
    })
  }
  
  // Return HTML test interface
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>n8n LinkedIn Webhook Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .main-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        @media (max-width: 768px) {
            .main-grid {
                grid-template-columns: 1fr;
            }
        }
        .card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .card h2 {
            margin-bottom: 20px;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .payload-selector {
            margin-bottom: 20px;
        }
        .payload-selector label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }
        .payload-selector select {
            width: 100%;
            padding: 10px;
            border: 2px solid #e1e4e8;
            border-radius: 5px;
            font-size: 16px;
            background: white;
        }
        .payload-editor {
            margin-bottom: 20px;
        }
        .payload-editor label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }
        .payload-editor textarea {
            width: 100%;
            min-height: 300px;
            padding: 12px;
            border: 2px solid #e1e4e8;
            border-radius: 5px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
            resize: vertical;
        }
        .button-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        button {
            flex: 1;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        .btn-secondary {
            background: #f6f8fa;
            color: #333;
            border: 2px solid #e1e4e8;
        }
        .btn-secondary:hover {
            background: #e1e4e8;
        }
        .response-area {
            background: #f6f8fa;
            border-radius: 5px;
            padding: 15px;
            min-height: 200px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
            white-space: pre-wrap;
            word-break: break-word;
            max-height: 400px;
            overflow-y: auto;
        }
        .status {
            padding: 8px 12px;
            border-radius: 5px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .status.pending {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }
        .info-section {
            margin-top: 20px;
            padding: 15px;
            background: #f0f3ff;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }
        .info-section h3 {
            margin-bottom: 10px;
            color: #333;
        }
        .info-section code {
            background: #e1e4e8;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
        }
        .endpoint-info {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 5px;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔗 n8n LinkedIn Webhook Test</h1>
            <p>Test the LinkedIn post import integration</p>
        </div>
        
        <div class="main-grid">
            <div class="card">
                <h2>📝 Test Payload</h2>
                
                <div class="payload-selector">
                    <label for="payloadType">Select Sample Payload:</label>
                    <select id="payloadType" onchange="loadPayload(this.value)">
                        <option value="basic">Basic Post</option>
                        <option value="withImage">Post with Image</option>
                        <option value="withMetrics">Post with Full Metrics</option>
                        <option value="article">Article Share</option>
                        <option value="minimal">Minimal (Required Fields Only)</option>
                        <option value="withSpecialChars">With Special Characters</option>
                        <option value="custom">Custom Payload</option>
                    </select>
                </div>
                
                <div class="payload-editor">
                    <label for="payload">Payload JSON:</label>
                    <textarea id="payload" placeholder="Enter JSON payload...">${JSON.stringify(samplePayloads.basic, null, 2)}</textarea>
                </div>
                
                <div class="button-group">
                    <button class="btn-primary" onclick="sendWebhook()">
                        🚀 Send Test Webhook
                    </button>
                    <button class="btn-secondary" onclick="formatJSON()">
                        ✨ Format JSON
                    </button>
                </div>
                
                <div class="info-section">
                    <h3>ℹ️ Webhook Details</h3>
                    <div class="endpoint-info">
                        <strong>Endpoint:</strong> <code>/api/n8n/linkedin</code><br>
                        <strong>Method:</strong> <code>POST</code><br>
                        <strong>Content-Type:</strong> <code>application/json</code>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h2>📊 Response</h2>
                <div id="status"></div>
                <div id="response" class="response-area">Ready to test...</div>
                
                <div class="info-section">
                    <h3>🔧 n8n Configuration</h3>
                    <p>To use this in n8n:</p>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li>Add HTTP Request node</li>
                        <li>Set URL: <code>https://your-domain.com/api/n8n/linkedin</code></li>
                        <li>Method: <code>POST</code></li>
                        <li>Body Content Type: <code>JSON</code></li>
                        <li>Add your LinkedIn data to Body Parameters</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        const samplePayloads = ${JSON.stringify(samplePayloads)};
        
        function loadPayload(type) {
            const textarea = document.getElementById('payload');
            if (type === 'custom') {
                textarea.value = JSON.stringify({
                    author: "Your Name",
                    content: "Your LinkedIn post content here...",
                    linkedinId: "urn:li:share:" + Date.now()
                }, null, 2);
            } else if (samplePayloads[type]) {
                textarea.value = JSON.stringify(samplePayloads[type], null, 2);
            }
        }
        
        function formatJSON() {
            const textarea = document.getElementById('payload');
            try {
                const json = JSON.parse(textarea.value);
                textarea.value = JSON.stringify(json, null, 2);
            } catch (e) {
                alert('Invalid JSON: ' + e.message);
            }
        }
        
        async function sendWebhook() {
            const statusDiv = document.getElementById('status');
            const responseDiv = document.getElementById('response');
            const payloadText = document.getElementById('payload').value;
            
            // Show loading state
            statusDiv.innerHTML = '<div class="status pending">⏳ Sending webhook...</div>';
            responseDiv.innerHTML = '<div class="spinner"></div>';
            
            try {
                // Parse payload
                let payload;
                try {
                    payload = JSON.parse(payloadText);
                } catch (e) {
                    throw new Error('Invalid JSON in payload: ' + e.message);
                }
                
                // Send to test endpoint
                const response = await fetch('/api/n8n/test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ payload })
                });
                
                const result = await response.json();
                
                // Display response
                if (result.success) {
                    statusDiv.innerHTML = '<div class="status success">✅ ' + (result.message || 'Webhook sent successfully!') + '</div>';
                } else {
                    statusDiv.innerHTML = '<div class="status error">❌ ' + (result.error || 'Webhook failed') + '</div>';
                }
                
                responseDiv.textContent = JSON.stringify(result, null, 2);
                
            } catch (error) {
                statusDiv.innerHTML = '<div class="status error">❌ Error: ' + error.message + '</div>';
                responseDiv.textContent = error.stack || error.message;
            }
        }
    </script>
</body>
</html>
  `
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}

/**
 * POST handler - Send test webhook to LinkedIn endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payload } = body
    
    // Determine payload to send
    let webhookPayload
    if (typeof payload === 'string' && samplePayloads[payload as keyof typeof samplePayloads]) {
      // Use sample payload
      webhookPayload = samplePayloads[payload as keyof typeof samplePayloads]
    } else if (typeof payload === 'object') {
      // Use custom payload
      webhookPayload = payload
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid payload',
        message: 'Payload must be either a sample name or a custom object'
      }, { status: 400 })
    }
    
    // Get the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`
    
    // Send to the actual LinkedIn webhook endpoint
    const webhookResponse = await fetch(`${baseUrl}/api/n8n/linkedin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'n8n-test-client/1.0',
        'X-Test-Request': 'true'
      },
      body: JSON.stringify(webhookPayload)
    })
    
    const webhookResult = await webhookResponse.json()
    
    // Return the result with additional test metadata
    return NextResponse.json({
      success: webhookResponse.ok,
      testPayload: webhookPayload,
      webhookResponse: {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        body: webhookResult
      },
      message: webhookResponse.ok 
        ? `Test webhook sent successfully. Article created: ${webhookResult.data?.articleUrl || 'N/A'}`
        : `Test webhook failed: ${webhookResult.error || 'Unknown error'}`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}