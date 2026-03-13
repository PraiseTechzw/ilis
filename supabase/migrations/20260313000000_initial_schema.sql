-- ILIS Initial Schema Migration

-- 1. Create Enums
CREATE TYPE role_type AS ENUM ('INNOVATOR', 'MENTOR', 'EVALUATOR', 'HUB_ADMIN', 'EXECUTIVE');
CREATE TYPE project_stage AS ENUM ('INTAKE', 'IDEATION', 'PROTOTYPING', 'MARKET_VALIDATION', 'COMMERCIALIZATION', 'GRADUATED', 'ARCHIVED');
CREATE TYPE innovation_category AS ENUM ('SOFTWARE', 'HARDWARE', 'BIOTECH', 'CLEANTECH', 'SERVICE');
CREATE TYPE risk_level AS ENUM ('HEALTHY', 'LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK_STAGNANT');

-- 2. Create Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    department_id UUID, -- Placeholder for department linking
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create User Roles Table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role role_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 4. Create Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    abstract TEXT,
    pi_id UUID NOT NULL REFERENCES profiles(id),
    current_stage project_stage DEFAULT 'INTAKE',
    innovation_category innovation_category,
    tags TEXT[] DEFAULT '{}',
    trl_level INTEGER CHECK (trl_level >= 1 AND trl_level <= 9) DEFAULT 1,
    irl_level INTEGER CHECK (irl_level >= 1 AND irl_level <= 9) DEFAULT 1,
    latest_viability_score DECIMAL(5,2),
    latest_risk_score INTEGER CHECK (latest_risk_score >= 0 AND latest_risk_score <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Create Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    bucket_path VARCHAR NOT NULL,
    file_name VARCHAR,
    document_type VARCHAR, -- e.g., 'PITCH_DECK', 'FINANCIALS'
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trigger: Handle Profile Creation on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Assign default Role: INNOVATOR
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'INNOVATOR');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Row Level Security (RLS) Initial Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Roles Policies
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- Projects Policies
CREATE POLICY "Innovators can view their own projects" ON projects 
FOR SELECT USING (auth.uid() = pi_id);

CREATE POLICY "Innovators can update their own projects" ON projects 
FOR UPDATE USING (auth.uid() = pi_id);

CREATE POLICY "Innovators can create projects" ON projects 
FOR INSERT WITH CHECK (auth.uid() = pi_id);

-- Documents Policies
CREATE POLICY "Users can view documents of their own projects" ON documents 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM projects WHERE id = documents.project_id AND pi_id = auth.uid()
  )
);
