'use client';

import { useState, useEffect, useCallback } from 'react';
import { HelpCircle, Search, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQMatch {
  faq: {
    id: string;
    question: string;
    answer: string;
    category: string;
    tags: string[];
  };
  score: number;
  matchType: 'exact' | 'fuzzy' | 'semantic' | 'related';
  explanation?: string;
}

interface FAQSuggestion {
  question: string;
  confidence: number;
  basedOn: string;
}

export function IntelligentFAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<FAQMatch[]>([]);
  const [suggestions, setSuggestions] = useState<FAQSuggestion[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState<string>('');
  const [trendingQuestions, setTrendingQuestions] = useState<Array<{ question: string; count: number }>>([]);

  useEffect(() => {
    fetchCategories();
    fetchTrendingQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchFAQs(searchQuery);
        fetchSuggestions(searchQuery);
      } else if (searchQuery.length === 0) {
        setMatches([]);
        setSuggestions([]);
        setGeneratedAnswer('');
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/faq?action=categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchTrendingQuestions = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/faq?action=trending');
      if (response.ok) {
        const data = await response.json();
        setTrendingQuestions(data.trending);
      }
    } catch (error) {
      console.error('Failed to fetch trending questions:', error);
    }
  }, []);

  const searchFAQs = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/ai/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          options: {
            category: selectedCategory || undefined,
            useSemanticSearch: true,
            includeRelated: true,
            generateAnswer: true,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches);
        setGeneratedAnswer(data.generatedAnswer || '');
      }
    } catch (error) {
      console.error('FAQ search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [selectedCategory]);

  const fetchSuggestions = useCallback(async (partial: string) => {
    try {
      const response = await fetch(`/api/ai/faq?action=suggestions&q=${encodeURIComponent(partial)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  }, []);

  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
      trackMetric(faqId, 'view');
    }
    setExpandedFAQs(newExpanded);
  };

  const trackMetric = async (faqId: string, metric: 'view' | 'helpful' | 'notHelpful') => {
    try {
      await fetch('/api/ai/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqId, metric }),
      });
    } catch (error) {
      console.error('Failed to track metric:', error);
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'bg-green-100 text-green-800';
      case 'semantic': return 'bg-blue-100 text-blue-800';
      case 'fuzzy': return 'bg-workflo-yellow/20 text-foreground font-medium';
      case 'related': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600">Find instant answers with our AI-powered FAQ system</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Ask a question or search for topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-6 text-lg"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
          )}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Did you mean:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion.question)}
                  className="text-sm px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {suggestion.question}
                  {suggestion.confidence > 0.8 && (
                    <span className="ml-1 text-xs text-green-600">●</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Questions */}
      {trendingQuestions.length > 0 && !searchQuery && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-workflo-yellow" />
            Trending Questions
          </h3>
          <div className="space-y-2">
            {trendingQuestions.map((item, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(item.question)}
                className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-sm">{item.question}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {item.count} searches
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {matches.map((match, index) => (
              <motion.div
                key={match.faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleFAQ(match.faq.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <HelpCircle className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                          <h4 className="font-medium text-gray-900">{match.faq.question}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getMatchTypeColor(match.matchType)}>
                            {match.matchType}
                          </Badge>
                          {match.score > 0.9 && (
                            <Badge variant="outline" className="text-xs">
                              Best Match
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {match.faq.category}
                          </Badge>
                        </div>
                        {match.explanation && (
                          <p className="text-xs text-gray-500 mt-1">{match.explanation}</p>
                        )}
                      </div>
                      {expandedFAQs.has(match.faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedFAQs.has(match.faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t mt-4">
                          <p className="text-gray-700 whitespace-pre-wrap">{match.faq.answer}</p>
                          
                          {match.faq.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {match.faq.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="mt-4 flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Was this helpful?</span>
                            <button
                              onClick={() => trackMetric(match.faq.id, 'helpful')}
                              className="text-green-600 hover:text-green-700 transition-colors"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => trackMetric(match.faq.id, 'notHelpful')}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Generated Answer */}
      {generatedAnswer && matches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-start">
              <Sparkles className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Generated Answer</h4>
                <p className="text-gray-700">{generatedAnswer}</p>
                <p className="text-sm text-gray-500 mt-3">
                  This answer was generated based on similar questions. For specific support, please contact our team.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* No Results */}
      {searchQuery && matches.length === 0 && !generatedAnswer && !isSearching && (
        <div className="text-center py-8">
          <p className="text-gray-500">No matching questions found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try rephrasing your question or contact our support team.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/contact'}>
            Contact Support
          </Button>
        </div>
      )}
    </div>
  );
}