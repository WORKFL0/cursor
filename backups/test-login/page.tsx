'use client'

import { useState } from 'react'

export default function TestLoginPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cms/auth/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@workflo.it',
          password: 'Admin123!'
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.toString() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Login API</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
          <p className="text-gray-600">Email: admin@workflo.it</p>
          <p className="text-gray-600">Password: Admin123!</p>
        </div>

        <button
          onClick={testLogin}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>

        {result && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Direct Links:</h2>
          <div className="space-y-2">
            <a href="/cms/login" className="text-blue-500 hover:underline block">
              → CMS Login Page
            </a>
            <a href="/cms" className="text-blue-500 hover:underline block">
              → CMS Dashboard
            </a>
            <a href="/nieuws" className="text-blue-500 hover:underline block">
              → News Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}