'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, BookOpen, Briefcase, FileText, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'service' | 'article' | 'case-study' | 'resource';
  url: string;
  score: number;
  reason: string;
}

interface ContentRecommendationsProps {
  userId?: string;
  context?: {
    currentPage?: string;
    currentService?: string;
  };
  className?: string;
}

export function ContentRecommendations({ 
  userId = 'anonymous', 
  context,
  className = ''
}: ContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, context }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, context]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const trackInteraction = async (contentId: string, type: 'click' | 'view') => {
    try {
      await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: { type, contentId },
        }),
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'service': return <Briefcase className="h-4 w-4" />;
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'case-study': return <TrendingUp className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-green-100 text-green-800';
      case 'case-study': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Dienst';
      case 'article': return 'Artikel';
      case 'case-study': return 'Case Study';
      case 'resource': return 'Bron';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-workflo-yellow" />
        Aanbevolen voor u
      </h3>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => trackInteraction(rec.id, 'click')}
            >
              <a href={rec.url} className="block">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Badge className={`mr-2 ${getTypeColor(rec.type)}`}>
                        <span className="flex items-center">
                          {getIcon(rec.type)}
                          <span className="ml-1 text-xs">{getTypeLabel(rec.type)}</span>
                        </span>
                      </Badge>
                      {rec.score > 0.8 && (
                        <Badge variant="outline" className="text-xs">
                          Beste match
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {rec.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {rec.description}
                    </p>
                    
                    {rec.reason && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        {rec.reason}
                      </p>
                    )}
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-3 flex-shrink-0" />
                </div>
              </a>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button
          onClick={fetchRecommendations}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Vernieuw aanbevelingen
        </button>
      </div>
    </div>
  );
}