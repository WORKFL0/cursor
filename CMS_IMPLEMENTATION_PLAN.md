# Workflo CMS Implementatie Plan

**Datum**: 18 november 2025
**Doel**: Multi-channel nieuws publicatie systeem
**Stack**: Supabase + Next.js 15 + HubSpot

---

## 🎯 Requirements

1. ✅ Schrijf eenmaal → publiceer overal
2. ✅ LinkedIn automatisch
3. ✅ Email marketing (via HubSpot)
4. ✅ Website (workflo.it)
5. ✅ Gebruiksvriendelijk voor niet-developers
6. ✅ SEO optimized
7. ✅ Image management

---

## 🏗️ Architectuur Voorstel

### **Optie A: Supabase CMS (AANBEVOLEN)**

**Database Schema:**

```sql
-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft', -- draft, scheduled, published
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  category TEXT,
  read_time_minutes INTEGER,

  -- Multi-channel flags
  publish_to_linkedin BOOLEAN DEFAULT false,
  linkedin_post_id TEXT,
  publish_to_email BOOLEAN DEFAULT false,
  email_campaign_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authors Table (extends Supabase auth.users)
CREATE TABLE blog_authors (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Library
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- image, video, document
  size_bytes INTEGER,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Row Level Security (RLS) Policies:**

```sql
-- Public can read published posts
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' AND published_at <= NOW());

-- Authenticated users can CRUD their own posts
CREATE POLICY "Authors manage own posts"
  ON blog_posts FOR ALL
  USING (auth.uid() = author_id);

-- Admins can manage all posts
CREATE POLICY "Admins manage all posts"
  ON blog_posts FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

---

## 🔌 API Integraties

### **1. LinkedIn Auto-Post**

**Supabase Edge Function** (`functions/publish-to-linkedin/index.ts`):

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { post_id } = await req.json()

  // Get post from database
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', post_id)
    .single()

  if (!post.publish_to_linkedin) {
    return new Response(JSON.stringify({ skipped: true }), { status: 200 })
  }

  // Post to LinkedIn API
  const linkedinResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('LINKEDIN_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: `urn:li:organization:${Deno.env.get('LINKEDIN_ORG_ID')}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `${post.title}\n\n${post.excerpt}\n\nLees meer: https://workflo.it/blog/${post.slug}`
          },
          shareMediaCategory: 'ARTICLE',
          media: [{
            status: 'READY',
            originalUrl: `https://workflo.it/blog/${post.slug}`,
            title: { text: post.title },
            description: { text: post.excerpt }
          }]
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    })
  })

  const linkedinData = await linkedinResponse.json()

  // Update post with LinkedIn ID
  await supabase
    .from('blog_posts')
    .update({ linkedin_post_id: linkedinData.id })
    .eq('id', post_id)

  return new Response(JSON.stringify({ success: true, linkedinData }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### **2. HubSpot Email Campaign**

**Edge Function** (`functions/send-email-campaign/index.ts`):

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { post_id } = await req.json()

  // Get post details...
  const post = await getPost(post_id)

  // Send via HubSpot API (jullie gebruiken al HubSpot!)
  const hubspotResponse = await fetch(
    `https://api.hubapi.com/marketing/v3/emails/single-send`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HUBSPOT_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailId: Deno.env.get('HUBSPOT_NEWSLETTER_TEMPLATE_ID'),
        message: {
          to: 'subscribers@list',
          // Dynamic content based on blog post
          customProperties: {
            blog_title: post.title,
            blog_excerpt: post.excerpt,
            blog_url: `https://workflo.it/blog/${post.slug}`,
            blog_image: post.featured_image
          }
        }
      })
    }
  )

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
```

### **3. Next.js Revalidation**

**Webhook Handler** (`app/api/revalidate/route.ts`):

```typescript
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // Verify webhook secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json()
  const { type, record } = body

  try {
    if (type === 'INSERT' || type === 'UPDATE') {
      // Revalidate blog pages
      revalidatePath('/blog')
      revalidatePath(`/blog/${record.slug}`)
      revalidateTag('blog-posts')

      // If published, trigger multi-channel publishing
      if (record.status === 'published') {
        await triggerMultiChannelPublish(record.id)
      }
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function triggerMultiChannelPublish(postId: string) {
  // Call Edge Functions in parallel
  await Promise.all([
    // LinkedIn
    fetch(`${process.env.SUPABASE_URL}/functions/v1/publish-to-linkedin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ post_id: postId })
    }),

    // Email campaign
    fetch(`${process.env.SUPABASE_URL}/functions/v1/send-email-campaign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ post_id: postId })
    })
  ])
}
```

---

## 📝 Admin Interface Opties

### **Optie 1: Supabase Studio (Quick Start)**

**Voordelen:**
- ✅ Al beschikbaar (gratis)
- ✅ Geen extra code
- ✅ Tabellen direct bewerken
- ✅ SQL editor voor queries

**Nadelen:**
- ❌ Niet zo fancy als dedicated CMS
- ❌ Geen WYSIWYG editor

### **Optie 2: Custom Admin Panel (Best UX)**

**Build met shadcn/ui** (jullie gebruiken dit al):

```typescript
// app/admin/blog/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import dynamic from 'next/dynamic'

// Rich text editor (bijvoorbeeld TipTap)
const RichTextEditor = dynamic(() => import('@/components/admin/rich-text-editor'), {
  ssr: false
})

