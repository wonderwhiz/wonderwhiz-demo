
-- Function to get the new balance after adding a specified amount
CREATE OR REPLACE FUNCTION public.get_new_balance(profile_id UUID, add_amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get the current balance
  SELECT sparks_balance INTO current_balance 
  FROM child_profiles 
  WHERE id = profile_id;
  
  -- Return the new balance (handle null case)
  RETURN COALESCE(current_balance, 0) + add_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
