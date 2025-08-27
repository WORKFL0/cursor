import { getEmbedding, pinecone, AI_CONFIG } from './config';
import { SearchableContent } from './search';

export interface UserProfile {
  id: string;
  industry?: string;
  companySize?: 'small' | 'medium' | 'large' | 'enterprise';
  interests: string[];
  viewedContent: Array<{
    contentId: string;
    timestamp: Date;
    duration?: number;
  }>;
  interactions: Array<{
    type: 'click' | 'download' | 'share' | 'contact';
    contentId: string;
    timestamp: Date;
  }>;
  preferences?: {
    services?: string[];
    topics?: string[];
    contentTypes?: ('article' | 'service' | 'case-study' | 'whitepaper')[];
  };
}

export interface ContentRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'service' | 'article' | 'case-study' | 'resource';
  url: string;
  score: number;
  reason: string;
  thumbnail?: string;
}

export interface RecommendationContext {
  currentPage?: string;
  currentService?: string;
  searchHistory?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  device?: 'mobile' | 'tablet' | 'desktop';
}

export class RecommendationEngine {
  private contentEmbeddings: Map<string, number[]> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private contentMetadata: Map<string, any> = new Map();
  
  // Industry-specific service mappings
  private industryServiceMap: Record<string, string[]> = {
    'finance': ['cybersecurity', 'backup-disaster-recovery', 'compliance'],
    'healthcare': ['cybersecurity', 'backup-disaster-recovery', 'hipaa-compliance'],
    'retail': ['cloud', 'voip-telefonie', 'pos-systems'],
    'manufacturing': ['managed-it', 'hardware-as-a-service', 'industrial-iot'],
    'professional-services': ['microsoft-365', 'cloud', 'voip-telefonie'],
    'nonprofit': ['microsoft-365', 'budget-friendly', 'cloud'],
    'technology': ['cloud', 'devops', 'infrastructure'],
    'education': ['microsoft-365', 'hardware-as-a-service', 'student-safety'],
  };
  
  // Company size service recommendations
  private companySizeServiceMap: Record<string, string[]> = {
    'small': ['microsoft-365', 'basic-support', 'voip-telefonie'],
    'medium': ['managed-it', 'cloud', 'cybersecurity'],
    'large': ['enterprise-solutions', 'dedicated-support', 'custom-infrastructure'],
    'enterprise': ['full-managed', 'compliance', 'global-infrastructure'],
  };
  
  // Initialize user profile
  public initializeUserProfile(userId: string, data?: Partial<UserProfile>): UserProfile {
    const profile: UserProfile = {
      id: userId,
      interests: [],
      viewedContent: [],
      interactions: [],
      ...data,
    };
    
    this.userProfiles.set(userId, profile);
    return profile;
  }
  
  // Update user profile based on behavior
  public updateUserProfile(
    userId: string,
    action: {
      type: 'view' | 'click' | 'download' | 'share' | 'contact';
      contentId: string;
      metadata?: any;
    }
  ): void {
    let profile = this.userProfiles.get(userId);
    if (!profile) {
      profile = this.initializeUserProfile(userId);
    }
    
    // Track content view
    if (action.type === 'view') {
      profile.viewedContent.push({
        contentId: action.contentId,
        timestamp: new Date(),
        duration: action.metadata?.duration,
      });
      
      // Extract interests from viewed content
      const content = this.contentMetadata.get(action.contentId);
      if (content?.tags) {
        profile.interests = [...new Set([...profile.interests, ...content.tags])];
      }
    }
    
    // Track interactions
    profile.interactions.push({
      type: action.type as any,
      contentId: action.contentId,
      timestamp: new Date(),
    });
    
    // Update preferences based on patterns
    this.updatePreferences(profile);
    
    this.userProfiles.set(userId, profile);
  }
  
  // Update user preferences based on behavior patterns
  private updatePreferences(profile: UserProfile): void {
    const recentInteractions = profile.interactions
      .filter(i => {
        const hoursSince = (Date.now() - i.timestamp.getTime()) / (1000 * 60 * 60);
        return hoursSince < 168; // Last week
      });
    
    // Count content type preferences
    const contentTypeCounts: Record<string, number> = {};
    recentInteractions.forEach(interaction => {
      const content = this.contentMetadata.get(interaction.contentId);
      if (content?.type) {
        contentTypeCounts[content.type] = (contentTypeCounts[content.type] || 0) + 1;
      }
    });
    
    // Update preferences
    profile.preferences = {
      ...profile.preferences,
      contentTypes: Object.entries(contentTypeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type as any),
    };
  }
  
