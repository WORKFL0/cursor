'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'service' | 'article' | 'faq' | 'page';
  url: string;
  score: number;
  highlight?: string;
}

export function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
        getSuggestions(query);
      } else {
        setResults([]);
        setSuggestions([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery,
          options: { limit: 5, useSemanticSearch: true }
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async (partial: string) => {
    try {
      const response = await fetch(`/api/ai/search?q=${encodeURIComponent(partial)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-500';
      case 'article': return 'bg-green-500';
      case 'faq': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Dienst';
      case 'article': return 'Artikel';
      case 'faq': return 'FAQ';
      default: return 'Pagina';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Zoek diensten, artikelen, veelgestelde vragen..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setSuggestions([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (showResults || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="p-4 shadow-lg max-h-96 overflow-y-auto">
              {/* Suggestions */}
              {suggestions.length > 0 && !showResults && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Suggesties:</p>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {showResults && results.length > 0 && (
                <div className="space-y-3">
                  {results.map((result) => (
                    <motion.a
                      key={result.id}
                      href={result.url}
                      className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{result.title}</h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {result.highlight || result.content}
                          </p>
                        </div>
                        <Badge className={`ml-3 ${getTypeColor(result.type)} text-white`}>
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      {result.score > 0.9 && (
                        <div className="mt-2">
                          <span className="text-xs text-green-600 font-medium">
                            Beste match
                          </span>
                        </div>
                      )}
                    </motion.a>
                  ))}
                </div>
              )}

              {/* No Results */}
              {showResults && results.length === 0 && !isLoading && (
                <div className="text-center py-4">
                  <p className="text-gray-500">Geen resultaten gevonden voor "{query}"</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Probeer andere zoektermen of bekijk onze diensten
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}