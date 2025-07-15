-- Create phone verifications table
CREATE TABLE IF NOT EXISTS phone_verifications_xyz123 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE phone_verifications_xyz123 ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert access" ON phone_verifications_xyz123
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select access" ON phone_verifications_xyz123
  FOR SELECT USING (true);

CREATE POLICY "Enable update access" ON phone_verifications_xyz123
  FOR UPDATE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_phone_verifications_updated_at
  BEFORE UPDATE ON phone_verifications_xyz123
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index on phone number
CREATE INDEX idx_phone_verifications_phone_number ON phone_verifications_xyz123(phone_number);