  // Get personalized recommendations
  public async getRecommendations(
    userId: string,
    context?: RecommendationContext,
    limit: number = 5
  ): Promise<ContentRecommendation[]> {
    const profile = this.userProfiles.get(userId) || this.initializeUserProfile(userId);
    const recommendations: ContentRecommendation[] = [];
    
    // 1. Collaborative filtering based on similar users
    const collaborativeRecs = await this.getCollaborativeRecommendations(profile, limit);
    recommendations.push(...collaborativeRecs);
    
    // 2. Content-based filtering
    const contentBasedRecs = await this.getContentBasedRecommendations(profile, context, limit);
    recommendations.push(...contentBasedRecs);
    
    // 3. Industry-specific recommendations
    if (profile.industry) {
      const industryRecs = this.getIndustryRecommendations(profile.industry, limit);
      recommendations.push(...industryRecs);
    }
    
    // 4. Company size recommendations
    if (profile.companySize) {
      const sizeRecs = this.getCompanySizeRecommendations(profile.companySize, limit);
      recommendations.push(...sizeRecs);
    }
    
    // 5. Context-aware recommendations
    if (context) {
      const contextRecs = await this.getContextualRecommendations(context, limit);
      recommendations.push(...contextRecs);
    }
    
    // Deduplicate and sort by score
    const uniqueRecs = this.deduplicateRecommendations(recommendations);
    
    // Apply personalization weight
    const personalizedRecs = this.applyPersonalization(uniqueRecs, profile);
    
    return personalizedRecs.slice(0, limit);
  }
  
  // Collaborative filtering recommendations
  private async getCollaborativeRecommendations(
    profile: UserProfile,
    limit: number
  ): Promise<ContentRecommendation[]> {
    // Find similar users based on viewing patterns
    const similarUsers = this.findSimilarUsers(profile);
    const recommendations: ContentRecommendation[] = [];
    
    // Get content viewed by similar users but not by current user
    const viewedContentIds = new Set(profile.viewedContent.map(v => v.contentId));
    
    similarUsers.forEach(similarUser => {
      similarUser.viewedContent.forEach(viewed => {
        if (!viewedContentIds.has(viewed.contentId)) {
          const content = this.contentMetadata.get(viewed.contentId);
          if (content) {
            recommendations.push({
              id: viewed.contentId,
              title: content.title,
              description: content.description,
              type: content.type,
              url: content.url,
              score: 0.8,
              reason: 'Mensen met vergelijkbare interesses bekeken dit ook',
            });
          }
        }
      });
    });
    
    return recommendations.slice(0, limit);
  }
  
  // Content-based filtering recommendations
  private async getContentBasedRecommendations(
    profile: UserProfile,
    context?: RecommendationContext,
    limit: number = 5
  ): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    // Get embeddings of recently viewed content
    const recentContent = profile.viewedContent.slice(-5);
    
    if (pinecone && recentContent.length > 0) {
      try {
        // Create average embedding from recent content
        const embeddings = await Promise.all(
          recentContent.map(async (content) => {
            if (this.contentEmbeddings.has(content.contentId)) {
              return this.contentEmbeddings.get(content.contentId)!;
            }
            const metadata = this.contentMetadata.get(content.contentId);
            if (metadata) {
              const embedding = await getEmbedding(metadata.title + ' ' + metadata.description);
              this.contentEmbeddings.set(content.contentId, embedding);
              return embedding;
            }
            return null;
          })
        );
        
        const validEmbeddings = embeddings.filter(e => e !== null) as number[][];
        
        if (validEmbeddings.length > 0) {
          // Calculate average embedding
          const avgEmbedding = validEmbeddings[0].map((_, i) =>
            validEmbeddings.reduce((sum, emb) => sum + emb[i], 0) / validEmbeddings.length
          );
          
          // Query similar content
          const index = pinecone.index(AI_CONFIG.vectorDB.indexName);
          const results = await index.query({
            vector: avgEmbedding,
            topK: limit * 2,
            includeMetadata: true,
          });
          
          // Filter out already viewed content
          const viewedIds = new Set(profile.viewedContent.map(v => v.contentId));
          
          results.matches
            .filter(match => !viewedIds.has(match.id) && match.score >= AI_CONFIG.recommendations.similarityThreshold)
            .forEach(match => {
              recommendations.push({
                id: match.id,
                title: match.metadata?.title as string || '',
                description: match.metadata?.description as string || '',
                type: match.metadata?.type as any || 'article',
                url: match.metadata?.url as string || '',
                score: match.score || 0,
                reason: 'Vergelijkbaar met recent bekeken content',
              });
            });
        }
      } catch (error) {
        console.error('Content-based recommendation error:', error);
      }
    }
    
