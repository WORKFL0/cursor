import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'

// Import collections
import Users from './src/payload/collections/Users'
import BlogPosts from './src/payload/collections/BlogPosts'
import CaseStudies from './src/payload/collections/CaseStudies'
import Clients from './src/payload/collections/Clients'
import FAQs from './src/payload/collections/FAQs'
import Media from './src/payload/collections/Media'
import Services from './src/payload/collections/Services'
import TeamMembers from './src/payload/collections/TeamMembers'
import Testimonials from './src/payload/collections/Testimonials'

// Import globals
import CompanyInfo from './src/payload/globals/CompanyInfo'
import SiteSettings from './src/payload/globals/SiteSettings'

export default buildConfig({
  admin: {
    user: 'users',
    buildPath: path.resolve(__dirname, './build'),
    css: path.resolve(__dirname, './src/payload/styles/admin.css'),
  },
  collections: [
    Users,
    BlogPosts,
    CaseStudies,
    Clients,
    FAQs,
    Media,
    Services,
    TeamMembers,
    Testimonials,
  ],
  globals: [
    CompanyInfo,
    SiteSettings,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Add any additional Lexical editor features here
    ],
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    migrationDir: path.resolve(__dirname, './migrations'),
  }),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-PLEASE',
  typescript: {
    outputFile: path.resolve(__dirname, './src/types/payload-types.ts'),
  },
  sharp,
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.NODE_ENV === 'production' ? ['https://workflo.it'] : []),
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.NODE_ENV === 'production' ? ['https://workflo.it'] : []),
  ],
  plugins: [
    // Add any Payload plugins here
  ],
})