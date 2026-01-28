"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Shield, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function SetupAdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)
  const [status, setStatus] = React.useState<string>("")

  const createAdmin = async () => {
    setLoading(true)
    setStatus("Setting up admin user...")

    try {
      // Format email - Supabase requires valid email format
      const email = 'sushanth@admin.local'
      const password = '123456'

      // Use fix-admin route which handles both creating and updating
      const response = await fetch('/api/admin/fix-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create admin')
      }

      setStatus("Admin user ready! Logging in...")
      
      // Wait a bit for the user and role to be fully set
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Login with the credentials
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        throw loginError
      }

      setStatus("Login successful! Verifying admin access...")
      
      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh to update auth context
      router.refresh()
      
      setStatus("Redirecting to admin panel...")
      toast.success("Admin account ready! Redirecting...")
      
      // Redirect to admin panel
      setTimeout(() => {
        router.push('/admin')
      }, 500)

    } catch (error: any) {
      console.error('Error:', error)
      setStatus(`Error: ${error.message}`)
      toast.error(error.message || "Failed to create admin")
      setLoading(false)
    }
  }

  return (
    <div className="container relative flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 terminal-grid opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-primary/20 bg-card/50 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield size={24} />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Setup</CardTitle>
            <CardDescription>Create admin account and login</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-primary/10">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-mono">Email/ID</p>
                  <p className="text-sm font-bold">sushanth@admin.local</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-mono">Password</p>
                  <p className="text-sm font-bold">123456</p>
                </div>
              </div>
            </div>

            {status && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary font-mono flex items-center gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {status}
                </p>
              </div>
            )}

            <Button 
              className="w-full h-11" 
              size="lg" 
              onClick={createAdmin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Create Admin & Login
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              This will create an admin account and automatically log you in
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
