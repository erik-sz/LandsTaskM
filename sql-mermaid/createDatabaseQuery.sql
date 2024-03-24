-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'completed', 'archived')),
  start_date DATE,
  end_date DATE,
  created_by UUID,
  company_id UUID,
  FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Create Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'to_start')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  impact TEXT CHECK (impact IN ('low', 'medium', 'high')),
  risk_description TEXT,
  company_id UUID,
  location JSONB,
  weather JSONB,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (company_id) REFERENCES companies(company_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Create Users_Tasks Junction Table for Assigning Tasks to Multiple Users
CREATE TABLE users_tasks (
    user_id UUID REFERENCES profiles(id),
    task_id UUID REFERENCES tasks(task_id),
    PRIMARY KEY (user_id, task_id)
);

-- Create Tools Inventory Table
CREATE TABLE tools_inventory (
    tool_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    quantity INT CHECK (quantity >= 0),
    status TEXT CHECK (status IN ('available', 'in_use', 'maintenance'))
);

-- Create Training Materials Table
CREATE TABLE training_materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Task_Materials Junction Table for Assigning Materials to Tasks
CREATE TABLE task_materials (
    task_material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(task_id),
    material_id UUID REFERENCES training_materials(material_id)
);

-- Create Tool_Training Junction Table for Associating Training Materials with Tools
CREATE TABLE tool_training (
    tool_id UUID REFERENCES tools_inventory(tool_id),
    material_id UUID REFERENCES training_materials(material_id),
    PRIMARY KEY (tool_id, material_id)
);

-- Create Weather Information Table
CREATE TABLE weather_information (
    weather_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE,
    weather_data JSON
);

-- Create Assignments Table
CREATE TABLE assignments (
    assignment_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    project_id UUID,
    task_id UUID,
    role VARCHAR(255) NOT NULL CHECK (role IN ('manager', 'worker')),
    status VARCHAR(255) NOT NULL CHECK (status IN ('assigned', 'active', 'completed')),
    FOREIGN KEY (user_id) REFERENCES PROFILES(id),
    FOREIGN KEY (project_id) REFERENCES PROJECTS(project_id),
    FOREIGN KEY (task_id) REFERENCES TASKS(task_id)
);

-- Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
  company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);


-- Create Profiles Table
DROP TABLE IF EXISTS
  profiles;

CREATE TABLE
  profiles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    updated_at TIMESTAMPTZ,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT DEFAULT 'https://djujccksnyognbfbaxpx.supabase.co/storage/v1/object/sign/avatars/Profile1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL1Byb2ZpbGUxLmpwZyIsImlhdCI6MTcwOTQwODI0OCwiZXhwIjoyMzQwMTI4MjQ4fQ.RUqMIxuzqIrGx5qYdRVDUzMSQsyaHF273ge_K2qly8M&t=2024-03-02T19%3A37%3A27.603Z',
    is_manager BOOLEAN,
    company_id UUID,
    CONSTRAINT username_length CHECK (char_length(username) >= 3),
    CONSTRAINT fk_company_profiles FOREIGN KEY (company_id) REFERENCES companies (company_id)
  );

ALTER TABLE
  profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY
  "Public profiles are viewable by everyone." ON profiles FOR
SELECT
  USING (true);

CREATE POLICY
  "Users can insert their own profile." ON profiles FOR INSERT
WITH
  CHECK (auth.uid () = id);

CREATE POLICY
  "Users can update own profile." ON profiles FOR
UPDATE
  USING (auth.uid () = id);

CREATE FUNCTION
  public.handle_new_user () RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://djujccksnyognbfbaxpx.supabase.co/storage/v1/object/sign/avatars/Profile1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL1Byb2ZpbGUxLmpwZyIsImlhdCI6MTcwOTQwODI0OCwiZXhwIjoyMzQwMTI4MjQ4fQ.RUqMIxuzqIrGx5qYdRVDUzMSQsyaHF273ge_K2qly8M&t=2024-03-02T19%3A37%3A27.603Z'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER
  on_auth_user_created
AFTER
  INSERT ON auth.users FOR EACH ROW
EXECUTE
  PROCEDURE public.handle_new_user ();

INSERT INTO
  storage.buckets (id, name)
VALUES
  ('avatars', 'avatars');

CREATE POLICY
  "Avatar images are publicly accessible." ON storage.objects FOR
SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY
  "Anyone can upload an avatar." ON storage.objects FOR INSERT
WITH
  CHECK (bucket_id = 'avatars');
