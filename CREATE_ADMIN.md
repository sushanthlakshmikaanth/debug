# How to Create an Admin User

There are multiple ways to create an admin user for the system:

## Method 1: Using Node.js Script (Recommended)

1. Make sure you have your `.env.local` file with the Supabase credentials
2. Run the script:

```bash
node scripts/create-admin.js
```

Or with custom credentials:

```bash
node scripts/create-admin.js admin@yourdomain.com yourpassword123 "Admin Name"
```

**Default credentials (if no arguments provided):**
- Email: `admin@example.com`
- Password: `admin123456`
- Name: `Admin User`

## Method 2: Using Supabase Dashboard (Manual)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add user"** or **"Create new user"**
4. Enter:
   - Email: `admin@yourdomain.com`
   - Password: `your-secure-password`
   - Auto Confirm User: **Yes** (check this box)
5. Click **"Create user"**
6. Copy the **User UID** from the user details
7. Go to **SQL Editor** and run:

```sql
-- Replace 'USER_UUID_HERE' with the actual UUID from step 6
UPDATE user_roles
SET role = 'admin'
WHERE user_id = 'USER_UUID_HERE';

-- If the user doesn't have a role entry yet, use:
INSERT INTO user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Method 3: Using API Route (Development Only)

You can create an admin via API call:

```bash
curl -X POST http://localhost:3000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456",
    "name": "Admin User"
  }'
```

**⚠️ Warning:** This API route should be disabled in production or protected with additional authentication.

## Method 4: Direct SQL (Quick Setup)

If you already have a user account and want to make it admin:

1. Go to Supabase Dashboard > **SQL Editor**
2. Find your user's UUID from **Authentication > Users**
3. Run:

```sql
-- Make existing user an admin
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Verify Admin Access

After creating the admin user:

1. Logout if you're currently logged in
2. Login with the admin credentials at `/login`
3. You should see the **"ADMIN PANEL"** button in the navbar
4. Click it or navigate to `/admin` to access the admin dashboard

## Troubleshooting

### "Access denied. Admin privileges required."

- Make sure the user exists in `user_roles` table with `role = 'admin'`
- Check that you're logged in with the correct account
- Try logging out and logging back in
- Verify in Supabase: `SELECT * FROM user_roles WHERE role = 'admin';`

### Admin button not showing in navbar

- Refresh the page after login
- Check browser console for errors
- Verify `isAdmin` is `true` in the auth context

### User created but can't login

- Make sure email confirmation is set to `true` (or disable email confirmation in Supabase settings)
- Check that the password meets requirements (min 6 characters)
- Verify the user exists in Supabase Authentication > Users
