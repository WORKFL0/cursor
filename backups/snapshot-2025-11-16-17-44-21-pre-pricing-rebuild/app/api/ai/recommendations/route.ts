import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationEngine } from '@/lib/ai/recommendations';

const recommendationEngine = getRecommendationEngine();

// Add sample content for recommendations
const sampleContent = [
  {
    id: 'content-1',
    title: 'Cloud Migration Guide',
    description: 'Complete guide to migrating your infrastructure to the cloud',
    type: 'article' as const,
    url: '/resources/cloud-migration',
    tags: ['cloud', 'migration', 'infrastructure'],
  },
  {
    id: 'content-2',
    title: 'Cybersecurity Best Practices',
    description: 'Essential security measures for modern businesses',
    type: 'article' as const,
    url: '/resources/security-best-practices',
    tags: ['security', 'compliance', 'best-practices'],
  },
  {
    id: 'content-3',
    title: 'Microsoft 365 Productivity Tips',
    description: 'Maximize your team productivity with Microsoft 365',
    type: 'article' as const,
    url: '/resources/m365-tips',
    tags: ['microsoft', 'productivity', 'collaboration'],
  },
  {
    id: 'service-managed-it',
    title: 'Managed IT Services',
    description: 'Complete IT management for your business',
    type: 'service' as const,
    url: '/diensten/managed-it',
    tags: ['managed-services', 'support', 'monitoring'],
  },
  {
    id: 'case-study-1',
    title: 'Greenpeace Success Story',
    description: 'How we helped Greenpeace improve their IT infrastructure',
    type: 'case-study' as const,
    url: '/case-studies/greenpeace',
    tags: ['nonprofit', 'cloud', 'success-story'],
  },
];

// Initialize with sample content
sampleContent.forEach(content => recommendationEngine.addContent(content));

export async function POST(request: NextRequest) {
  try {
    const { userId, context, action } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }
    
    // Update user profile if action is provided
    if (action) {
      recommendationEngine.updateUserProfile(userId, action);
    }
    
    // Get recommendations
    const recommendations = await recommendationEngine.getRecommendations(
      userId,
      context,
      5
    );
    
    return NextResponse.json({
      recommendations,
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Initialize or update user profile
export async function PUT(request: NextRequest) {
  try {
    const { userId, profile } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }
    
    // Initialize or update user profile
    const userProfile = recommendationEngine.initializeUserProfile(userId, profile);
    
    return NextResponse.json({
      success: true,
      userId,
      profile: {
        industry: userProfile.industry,
        companySize: userProfile.companySize,
        interests: userProfile.interests,
        preferences: userProfile.preferences,
      },
    });
  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}