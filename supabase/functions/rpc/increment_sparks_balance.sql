
-- This function increments a child profile's sparks balance
CREATE OR REPLACE FUNCTION increment_sparks_balance(child_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE child_profiles
  SET sparks_balance = COALESCE(sparks_balance, 0) + amount
  WHERE id = child_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
