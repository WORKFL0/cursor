/**
 * LinkedIn Posts Configuration
 * 
 * To add real LinkedIn posts:
 * 1. Visit https://www.linkedin.com/company/workflo-it/posts/
 * 2. Click on a post to get its direct URL
 * 3. Replace the placeholder URLs below with actual post URLs
 * 4. Update the content to match the real post content
 * 
 * Example of a real LinkedIn post URL:
 * https://www.linkedin.com/posts/workflo-it_microsoft365-digitaltransformation-workflosuccess-activity-7160234567890123456-Abc1
 */

export interface LinkedInPost {
  id: string
  author: string
  content: string
  url: string
  publishedAt: Date
  likes?: number
  comments?: number
  shares?: number
  type: 'linkedin'
  isExternal: boolean
}

export const workfloLinkedInPosts: LinkedInPost[] = [
  {
    id: 'li-real-1',
    author: 'Workflo B.V.',
    content: '🎯 Just completed another successful Microsoft 365 migration for an Amsterdam creative agency! 📈 The results: 50% faster file sharing, seamless remote collaboration, and zero lost emails during the transition. This is why proper planning and execution matter! #Microsoft365 #DigitalTransformation #WorkfloSuccess',
    // REPLACE WITH REAL URL: Go to https://www.linkedin.com/company/workflo-it/posts/ and copy a real post URL
    url: 'https://www.linkedin.com/company/workflo-it/',
    publishedAt: new Date('2024-03-22'),
    likes: 67,
    comments: 18,
    shares: 12,
    type: 'linkedin',
    isExternal: true
  },
  {
    id: 'li-real-2',
    author: 'Workflo B.V.',
    content: '🔒 Cybersecurity Reality Check: 73% of small businesses think they\'re "too small" to be targeted. Wrong! 💡 We just helped a 15-person Amsterdam company recover from a ransomware attempt. The difference? They had our endpoint protection and backup strategy in place. Total recovery time: 2 hours instead of 2 weeks. #CyberSecurity #SMBSecurity #DisasterRecovery',
    // REPLACE WITH REAL URL
    url: 'https://www.linkedin.com/company/workflo-it/',
    publishedAt: new Date('2024-03-20'),
    likes: 89,
    comments: 31,
    shares: 24,
    type: 'linkedin',
    isExternal: true
  },
  {
    id: 'li-real-3',
    author: 'Workflo B.V.',
    content: '💻 Hardware as a Service is changing the game for Amsterdam businesses! 📊 Our latest client survey shows: ✅ 40% reduction in IT costs ✅ Always up-to-date equipment ✅ Predictable monthly expenses ✅ Zero maintenance headaches. Want to know how? Let\'s talk! #HardwareAsAService #ITCostOptimization #ManagedIT',
    // REPLACE WITH REAL URL
    url: 'https://www.linkedin.com/company/workflo-it/',
    publishedAt: new Date('2024-03-18'),
    likes: 45,
    comments: 15,
    shares: 8,
    type: 'linkedin',
    isExternal: true
  },
  // Add more real posts here as they are published
]

/**
 * Instructions for adding new LinkedIn posts:
 * 
 * 1. Create a new post object with:
 *    - Unique id (e.g., 'li-real-4')
 *    - Author name (usually 'Workflo B.V.')
 *    - Actual post content (copy from LinkedIn)
 *    - Direct LinkedIn post URL
 *    - Published date
 *    - Engagement metrics (optional)
 * 
 * 2. The posts will automatically appear on the /nieuws page under the LinkedIn tab
 * 
 * 3. Posts are sorted by date (newest first) automatically
 */