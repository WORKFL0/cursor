# 🔧 N8N FreshRSS to Supabase - QUICK FIX

**Error**: `record "new" has no field "read_time"`

**Root Cause**: Your N8N workflow is using `read_time` but Supabase expects `read_time_minutes`

---

## ✅ SOLUTION: Update N8N Mapping

### Step 1: Open N8N Workflow

Go to your N8N workflow that syncs FreshRSS → Supabase

### Step 2: Find the Supabase Node

Look for the node that inserts into `blog_posts` table

### Step 3: Update Field Mapping

**CHANGE THIS:**
```javascript
{
  "read_time": {{ ... }}  // ❌ WRONG - This field doesn't exist
}
```

**TO THIS:**
```javascript
{
  "read_time_minutes": {{ ... }}  // ✅ CORRECT - This matches your schema
}
```

---

## 📋 COMPLETE FIELD MAPPING

Here's the **exact mapping** you should use in N8N:

### Option A: Direct Mapping (Simple)

In your Supabase node, map fields like this:

| N8N Field | Supabase Column | Example Value |
|-----------|-----------------|---------------|
| `{{ $json.title }}` | `title` | "Blog Post Title" |
| `{{ $json.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }}` | `slug` | "blog-post-title" |
| `{{ $json.content \|\| $json.description }}` | `content` | "Full HTML content..." |
| `{{ ($json.description \|\| '').substring(0, 160) }}` | `excerpt` | "Short excerpt..." |
| `{{ $json.image \|\| $json.enclosure?.url }}` | `featured_image` | "https://..." |
| `{{ $json.pubDate \|\| new Date().toISOString() }}` | `published_at` | "2025-01-20T..." |
| `"published"` | `status` | "published" |
| `{{ $json.categories \|\| [] }}` | `tags` | ["tech", "news"] |
| **`{{ Math.max(1, Math.ceil(($json.content?.split(' ').length \|\| 200) / 200)) }}`** | **`read_time_minutes`** | 5 |
| `0` | `view_count` | 0 |

### Option B: Function Node (Recommended)

Add a **Function** node BEFORE your Supabase node:

```javascript
// Transform FreshRSS data to Supabase format
const items = $input.all();

return items.map(item => {
  const rssData = item.json;

  // Calculate read time from content
  const content = rssData.content || rssData.description || '';
  const wordCount = content.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Clean slug
  const slug = (rssData.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    json: {
      // Required fields
      title: rssData.title || 'Untitled',
      slug: slug,
      content: content,
      excerpt: (rssData.description || '').substring(0, 160),
      status: 'published',

      // Optional fields
      featured_image: rssData.image || rssData.enclosure?.url || null,
      published_at: rssData.pubDate || new Date().toISOString(),
      tags: Array.isArray(rssData.categories) ? rssData.categories : [],

      // Calculated fields
      read_time_minutes: readTimeMinutes,  // ✅ CORRECT FIELD NAME
      view_count: 0,

      // You'll need to get this from somewhere or set a default
      author_id: '{{ $node["Get Default Author"].json.id }}', // Or hardcode a UUID
    }
  };
});
```

---

## 🎯 FIELD NAME REFERENCE

**Your Supabase `blog_posts` table has these columns:**

```sql
-- From your schema (001_create_blog_schema.sql)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  published_at TIMESTAMPTZ,
  status TEXT,
  tags TEXT[],
  read_time_minutes INTEGER,  -- ✅ THIS IS THE CORRECT NAME
  view_count INTEGER DEFAULT 0,
  author_id UUID REFERENCES authors(id),
  -- ... other fields
);
```

**Common Mistakes:**
- ❌ `read_time` - WRONG (doesn't exist)
- ❌ `readTime` - WRONG (doesn't exist)
- ❌ `reading_time` - WRONG (doesn't exist)
- ✅ `read_time_minutes` - CORRECT!

---

## 🧪 TEST YOUR MAPPING

### Step 1: Get Test Data

In N8N, click "Execute Node" on your FreshRSS fetch node to get sample data.

### Step 2: Check Function Output

If using Function node, execute it and verify the output has:
```json
{
  "title": "...",
  "slug": "...",
  "content": "...",
  "read_time_minutes": 5,  // ✅ Should be a number
  // ... other fields
}
```

### Step 3: Test Supabase Insert

Try inserting just ONE record first to verify the mapping works.

---

## 🔍 DEBUGGING CHECKLIST

If you still get errors, check:

1. **Field Name**: Is it `read_time_minutes` (not `read_time`)?
   ```javascript
   // In your N8N mapping
   "read_time_minutes": {{ ... }}  // ✅ Correct
   ```

2. **Data Type**: Is it a NUMBER (not a string)?
   ```javascript
   // Should be:
   "read_time_minutes": 5  // ✅ Number

   // NOT:
   "read_time_minutes": "5"  // ❌ String
   ```

3. **Author ID**: Do you have a valid `author_id`?
   ```sql
   -- Check if you have authors
   SELECT id, name FROM authors LIMIT 5;
   ```

4. **Required Fields**: Are all required fields mapped?
   - ✅ `title`
   - ✅ `slug`
   - ✅ `content`
   - ✅ `author_id`

---

## 💡 QUICK FIX (If You're in a Hurry)

**Option 1: Remove read_time completely**
Just don't include it in your N8N mapping. It's optional.

**Option 2: Set a default value**
In Supabase, update the column to have a default:
```sql
ALTER TABLE blog_posts
ALTER COLUMN read_time_minutes SET DEFAULT 5;
```

Then you can omit it from N8N entirely.

---

## 📞 SUMMARY

**What to Change in N8N:**

1. Find your Supabase node
2. Look for the field mapping
3. Change `read_time` → `read_time_minutes`
4. Make sure it's a number (not a string)
5. Test with one record first

**Example N8N Mapping:**
```json
{
  "title": "{{ $json.title }}",
  "slug": "{{ $json.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }}",
  "content": "{{ $json.content || $json.description }}",
  "excerpt": "{{ ($json.description || '').substring(0, 160) }}",
  "featured_image": "{{ $json.image || null }}",
  "published_at": "{{ $json.pubDate || new Date().toISOString() }}",
  "status": "published",
  "tags": "{{ $json.categories || [] }}",
  "read_time_minutes": "={{ Math.ceil(($json.content?.split(' ').length || 200) / 200) }}",
  "view_count": 0,
  "author_id": "YOUR_AUTHOR_UUID_HERE"
}
```

That should fix your N8N error! 🎉