export default function NewBlogPost() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    publish_to_linkedin: true,
    publish_to_email: false,
    status: 'draft'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([formData])
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return
    }

    router.push(`/admin/blog/${data.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Nieuw Artikel</h1>

      <div className="space-y-4">
        <Input
          placeholder="Titel"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Input
          placeholder="URL slug (bijv: nieuwe-cybersecurity-dreiging)"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />

        <Textarea
          placeholder="Korte samenvatting (voor LinkedIn/Email)"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={3}
        />

        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.publish_to_linkedin}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, publish_to_linkedin: checked })
            }
          />
          <label>Ook plaatsen op LinkedIn</label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.publish_to_email}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, publish_to_email: checked })
            }
          />
          <label>Versturen via nieuwsbrief</label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="outline">
            Opslaan als concept
          </Button>
          <Button
            type="button"
            onClick={() => {
              setFormData({ ...formData, status: 'published' })
              handleSubmit(new Event('submit') as any)
            }}
          >
            Publiceren Nu
          </Button>
        </div>
      </div>
    </form>
  )
}
```

### **Optie 3: Sanity Studio Embedded (Best of Both)**

**Installeer Sanity Studio NAAST Supabase:**

```bash
npm install @sanity/client @sanity/image-url next-sanity
```

**Gebruik Sanity voor:**
- ✅ WYSIWYG content editing
- ✅ Media library
- ✅ Preview mode

**Gebruik Supabase voor:**
- ✅ Data storage
- ✅ API endpoints
- ✅ Real-time updates

---

## 🚀 Implementatie Roadmap

### **Week 1: Database Setup**
- [ ] Create Supabase tables (blog_posts, categories, authors)
- [ ] Set up RLS policies
- [ ] Configure storage bucket for images
- [ ] Create seed data

### **Week 2: Admin Interface**
- [ ] Build admin dashboard layout
- [ ] Create blog post editor
- [ ] Implement image upload
- [ ] Add preview mode

### **Week 3: Frontend Blog**
- [ ] Create `/blog` listing page
- [ ] Create `/blog/[slug]` detail page
- [ ] Add pagination
- [ ] Implement categories/tags filtering
- [ ] SEO optimization (metadata, schema.org)

### **Week 4: Multi-Channel Integration**
- [ ] Set up LinkedIn API credentials
- [ ] Build LinkedIn Edge Function
- [ ] Integrate HubSpot email (already have HubSpot!)
- [ ] Test webhooks & revalidation

### **Week 5: Polish & Launch**
- [ ] Add scheduled publishing
- [ ] Implement draft/review workflow
- [ ] Analytics integration
- [ ] Launch! 🎉

---

## 💰 Cost Breakdown

### **Supabase CMS Approach:**
- Supabase Free Tier: **€0/maand** (tot 500MB + 2GB storage)
- Upgrade if needed: **€25/maand** (8GB + 100GB storage)
- LinkedIn API: **Gratis** (organic posts)
- HubSpot: **Al in gebruik** (geen extra kosten)
- **Total: €0-25/maand**

### **Sanity Alternative:**
- Sanity Free: **€0/maand** (3 users, 10k documents)
- Sanity Growth: **€99/maand** (unlimited)
- LinkedIn API: **Gratis**
- HubSpot: **Al in gebruik**
- **Total: €0-99/maand**

---

## 🎯 Mijn Aanbeveling

**Start met Supabase CMS** omdat:

1. ✅ Jullie hebben het al geïnstalleerd
2. ✅ Geen extra maandelijkse kosten
3. ✅ PostgreSQL = toekomstbestendig
4. ✅ Real-time capabilities (handig voor future features)
5. ✅ Row Level Security = veilig
6. ✅ HubSpot integratie makkelijk (API)
7. ✅ LinkedIn API simpel (Edge Functions)

**Later upgraden naar Sanity Studio** als:
- ❌ Team wil betere WYSIWYG editor
- ❌ Meer complexe content types nodig
- ❌ Enterprise features gewenst

---

## 📚 Alternatieven Overwogen

### **Strapi**
- ❌ Extra hosting nodig (€15-50/maand)
- ✅ Open source
- ⚠️ Meer complexiteit

### **WordPress Headless**
- ❌ Legacy tech stack
- ❌ Performance overhead
- ✅ Veel plugins beschikbaar

### **Contentful**
- ❌ Duur (€489/maand voor team)
- ✅ Enterprise grade
- ⚠️ Overkill voor jullie use case

### **Ghost**
- ✅ Perfect voor blogging
- ❌ Extra hosting (€29/maand minimum)
- ❌ Minder flexibel dan Supabase

---

## 🔐 Security Considerations

1. **RLS Policies** - Alleen admins kunnen publiceren
2. **Webhook Secrets** - Beveilig revalidation endpoints
3. **API Rate Limiting** - LinkedIn heeft limits (100 posts/dag)
4. **Image Optimization** - Next.js Image component
5. **SQL Injection** - Supabase client voorkomt dit automatisch

---

## 📈 SEO Optimalisatie

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image],
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author.display_name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image],
    },
    alternates: {
      canonical: `https://workflo.it/blog/${post.slug}`
    }
  }
}
```

---

## 📞 Next Steps

1. **Bespreek met team** - Welke features zijn prioriteit?
2. **LinkedIn API setup** - Credentials aanvragen
3. **Supabase schema maken** - Ik kan dit voor jullie doen
4. **Prototype bouwen** - 1 week voor basis versie
5. **User testing** - Test met marketing team

Wil je dat ik start met de implementatie?
