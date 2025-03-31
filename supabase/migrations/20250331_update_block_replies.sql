
-- This migration updates the block_replies table to reflect the current schema

-- First, check if the table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'block_replies') THEN
    -- Create the table with the correct structure
    CREATE TABLE public.block_replies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      block_id UUID NOT NULL REFERENCES public.content_blocks(id),
      content TEXT NOT NULL,
      from_user BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Add RLS policies
    ALTER TABLE public.block_replies ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable read for all users" ON public.block_replies FOR SELECT USING (true);
    CREATE POLICY "Enable insert for authenticated users" ON public.block_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  ELSE
    -- Table exists, check for specialist_id column and remove if it exists
    IF EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.block_replies'::regclass AND attname = 'specialist_id' AND NOT attisdropped) THEN
      ALTER TABLE public.block_replies DROP COLUMN specialist_id;
    END IF;
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS block_replies_block_id_idx ON public.block_replies (block_id);
