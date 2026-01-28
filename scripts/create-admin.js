/**
 * Script to create an admin user
 * Run this with: node scripts/create-admin.js
 * 
 * Make sure to set your environment variables first in .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local file manually
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8')
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        process.env[key] = value
      }
    })
  }
}

loadEnv()

async function createAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables!')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Get admin details from command line or use defaults
  const args = process.argv.slice(2)
  const email = args[0] || 'admin@example.com'
  const password = args[1] || 'admin123456'
  const name = args[2] || 'Admin User'

  console.log('🔐 Creating admin user...')
  console.log(`Email: ${email}`)
  console.log(`Name: ${name}`)

  try {
    // Create user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      }
    })

    if (authError) {
      console.error('❌ Error creating user:', authError.message)
      process.exit(1)
    }

    if (!authData.user) {
      console.error('❌ Failed to create user')
      process.exit(1)
    }

    console.log('✅ User created:', authData.user.id)

    // Set admin role
    const { error: roleError } = await adminClient
      .from('user_roles')
      .upsert({
        user_id: authData.user.id,
        role: 'admin'
      })

    if (roleError) {
      console.error('❌ Error setting admin role:', roleError.message)
      // Try to delete the user
      await adminClient.auth.admin.deleteUser(authData.user.id)
      process.exit(1)
    }

    console.log('✅ Admin role assigned successfully!')
    console.log('\n📋 Login Credentials:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('\n🔗 You can now login at: http://localhost:3000/login')
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

createAdmin()
