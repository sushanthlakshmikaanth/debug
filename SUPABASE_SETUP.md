# Supabase Setup Guide

This project uses Supabase for authentication and database management. Follow these steps to set up your Supabase database.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://tpfxcrbvpvcflkosszu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZnhjcmNicHZjZmxla29zc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTIyNDAsImV4cCI6MjA4NTEyODI0MH0.rbX93MlSDhYXr8wsmbv9u2Su4oiTMEfjt0sMOnoSrUs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZnhjcmNicHZjZmxla29zc3p1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU1MjI0MCwiZXhwIjoyMDg1MTI4MjQwfQ.7UK7nQqjeOPkAxmwPsrrWIE8QDaLFfS3C3wcw6hgKv0
```

## Database Schema

Run these SQL commands in your Supabase SQL Editor to create the necessary tables:

### 1. Profiles Table

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  phone TEXT,
  is_team BOOLEAN DEFAULT FALSE,
  team_member_name TEXT,
  team_member_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. User Roles Table

```sql
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own role
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Admins can view all roles
CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Service role can insert/update roles (for admin assignment)
CREATE POLICY "Service role can manage roles" ON user_roles
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

### 3. Function to Auto-Create Profile

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, college, department, year, phone, is_team, team_member_name, team_member_email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'college',
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'year',
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'is_team')::boolean, false),
    NEW.raw_user_meta_data->>'team_member_name',
    NEW.raw_user_meta_data->>'team_member_email'
  );
  
  -- Default role is student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Setting Up an Admin User

To create an admin user, you have two options:

### Option 1: Using Supabase Dashboard

1. Go to Authentication > Users in your Supabase dashboard
2. Create a new user or use an existing user
3. Note the user's UUID
4. Go to SQL Editor and run:

```sql
UPDATE user_roles
SET role = 'admin'
WHERE user_id = 'USER_UUID_HERE';
```

### Option 2: Using Service Role Key (Server-side)

You can create a script or API route to promote a user to admin using the service role key.

## Authentication Flow

### Student Authentication
- Students register through `/register`
- They can login through `/login`
- After login, they are redirected to `/arena`

### Admin Authentication
- Admins login through `/login` (same as students)
- The system checks their role in the `user_roles` table
- Only users with `role = 'admin'` can access `/admin`
- Non-admin users are redirected to `/login` with an error message

## Security Notes

1. **Service Role Key**: Keep the service role key secure and never expose it in client-side code
2. **Row Level Security**: All tables have RLS enabled for security
3. **Admin Access**: Admin routes are protected both client-side and server-side
4. **Email Verification**: Supabase email verification is enabled by default

## Testing

1. Register a new student account at `/register`
2. Login at `/login`
3. Access `/admin` - should be denied unless you're an admin
4. To test admin access, promote a user to admin using the SQL commands above
