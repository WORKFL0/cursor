import { Metadata } from 'next'
import { WifiOff, Smartphone, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'You are offline - Workflo IT Services',
  description: 'You are currently offline. Please check your internet connection.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Offline Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <WifiOff className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            You're Offline
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            It looks like you've lost your internet connection. Don't worry, some parts of 
            Workflo IT Services are available offline.
          </p>

          {/* Offline Features */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Available Offline:</h3>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Previously visited pages
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Service information
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Contact details
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Cached resources
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
          </div>
        </div>

        {/* Mobile App Suggestion */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Smartphone className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm mb-1">
                Install our PWA
              </h4>
              <p className="text-blue-700 text-xs leading-relaxed">
                Add Workflo to your home screen for a better offline experience and faster access.
              </p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-4 text-center">
          <div id="connection-status" className="text-sm text-gray-500">
            Checking connection...
          </div>
        </div>
      </div>

      {/* Connection Status Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const statusEl = document.getElementById('connection-status');
            
            function updateStatus() {
              if (navigator.onLine) {
                statusEl.textContent = 'Connection restored! Refreshing...';
                statusEl.className = 'text-sm text-green-600';
                setTimeout(() => window.location.reload(), 1000);
              } else {
                statusEl.textContent = 'Still offline...';
                statusEl.className = 'text-sm text-red-500';
              }
            }
            
            window.addEventListener('online', updateStatus);
            window.addEventListener('offline', updateStatus);
            
            // Initial check
            updateStatus();
            
            // Periodic check every 10 seconds
            setInterval(updateStatus, 10000);
          })();
        `
      }} />
    </div>
  )
}