# Quick Admin Setup Guide

## Method 1: Using Supabase Dashboard (EASIEST)

### Step 1: Create User
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** or **"Invite user"**
3. Fill in:
   - **Email**: `sushanth@admin.local`
   - **Password**: `123456`
   - **Auto Confirm User**: ✅ **CHECK THIS BOX** (very important!)
4. Click **"Create user"**
5. **Copy the User UUID** (you'll see it in the user details)

### Step 2: Set Admin Role
1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL (replace `YOUR_USER_UUID` with the UUID from Step 1):

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Step 3: Verify
Run this to check:

```sql
SELECT ur.user_id, ur.role, au.email 
FROM user_roles ur
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'admin';
```

You should see your user listed.

### Step 4: Login
1. Go to your app: `http://localhost:3000/login`
2. Login with:
   - **Email**: `sushanth@admin.local`
   - **Password**: `123456`
3. You should see the **"ADMIN PANEL"** button in the navbar
4. Click it or go to `/admin`

---

## Method 2: If User Already Exists

If you already created the user but it's not admin:

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find the user with email `sushanth@admin.local`
3. Copy their **UUID**
4. Go to **SQL Editor** and run:

```sql
-- Replace UUID_HERE with the actual UUID
INSERT INTO user_roles (user_id, role)
VALUES ('UUID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

---

## Troubleshooting

### "Access denied" after login

1. **Check if role exists:**
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_UUID';
   ```
   Should return a row with `role = 'admin'`

2. **Check RLS policies:**
   ```sql
   -- Verify admin policy exists
   SELECT * FROM pg_policies 
   WHERE tablename = 'profiles' 
   AND policyname = 'Admins can view all profiles';
   ```

3. **Logout and login again** - the auth context needs to refresh

4. **Clear browser cache/cookies** and try again

### Admin button not showing

1. Open browser **Developer Tools** (F12)
2. Check **Console** for errors
3. Check **Network** tab - look for failed API calls
4. Verify in console:
   ```javascript
   // In browser console after login
   // Check if isAdmin is true
   ```

### User created but can't login

1. Make sure **"Auto Confirm User"** was checked when creating user
2. Or manually confirm in Supabase Dashboard:
   - Go to **Authentication** → **Users**
   - Find your user
   - Click **"..."** → **"Confirm user"**

---

## Quick Test

After setup, test with this SQL:

```sql
-- This should return your admin user
SELECT 
  au.email,
  ur.role,
  au.email_confirmed_at,
  au.created_at
FROM auth.users au
LEFT JOIN user_roles ur ON ur.user_id = au.id
WHERE au.email = 'sushanth@admin.local';
```

Expected result:
- `email`: sushanth@admin.local
- `role`: admin
- `email_confirmed_at`: should have a timestamp (not null)

---

## Still Not Working?

1. **Check Supabase logs** for errors
2. **Verify environment variables** in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Restart your dev server** after making changes

4. **Check the browser console** for any JavaScript errors
