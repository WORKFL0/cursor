# 🔑 Get Your Author ID for N8N

**Error**: `invalid input syntax for type uuid: "YOUR_AUTHOR_UUID_HERE"`

**Solution**: You need to get a real author UUID from your database.

---

## ✅ OPTION 1: Query Existing Authors (Recommended)

Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/mzmeylvtdvqrbutlbkfu/sql) and run:

```sql
-- Get all authors
SELECT id, name, email
FROM authors
ORDER BY created_at DESC;
```

**Copy the `id` (UUID)** of the author you want to use (probably your own).

Example output:
```
id                                   | name            | email
-------------------------------------|-----------------|------------------
a1b2c3d4-e5f6-7890-abcd-ef1234567890 | Florian Smith   | florian@workflo.nl
```

Copy this UUID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

## ✅ OPTION 2: Create a Default Author (If None Exists)

If the query above returns **no results**, create a default author:

```sql
-- Create a default author for blog posts
INSERT INTO authors (name, email, bio)
VALUES (
  'Workflo Team',
  'info@workflo.nl',
  'IT experts specializing in managed IT services, cybersecurity, and cloud solutions.'
)
RETURNING id, name, email;
```

This will return the new author's UUID. **Copy it!**

---

## 🔧 UPDATE YOUR N8N FUNCTION NODE

Replace `YOUR_AUTHOR_UUID_HERE` with the actual UUID:

### BEFORE:
```javascript
return {
  json: {
    title: rssData.title || 'Untitled',
    slug: (rssData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    // ... other fields ...
    author_id: 'YOUR_AUTHOR_UUID_HERE'  // ❌ This is the problem
  }
};
```

### AFTER:
```javascript
return {
  json: {
    title: rssData.title || 'Untitled',
    slug: (rssData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    // ... other fields ...
    author_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'  // ✅ Real UUID from database
  }
};
```

---

## 🎯 COMPLETE WORKING N8N FUNCTION NODE

Here's the **complete function** with everything fixed:

```javascript
// Transform FreshRSS data to Supabase format
const items = $input.all();

// ⚠️ REPLACE THIS WITH YOUR ACTUAL AUTHOR UUID FROM DATABASE
const DEFAULT_AUTHOR_ID = 'PASTE_YOUR_UUID_HERE';

return items.map(item => {
  const rssData = item.json;

  // Calculate read time from content
  const content = rssData.content || rssData.description || '';
  const wordCount = content.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Clean slug (remove special characters, make URL-friendly)
  const slug = (rssData.title || 'untitled')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')      // Replace non-alphanumeric with -
    .replace(/^-|-$/g, '');            // Remove leading/trailing -

  return {
    json: {
      // Required fields
      title: rssData.title || 'Untitled',
      slug: slug,
      content: content,
      author_id: DEFAULT_AUTHOR_ID,  // ✅ Use real UUID here

      // Optional fields
      excerpt: (rssData.description || content).substring(0, 160),
      featured_image: rssData.image || rssData.enclosure?.url || null,
      published_at: rssData.pubDate || new Date().toISOString(),
      status: 'published',
      tags: Array.isArray(rssData.categories) ? rssData.categories : [],

      // Calculated fields
      read_time_minutes: readTimeMinutes,
      view_count: 0,
    }
  };
});
```

---

## 🧪 ALTERNATIVE: Use N8N to Fetch Author ID Dynamically

If you want N8N to automatically get the author ID, add these nodes BEFORE your function:

### Node 1: "Get Default Author" (Supabase Node)
- **Operation**: Get All
- **Table**: `authors`
- **Return All**: Off
- **Limit**: 1
- **Order By**: `created_at` DESC

### Node 2: Update Function to Use Dynamic ID

```javascript
const items = $input.all();

// Get author ID from previous node
const authorId = $node["Get Default Author"].json.id;

return items.map(item => {
  const rssData = item.json;
  // ... rest of your mapping ...

  return {
    json: {
      // ... other fields ...
      author_id: authorId,  // ✅ Dynamically fetched
    }
  };
});
```

---

## 🎯 QUICK CHECKLIST

1. ✅ Run SQL query to get author UUID
2. ✅ Copy the UUID (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
3. ✅ Replace `YOUR_AUTHOR_UUID_HERE` in N8N with real UUID
4. ✅ Make sure it's in **quotes** (it's a string in JavaScript)
5. ✅ Test with one record first

---

## 📋 EXAMPLE

If your query returns:
```
id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
name: Florian Smith
```

Then in N8N:
```javascript
const DEFAULT_AUTHOR_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

// Later in the mapping:
author_id: DEFAULT_AUTHOR_ID
```

---

## 🆘 STILL GETTING ERRORS?

### Error: "null value in column author_id"
**Solution**: Make sure you're actually setting the author_id in your mapping.

### Error: "insert or update on table blog_posts violates foreign key constraint"
**Solution**: The UUID you're using doesn't exist in the `authors` table. Run the query again to verify.

### Error: "duplicate key value violates unique constraint"
**Solution**: The slug already exists. Either:
- Delete the existing post, OR
- Make the slug unique by appending a timestamp/number

---

That should fix your N8N error! Just get the author UUID from the database and paste it into your N8N function. 🎉
