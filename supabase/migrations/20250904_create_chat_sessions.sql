-- Create table for chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  messages JSONB DEFAULT '[]'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- Create table for support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  session_id TEXT REFERENCES chat_sessions(id),
  issue TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'normal',
  requester_name TEXT,
  requester_email TEXT,
  requester_phone TEXT,
  requester_company TEXT,
  assigned_to TEXT,
  halo_ticket_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for support tickets
CREATE INDEX idx_support_tickets_session_id ON support_tickets(session_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_requester_email ON support_tickets(requester_email);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- Create table for chat feedback
CREATE TABLE IF NOT EXISTS chat_feedback (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES chat_sessions(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for chat feedback
CREATE INDEX idx_chat_feedback_session_id ON chat_feedback(session_id);
CREATE INDEX idx_chat_feedback_rating ON chat_feedback(rating);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE
    ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE
    ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for recent chat sessions
CREATE OR REPLACE VIEW recent_chat_sessions AS
SELECT 
  cs.id,
  cs.created_at,
  cs.updated_at,
  jsonb_array_length(cs.messages) as message_count,
  cs.context->>'userInfo' as user_info,
  st.ticket_number,
  st.status as ticket_status
FROM chat_sessions cs
LEFT JOIN support_tickets st ON cs.id = st.session_id
WHERE cs.updated_at >= NOW() - INTERVAL '30 days'
ORDER BY cs.updated_at DESC;

-- Create view for support metrics
CREATE OR REPLACE VIEW support_metrics AS
SELECT 
  COUNT(DISTINCT cs.id) as total_sessions,
  COUNT(st.id) as total_tickets,
  COUNT(DISTINCT CASE WHEN st.status = 'resolved' THEN st.id END) as resolved_tickets,
  AVG(cf.rating) as average_rating,
  COUNT(cf.id) as total_feedback
FROM chat_sessions cs
LEFT JOIN support_tickets st ON cs.id = st.session_id
LEFT JOIN chat_feedback cf ON cs.id = cf.session_id
WHERE cs.created_at >= NOW() - INTERVAL '30 days';

-- Grant permissions (adjust based on your needs)
GRANT ALL ON chat_sessions TO authenticated;
GRANT ALL ON support_tickets TO authenticated;
GRANT ALL ON chat_feedback TO authenticated;
GRANT SELECT ON recent_chat_sessions TO authenticated;
GRANT SELECT ON support_metrics TO authenticated;