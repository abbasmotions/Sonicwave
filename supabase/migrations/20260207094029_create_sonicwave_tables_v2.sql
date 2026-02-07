/*
  # Create SonicWave Application Tables (v2)

  1. New Tables
    - `user_profiles` - Extended user profile information
    - `projects` - TTS projects
    - `project_audio` - Generated audio files
    - `usage_stats` - Usage tracking
*/

DO $$
BEGIN
  -- Create user_profiles table if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'user_profiles'
  ) THEN
    CREATE TABLE user_profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name text,
      avatar_url text,
      subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team')),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create projects table if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'projects'
  ) THEN
    CREATE TABLE projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text,
      content text NOT NULL,
      status text DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed')),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create project_audio table if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'project_audio'
  ) THEN
    CREATE TABLE project_audio (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      voice_id text NOT NULL,
      audio_url text NOT NULL,
      duration integer,
      file_size integer,
      created_at timestamptz DEFAULT now()
    );
    ALTER TABLE project_audio ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create usage_stats table if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'usage_stats'
  ) THEN
    CREATE TABLE usage_stats (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
      characters_used integer DEFAULT 0,
      audio_generated_seconds integer DEFAULT 0,
      month date NOT NULL,
      created_at timestamptz DEFAULT now()
    );
    ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for user_profiles if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON user_profiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON user_profiles FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create policies for projects if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Users can view own projects'
  ) THEN
    CREATE POLICY "Users can view own projects"
      ON projects FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Users can create projects'
  ) THEN
    CREATE POLICY "Users can create projects"
      ON projects FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Users can update own projects'
  ) THEN
    CREATE POLICY "Users can update own projects"
      ON projects FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Users can delete own projects'
  ) THEN
    CREATE POLICY "Users can delete own projects"
      ON projects FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Create policies for project_audio if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_audio' AND policyname = 'Users can view audio of own projects'
  ) THEN
    CREATE POLICY "Users can view audio of own projects"
      ON project_audio FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = project_audio.project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_audio' AND policyname = 'Users can create audio for own projects'
  ) THEN
    CREATE POLICY "Users can create audio for own projects"
      ON project_audio FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = project_audio.project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_audio' AND policyname = 'Users can delete audio from own projects'
  ) THEN
    CREATE POLICY "Users can delete audio from own projects"
      ON project_audio FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM projects
          WHERE projects.id = project_audio.project_id
          AND projects.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create policies for usage_stats if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'usage_stats' AND policyname = 'Users can view own usage stats'
  ) THEN
    CREATE POLICY "Users can view own usage stats"
      ON usage_stats FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'usage_stats' AND policyname = 'Users can insert own usage stats'
  ) THEN
    CREATE POLICY "Users can insert own usage stats"
      ON usage_stats FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'usage_stats' AND policyname = 'Users can update own usage stats'
  ) THEN
    CREATE POLICY "Users can update own usage stats"
      ON usage_stats FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS project_audio_project_id_idx ON project_audio(project_id);
CREATE INDEX IF NOT EXISTS usage_stats_user_id_idx ON usage_stats(user_id);
