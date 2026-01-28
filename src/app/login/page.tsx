"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success("Login successful!")
      router.push("/arena")
      router.refresh()
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
              <Terminal size={24} />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Access Arena</CardTitle>
            <CardDescription>Enter your credentials to enter the competition.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail size={14} className="text-primary" /> Email Address
                </label>
                <Input 
                  type="email" 
                  placeholder="john@college.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock size={14} className="text-primary" /> Password
                  </label>
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button className="w-full h-11 group" size="lg" type="submit" disabled={loading}>
                {loading ? "Initializing..." : "Initialize Login"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-border pt-6">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account? <Link href="/register" className="text-primary hover:underline">Register here</Link>
            </div>
            <Link 
              href="/admin-login" 
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ShieldCheck size={12} />
              Admin Portal
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
