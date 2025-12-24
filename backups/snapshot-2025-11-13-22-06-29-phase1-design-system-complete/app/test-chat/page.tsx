'use client';

import { AIChatbot } from '@/components/ai/AIChatbot';

export default function TestChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Chatbot Test Page</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Scenarios</h2>
          <div className="space-y-3 mb-6">
            <div className="p-3 bg-blue-50 rounded">
              <h3 className="font-medium mb-2">🔧 Test Halo Integration</h3>
              <p className="text-sm text-gray-600">
                Try: "Ik wil een ticket aanmaken" or "Mijn systeem werkt niet"
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <h3 className="font-medium mb-2">💬 Test AI Responses</h3>
              <p className="text-sm text-gray-600">
                Try: "Vertel over jullie diensten" or "Wat kost managed IT?"
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <h3 className="font-medium mb-2">📞 Test Contact Flow</h3>
              <p className="text-sm text-gray-600">
                Try: "Ik wil contact opnemen" or "Hoe kan ik jullie bereiken?"
              </p>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded p-4">
            <h3 className="font-medium mb-2">Environment Status</h3>
            <ul className="text-sm space-y-1">
              <li className={process.env.OPENAI_API_KEY ? "text-green-600" : "text-red-600"}>
                • OpenAI: {process.env.OPENAI_API_KEY ? "✅ Configured" : "❌ Not configured (using fallback)"}
              </li>
              <li className={process.env.ANTHROPIC_API_KEY ? "text-green-600" : "text-red-600"}>
                • Anthropic: {process.env.ANTHROPIC_API_KEY ? "✅ Configured" : "❌ Not configured (using fallback)"}
              </li>
              <li className={process.env.HALO_CLIENT_ID ? "text-green-600" : "text-orange-600"}>
                • Halo PSA: {process.env.HALO_CLIENT_ID ? "✅ Configured" : "⚠️ Mock mode (no credentials)"}
              </li>
              <li className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-orange-600"}>
                • Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Connected" : "⚠️ Not configured (using memory storage)"}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Click the chat button in the bottom right corner</li>
            <li>Start with a greeting to see the welcome message</li>
            <li>Test different scenarios from the list above</li>
            <li>Check if streaming responses are working smoothly</li>
            <li>Try creating a support ticket (will work in mock mode without Halo credentials)</li>
            <li>Verify that conversation history is maintained</li>
          </ol>
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">⚡ Quick Actions</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                // Trigger the chatbot to open
                const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
                if (chatButton) chatButton.click();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Open Chat
            </button>
            <button
              onClick={() => {
                // Clear session storage
                if (typeof window !== 'undefined') {
                  sessionStorage.clear();
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Clear Session
            </button>
            <a
              href="/api/ai/chat?sessionId=test"
              target="_blank"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm inline-block"
            >
              Test API Endpoint
            </a>
          </div>
        </div>
      </div>
      
      {/* Include the chatbot component */}
      <AIChatbot />
    </div>
  );
}