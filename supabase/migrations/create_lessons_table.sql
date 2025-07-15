/*
      # Create lessons table

      1. New Tables
        - `lessons`
          - `id` (uuid, primary key)
          - `title` (text, not null)
          - `description` (text)
          - `content` (text)
          - `created_at` (timestamp)
      2. Security
        - Enable RLS on `lessons` table
        - Add policy for authenticated users to read and create lessons
    */

    -- Create the lessons table
    CREATE TABLE IF NOT EXISTS lessons (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text,
      content text,
      created_at timestamptz DEFAULT now()
    );

    -- Add a delay (simulated with a dummy query)
    SELECT 1;

    -- Enable Row Level Security (RLS)
    ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

    -- Add a delay (simulated with a dummy query)
    SELECT 1;

    -- Create policy for authenticated users to read lessons
    CREATE POLICY "Authenticated users can read lessons"
      ON lessons
      FOR SELECT
      TO authenticated
      USING (TRUE);

    -- Add a delay (simulated with a dummy query)
    SELECT 1;

    -- Create policy for authenticated users to create lessons
    CREATE POLICY "Authenticated users can create lessons"
      ON lessons
      FOR INSERT
      TO authenticated
      WITH CHECK (TRUE);
