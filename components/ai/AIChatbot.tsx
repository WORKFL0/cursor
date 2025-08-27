'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
// import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedActions?: string[];
  relatedContent?: Array<{ title: string; url: string; type: string }>;
  ticketNumber?: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [requiresTicket, setRequiresTicket] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string; phone?: string; company?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate session ID
    setSessionId(Math.random().toString(36).substr(2, 9));
    
    // Show welcome message
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Hallo! Ik ben WorkBot, je digitale IT-adviseur van Workflo. Waar kan ik je vandaag mee helpen?',
        timestamp: new Date(),
        suggestedActions: [
          'Vertel over jullie diensten',
          'Ik heb IT ondersteuning nodig',
          'Vraag een offerte aan',
          'Contact met verkoop',
        ],
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText: string = input) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setSuggestedActions([]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId,
          userInfo,
          createTicket: requiresTicket,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Invalid response from API');
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestedActions: data.suggestedActions,
        relatedContent: data.relatedContent,
        ticketNumber: data.ticketNumber,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSuggestedActions(data.suggestedActions || []);
      
      // Check if we need to collect ticket info
      if (data.requiresTicket) {
        setRequiresTicket(true);
      } else if (data.ticketCreated) {
        setRequiresTicket(false);
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      
      // Provide a more helpful error message based on the error type
      let errorMessage = 'Mijn excuses, ik heb problemen met de verbinding. Probeer het opnieuw of neem direct contact op met ons support team.';
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        
        // If it's a network error, suggest checking connection
        if (error.message.includes('fetch')) {
          errorMessage = 'Kan geen verbinding maken met de server. Controleer je internetverbinding en probeer het opnieuw.';
        }
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-workflo-yellow hover:bg-workflo-yellow/90 text-black rounded-full p-4 shadow-lg transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-h-[80vh]"
          >
            <Card className="flex flex-col h-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-workflo-yellow text-black rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <h3 className="font-semibold">WorkBot - Je IT Adviseur</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-workflo-yellow/90 rounded-full p-1 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`rounded-full p-2 ${
                          message.role === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-700" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {message.content}
                          </div>
                          {message.ticketNumber && (
                            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/20 rounded border border-green-300 dark:border-green-700">
                              <p className="text-xs font-medium text-green-800 dark:text-green-300">
                                ✅ Ticket #{message.ticketNumber} aangemaakt
                              </p>
                              <a
                                href={`https://servicedesk.workflo.it/ticket/${message.ticketNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 dark:text-green-400 underline hover:no-underline"
                              >
                                Bekijk in ServiceDesk →
                              </a>
                            </div>
                          )}
                        </div>
                        
                        {/* Suggested Actions */}
                        {message.suggestedActions && message.suggestedActions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.suggestedActions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestedAction(action)}
                                className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Related Content */}
                        {message.relatedContent && message.relatedContent.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-500">Related:</p>
                            {message.relatedContent.map((content, index) => (
                              <a
                                key={index}
                                href={content.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-xs text-blue-600 hover:underline"
                              >
                                {content.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full p-2 bg-gray-200">
                        <Bot className="h-4 w-4 text-gray-700" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Actions Bar */}
              {suggestedActions.length > 0 && (
                <div className="px-4 py-2 border-t bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {suggestedActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedAction(action)}
                        className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Typ je bericht..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-workflo-yellow hover:bg-workflo-yellow/90 text-black"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by AI • 24/7 Beschikbaar
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}