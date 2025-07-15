-- Update user roles and add admin functionality

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND (raw_user_meta_data->>'role' = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for grades table
DROP POLICY IF EXISTS "Authenticated users can read grades" ON grades;
DROP POLICY IF EXISTS "Authenticated users can create grades" ON grades;

CREATE POLICY "Anyone can read grades"
  ON grades
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can insert grades"
  ON grades
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update grades"
  ON grades
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete grades"
  ON grades
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create subjects table if it doesn't exist
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  grade_id uuid REFERENCES grades(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on subjects table
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subjects
CREATE POLICY "Anyone can read subjects"
  ON subjects
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can insert subjects"
  ON subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update subjects"
  ON subjects
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete subjects"
  ON subjects
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on topics table
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for topics
CREATE POLICY "Anyone can read topics"
  ON topics
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can insert topics"
  ON topics
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update topics"
  ON topics
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete topics"
  ON topics
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create videos table if it doesn't exist
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on videos table
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for videos
CREATE POLICY "Anyone can read videos"
  ON videos
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can insert videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));
