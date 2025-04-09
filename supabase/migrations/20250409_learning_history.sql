
-- Create table for child learning history
CREATE TABLE IF NOT EXISTS public.learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  subtopics TEXT[] DEFAULT '{}',
  interaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  engagement_level NUMERIC(3,1) DEFAULT 0, -- 0 to 10 scale
  content_block_ids UUID[] DEFAULT '{}',
  curio_id UUID REFERENCES public.curios(id) ON DELETE CASCADE,
  last_revisited TIMESTAMP WITH TIME ZONE,
  revisit_count INTEGER DEFAULT 0,
  comprehension_level TEXT DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS learning_history_child_id_idx ON public.learning_history(child_id);
CREATE INDEX IF NOT EXISTS learning_history_topic_idx ON public.learning_history(topic);
CREATE INDEX IF NOT EXISTS learning_history_curio_id_idx ON public.learning_history(curio_id);

-- Create table for topic connections (knowledge graph)
CREATE TABLE IF NOT EXISTS public.topic_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  from_topic TEXT NOT NULL,
  to_topic TEXT NOT NULL,
  strength INTEGER DEFAULT 1, -- 1-10 scale indicating connection strength
  connection_type TEXT DEFAULT 'temporal', -- temporal, semantic, causal, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, from_topic, to_topic)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS topic_connections_child_id_idx ON public.topic_connections(child_id);
CREATE INDEX IF NOT EXISTS topic_connections_topics_idx ON public.topic_connections(from_topic, to_topic);

-- Create Edge Function to generate and update learning history when new curios are created
-- In a production implementation, this would be a trigger or edge function
-- When a new curio is created, we'd extract topics and generate a learning history entry

-- Add last_revisited column to curios to track when they were last viewed
ALTER TABLE public.curios 
ADD COLUMN IF NOT EXISTS last_revisited TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS revisit_count INTEGER DEFAULT 0;

-- Function to update learning history when a curio is viewed
CREATE OR REPLACE FUNCTION update_curio_revisit()
RETURNS TRIGGER AS $$
BEGIN
  NEW.revisit_count := COALESCE(OLD.revisit_count, 0) + 1;
  NEW.last_revisited := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to track curio revisits
CREATE TRIGGER curio_revisited
  BEFORE UPDATE OF last_updated_at ON public.curios
  FOR EACH ROW
  EXECUTE FUNCTION update_curio_revisit();

-- Add memory-related fields to child profiles
ALTER TABLE public.child_profiles
ADD COLUMN IF NOT EXISTS memory_preferences JSONB DEFAULT '{"spaced_repetition": true, "suggest_related_topics": true, "suggest_past_topics": true}'::jsonb,
ADD COLUMN IF NOT EXISTS knowledge_graph_enabled BOOLEAN DEFAULT true;
