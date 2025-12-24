-- Add read_time column to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS read_time INTEGER DEFAULT 5;

COMMENT ON COLUMN blog_posts.read_time IS 'Estimated reading time in minutes';

-- Calculate read time for existing posts (assuming 200 words per minute)
UPDATE blog_posts 
SET read_time = GREATEST(1, ROUND(array_length(string_to_array(content, ' '), 1) / 200.0))
WHERE read_time IS NULL OR read_time = 5;