    // Fallback to tag-based recommendations
    if (recommendations.length < limit && profile.interests.length > 0) {
      const tagBasedRecs = this.getTagBasedRecommendations(profile.interests, limit - recommendations.length);
      recommendations.push(...tagBasedRecs);
    }
    
    return recommendations;
  }
  
  // Industry-specific recommendations
  private getIndustryRecommendations(industry: string, limit: number): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = [];
    const services = this.industryServiceMap[industry.toLowerCase()] || [];
    
    services.slice(0, limit).forEach(service => {
      recommendations.push({
        id: `service-${service}`,
        title: this.getServiceTitle(service),
        description: `Aanbevolen voor ${industry} bedrijven`,
        type: 'service',
        url: `/diensten/${service}`,
        score: 0.9,
        reason: `Populair bij ${industry} bedrijven`,
      });
    });
    
    return recommendations;
  }
  
  // Company size recommendations
  private getCompanySizeRecommendations(
    companySize: string,
    limit: number
  ): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = [];
    const services = this.companySizeServiceMap[companySize] || [];
    
    services.slice(0, limit).forEach(service => {
      recommendations.push({
        id: `size-${service}`,
        title: this.getServiceTitle(service),
        description: `Ideaal voor ${companySize === 'small' ? 'kleine' : companySize === 'medium' ? 'middelgrote' : companySize === 'large' ? 'grote' : 'enterprise'} bedrijven`,
        type: 'service',
        url: `/diensten/${service}`,
        score: 0.85,
        reason: `Perfecte match voor ${companySize === 'small' ? 'kleine' : companySize === 'medium' ? 'middelgrote' : companySize === 'large' ? 'grote' : 'enterprise'} bedrijven`,
      });
    });
    
    return recommendations;
  }
  
  // Context-aware recommendations
  private async getContextualRecommendations(
    context: RecommendationContext,
    limit: number
  ): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    // Recommendations based on current page/service
    if (context.currentService) {
      const relatedServices = this.getRelatedServices(context.currentService);
      relatedServices.slice(0, Math.floor(limit / 2)).forEach(service => {
        recommendations.push({
          id: `related-${service}`,
          title: this.getServiceTitle(service),
          description: 'Gerelateerde dienst',
          type: 'service',
          url: `/diensten/${service}`,
          score: 0.75,
          reason: `Gerelateerd aan ${context.currentService}`,
        });
      });
    }
    
    // Time-based recommendations
    if (context.timeOfDay) {
      const timeBasedContent = this.getTimeBasedContent(context.timeOfDay);
      recommendations.push(...timeBasedContent.slice(0, Math.floor(limit / 2)));
    }
    
    return recommendations;
  }
  
  // Find similar users for collaborative filtering
  private findSimilarUsers(profile: UserProfile): UserProfile[] {
    const similarUsers: UserProfile[] = [];
    const userInterests = new Set(profile.interests);
    
    this.userProfiles.forEach((otherProfile, userId) => {
      if (userId !== profile.id) {
        const otherInterests = new Set(otherProfile.interests);
        const intersection = new Set([...userInterests].filter(x => otherInterests.has(x)));
        const similarity = intersection.size / Math.max(userInterests.size, otherInterests.size);
        
        if (similarity > 0.5) {
          similarUsers.push(otherProfile);
        }
      }
    });
    
    return similarUsers.slice(0, 10);
  }
  
  // Get tag-based recommendations
  private getTagBasedRecommendations(tags: string[], limit: number): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = [];
    
    this.contentMetadata.forEach((content, contentId) => {
      if (content.tags) {
        const matchingTags = content.tags.filter((tag: string) => tags.includes(tag));
        if (matchingTags.length > 0) {
          recommendations.push({
            id: contentId,
            title: content.title,
            description: content.description,
            type: content.type,
            url: content.url,
            score: matchingTags.length / tags.length,
            reason: `Past bij jouw interesses: ${matchingTags.join(', ')}`,
          });
        }
      }
    });
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  // Get related services
  private getRelatedServices(service: string): string[] {
    const relatedMap: Record<string, string[]> = {
      'managed-it': ['cloud', 'cybersecurity', 'backup-disaster-recovery'],
      'cloud': ['managed-it', 'backup-disaster-recovery', 'microsoft-365'],
      'cybersecurity': ['managed-it', 'backup-disaster-recovery', 'compliance'],
      'microsoft-365': ['cloud', 'voip-telefonie', 'managed-it'],
      'voip-telefonie': ['microsoft-365', 'cloud', 'unified-communications'],
      'hardware-as-a-service': ['managed-it', 'lifecycle-management'],
      'backup-disaster-recovery': ['cloud', 'cybersecurity', 'business-continuity'],
    };
    
    return relatedMap[service] || [];
  }
  
  // Get time-based content recommendations
  private getTimeBasedContent(timeOfDay: string): ContentRecommendation[] {
    const contentMap: Record<string, ContentRecommendation[]> = {
      'morning': [
        {
          id: 'morning-1',
          title: 'Snelle IT Gezondheidscheck',
          description: 'Begin je dag met een systeemstatus overzicht',
          type: 'resource',
          url: '/resources/it-health-check',
          score: 0.7,
          reason: 'Populaire ochtendactiviteit',
        },
      ],
      'afternoon': [
        {
          id: 'afternoon-1',
          title: 'Productiviteitstools Gids',
          description: 'Maximaliseer je middagproductiviteit',
          type: 'article',
          url: '/blog/productivity-tools',
          score: 0.7,
          reason: 'Verhoog middagproductiviteit',
        },
      ],
      'evening': [
        {
          id: 'evening-1',
          title: 'Beveiligings Best Practices',
          description: 'Einde-van-de-dag beveiligingschecklist',
          type: 'resource',
          url: '/resources/security-checklist',
          score: 0.7,
          reason: 'Einde-dag beveiligingscontrole',
        },
      ],
    };
    
    return contentMap[timeOfDay] || [];
  }
  
  // Get service title from slug
  private getServiceTitle(service: string): string {
    const titles: Record<string, string> = {
      'managed-it': 'Managed IT Services',
      'cloud': 'Cloud Solutions',
      'cybersecurity': 'Cybersecurity',
      'microsoft-365': 'Microsoft 365',
      'voip-telefonie': 'VoIP Telefonie',
      'hardware-as-a-service': 'Hardware as a Service',
      'backup-disaster-recovery': 'Backup & Disaster Recovery',
    };
    
    return titles[service] || service;
  }
  
  // Deduplicate recommendations
  private deduplicateRecommendations(
    recommendations: ContentRecommendation[]
  ): ContentRecommendation[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.id)) {
        return false;
      }
      seen.add(rec.id);
      return true;
    });
  }
  
  // Apply personalization based on user profile
  private applyPersonalization(
    recommendations: ContentRecommendation[],
    profile: UserProfile
  ): ContentRecommendation[] {
    return recommendations.map(rec => {
      let personalizedScore = rec.score;
      
      // Boost score for preferred content types
      if (profile.preferences?.contentTypes?.includes(rec.type as any)) {
        personalizedScore *= 1.2;
      }
      
      // Boost score for matching interests
      const recTags = this.contentMetadata.get(rec.id)?.tags || [];
      const matchingInterests = recTags.filter((tag: string) => 
        profile.interests.includes(tag)
      );
      if (matchingInterests.length > 0) {
        personalizedScore *= (1 + matchingInterests.length * 0.1);
      }
      
      // Apply personalization weight
      personalizedScore = rec.score * (1 - AI_CONFIG.recommendations.personalizationWeight) +
        personalizedScore * AI_CONFIG.recommendations.personalizationWeight;
      
      return {
        ...rec,
        score: Math.min(personalizedScore, 1),
      };
    }).sort((a, b) => b.score - a.score);
  }
  
  // Add content to recommendation engine
  public addContent(content: {
    id: string;
    title: string;
    description: string;
    type: string;
    url: string;
    tags?: string[];
    metadata?: any;
  }): void {
    this.contentMetadata.set(content.id, content);
  }
}

// Create singleton instance
let recommendationEngine: RecommendationEngine | null = null;

export function getRecommendationEngine(): RecommendationEngine {
  if (!recommendationEngine) {
    recommendationEngine = new RecommendationEngine();
  }
  return recommendationEngine;
}