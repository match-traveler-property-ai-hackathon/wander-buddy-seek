-- Allow anyone to read demo profiles (user_id IS NULL)
CREATE POLICY "Allow public read access to demo profiles"
ON profiles
FOR SELECT
TO public
USING (user_id IS NULL);