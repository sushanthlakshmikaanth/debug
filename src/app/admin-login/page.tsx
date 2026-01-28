"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Lock, User, ArrowRight, Shield } from "lucide-react"
import { toast } from "sonner"

const ADMIN_CREDENTIALS = {
  id: "sushanth",
  password: "123456"
}

export default function AdminLoginPage() {
  const [id, setId] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    // Check if already logged in
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('admin_authenticated')
      if (isAdmin === 'true') {
        router.push('/admin')
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simple credential check
      if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
        // Set admin session
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_authenticated', 'true')
          localStorage.setItem('admin_id', id)
        }
        
        toast.success("Admin login successful!")
        router.push('/admin')
      } else {
        toast.error("Invalid credentials")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login")
    } finally {
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
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
            <CardDescription>Enter your admin credentials to access the panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User size={14} className="text-primary" /> Admin ID
                </label>
                <Input 
                  type="text" 
                  placeholder="Enter admin ID" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Lock size={14} className="text-primary" /> Password
                </label>
                <Input 
                  type="password" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button className="w-full h-11 group" size="lg" type="submit" disabled={loading}>
                {loading ? "Authenticating..." : "Access Admin Panel"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
