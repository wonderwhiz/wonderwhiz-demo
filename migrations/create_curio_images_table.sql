
-- Create curio_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.curio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  image_url TEXT NOT NULL,
  generation_method TEXT NOT NULL DEFAULT 'groq',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add an index on the topic field for faster lookups
  CONSTRAINT unique_topic UNIQUE (topic)
);

-- Grant access to the authenticated users
ALTER TABLE public.curio_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to select
CREATE POLICY curio_images_select_policy ON public.curio_images
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert
CREATE POLICY curio_images_insert_policy ON public.curio_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
