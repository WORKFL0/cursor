# N8N: FreshRSS → Supabase Blog Posts Mapping

## ❌ ERROR: "record 'new' has no field 'read_time'"

**Probleem**: Je N8N workflow probeert `read_time` naar Supabase te sturen, maar het veld heet `read_time_minutes`.

---

## ✅ OPLOSSING: Correcte Veldmapping

### **Stap 1: FreshRSS Data Ophalen**

Node: **RSS Feed Read** of **HTTP Request**

### **Stap 2: Data Transformeren**

Node: **Function** of **Code**

```javascript
// Transform FreshRSS data to Supabase format
const items = $input.all();

return items.map(item => {
  const rssData = item.json;

  // Calculate read time (200 words per minute)
  const wordCount = (rssData.content || rssData.description || '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Generate slug from title
  const slug = (rssData.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return {
    json: {
      // Required fields
      title: rssData.title || 'Untitled',
      slug: slug || `post-${Date.now()}`,
      content: rssData.content || rssData.description || '',

      // Optional fields
      excerpt: (rssData.description || rssData.content || '').substring(0, 160),
      featured_image: rssData.image || rssData.enclosure?.url || rssData.media?.thumbnail?.url || null,

      // Metadata
      published_at: rssData.pubDate || new Date().toISOString(),
      status: 'published',

      // Tags/Categories
      tags: Array.isArray(rssData.categories)
        ? rssData.categories
        : rssData.categories
          ? [rssData.categories]
          : [],

      // ⚠️ CRITICAL: Use correct field name!
      read_time_minutes: readTimeMinutes,  // ← NOT 'read_time'!

      // Author (must exist in blog_authors table!)
      author_id: '{{ $node["Get Default Author"].json.id }}',  // Link to author lookup node

      // SEO
      meta_title: rssData.title || null,
      meta_description: (rssData.description || '').substring(0, 160) || null,
      canonical_url: rssData.link || null
    }
  };
});
```

### **Stap 3: Lookup Default Author**

Node: **Supabase** (Query)

**Table**: `blog_authors`
**Operation**: Find
**Match**: `email` equals `jouw@email.com`

Dit zorgt ervoor dat alle RSS posts een author hebben.

### **Stap 4: Insert into Supabase**

Node: **Supabase** (Insert)

**Table**: `blog_posts`
**Operation**: Insert
**Data**: Use output from Function node

---

## 📋 Complete Veldmapping Reference

| FreshRSS Veld | Supabase Veld | Transformatie | Required |
|---------------|---------------|---------------|----------|
| `title` | `title` | Direct | ✅ |
| `title` | `slug` | `.toLowerCase().replace(/[^a-z0-9]+/g, '-')` | ✅ |
| `content` | `content` | Direct (fallback naar `description`) | ✅ |
| `description` | `excerpt` | `.substring(0, 160)` | ❌ |
| `pubDate` | `published_at` | ISO 8601 format | ❌ |
| `categories` | `tags` | Convert to array if string | ❌ |
| `image` / `enclosure.url` | `featured_image` | Direct | ❌ |
| `link` | `canonical_url` | Direct | ❌ |
| **Calculate from content** | `read_time_minutes` | `wordCount / 200` | ❌ |
| **Lookup** | `author_id` | UUID from `blog_authors` | ❌ |
| Fixed value | `status` | `'published'` | ❌ |

---

## 🔍 Debug Tips

### **Check if author exists:**

```sql
-- Run in Supabase SQL Editor
SELECT id, display_name, email FROM blog_authors;
```

Als er geen author is, maak er één aan:

```sql
INSERT INTO blog_authors (email, display_name, bio)
VALUES ('jouw@email.com', 'RSS Feed Bot', 'Automated blog posts from RSS');
```

### **Test query:**

```sql
-- Check recent posts
SELECT
  title,
  slug,
  read_time_minutes,  -- ← Check if this field exists
  published_at
FROM blog_posts
ORDER BY published_at DESC
LIMIT 5;
```

### **Validate schema:**

```sql
-- Check all columns in blog_posts
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;
```

---

## ⚠️ Common Errors & Fixes

### Error: "record 'new' has no field 'read_time'"
**Fix**: Change `read_time` → `read_time_minutes`

### Error: "null value in column 'author_id' violates not-null constraint"
**Fix**: Ensure author lookup returns valid UUID

### Error: "duplicate key value violates unique constraint 'blog_posts_slug_key'"
**Fix**: Add timestamp to slug: `${slug}-${Date.now()}`

### Error: "invalid input syntax for type uuid"
**Fix**: Ensure `author_id` is valid UUID format, not string

---

## 🚀 Production Tips

### **Avoid Duplicates:**

Add a check before insert:

```javascript
// In Function node, check if slug already exists
const existingPost = await fetch(
  'https://your-project.supabase.co/rest/v1/blog_posts?slug=eq.' + slug,
  {
    headers: {
      'apikey': 'your-anon-key',
      'Content-Type': 'application/json'
    }
  }
).then(r => r.json());

if (existingPost.length > 0) {
  // Skip or update existing post
  return null;
}
```

### **Batch Inserts:**

Instead of one insert per post, batch them:

```javascript
// Collect all posts
const allPosts = items.map(item => transformRSSData(item));

// Single bulk insert
return [{
  json: {
    posts: allPosts
  }
}];
```

Then use Supabase batch insert operation.

---

## 📞 Need Help?

Check Supabase logs:
- Dashboard → Logs → Database
- Look for constraint violations

Check N8N execution:
- Click on failed node
- View "Input" and "Output" data
- Compare with Supabase schema

---

**TL;DR**: Change `read_time` to `read_time_minutes` in je N8N mapping! 🎯
