
CREATE OR REPLACE FUNCTION insert_curio_image(
  p_topic TEXT,
  p_image_url TEXT,
  p_generation_method TEXT DEFAULT 'groq'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Try to insert, but if the topic already exists, update the image URL
  INSERT INTO public.curio_images (topic, image_url, generation_method)
  VALUES (p_topic, p_image_url, p_generation_method)
  ON CONFLICT (topic) 
  DO UPDATE SET 
    image_url = p_image_url,
    generation_method = p_generation_method,
    created_at = NOW()
  RETURNING id INTO v_id;
  
  RETURN v_id;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error inserting curio image: %', SQLERRM;
    RETURN NULL;
END;
$$;
