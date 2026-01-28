import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

/**
 * This route helps fix admin access by:
 * 1. Finding a user by email
 * 2. Setting their role to admin
 * 3. Or creating a new admin user if they don't exist
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Use service role to manage users
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Try to find existing user by email
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()
    
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 })
    }

    const existingUser = users.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      // User exists, use their ID
      userId = existingUser.id
    } else {
      // Create new user if password provided
      if (!password) {
        return NextResponse.json(
          { error: 'Password required to create new user' },
          { status: 400 }
        )
      }

      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: 'Admin User',
        }
      })

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }

      if (!authData.user) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      userId = authData.user.id
    }

    // Set or update role to admin
    const { error: roleError } = await adminClient
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin'
      }, {
        onConflict: 'user_id'
      })

    if (roleError) {
      console.error('Error setting admin role:', roleError)
      return NextResponse.json(
        { error: `Failed to assign admin role: ${roleError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: existingUser 
        ? 'User role updated to admin' 
        : 'Admin user created successfully',
      userId,
      email
    })
  } catch (error: any) {
    console.error('Error fixing admin:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
