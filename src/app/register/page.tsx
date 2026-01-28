"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, User, Building2, BookOpen, GraduationCap, Mail, Phone, ArrowRight, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { addRegistration, setCurrentUser } from "@/lib/adminStore"

export default function RegisterPage() {
  const [isTeam, setIsTeam] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = React.useState({
    name: "",
    college: "",
    department: "",
    year: "1st Year",
    email: "",
    phone: "",
    password: "",
    teamMemberName: "",
    teamMemberEmail: "",
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined,
          data: {
            name: formData.name,
            college: formData.college,
            department: formData.department,
            year: formData.year,
            phone: formData.phone,
            is_team: isTeam,
            team_member_name: isTeam ? formData.teamMemberName : null,
            team_member_email: isTeam ? formData.teamMemberEmail : null,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Auto-confirm user using API route
        const confirmResponse = await fetch('/api/auth/confirm-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: authData.user.id }),
        })

        if (!confirmResponse.ok) {
          console.error("Failed to auto-confirm user")
        }

        // Ensure profile is created
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            college: formData.college,
            department: formData.department,
            year: formData.year,
            phone: formData.phone,
            is_team: isTeam,
            team_member_name: isTeam ? formData.teamMemberName : null,
            team_member_email: isTeam ? formData.teamMemberEmail : null,
          })

        if (profileError) {
          console.error("Profile creation error:", profileError)
        }

        toast.success("Registration successful! Redirecting to arena...")
        // Save registration locally for admin panel (no Supabase required)
        addRegistration({
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
          college: formData.college,
          department: formData.department,
          year: formData.year,
          phone: formData.phone,
          isTeam,
          teamMemberName: isTeam ? formData.teamMemberName : undefined,
          teamMemberEmail: isTeam ? formData.teamMemberEmail : undefined,
          createdAt: new Date().toISOString(),
        })
        setCurrentUser({ name: formData.name, email: formData.email })

        // Sign in the user immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          console.error("Sign in error:", signInError)
        }

        router.push("/arena")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">Participant Registration</h1>
          <p className="text-muted-foreground">Secure your spot in the arena. Registration closes in 48 hours.</p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="mb-6 flex justify-center">
              <div className="flex rounded-lg border border-border p-1">
                <button
                  onClick={() => setIsTeam(false)}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    !isTeam ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User size={16} /> Individual
                </button>
                <button
                  onClick={() => setIsTeam(true)}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    isTeam ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Users size={16} /> Team (2 members)
                </button>
              </div>
            </div>
            <CardTitle className="text-xl">Registration Form</CardTitle>
            <CardDescription>Enter your details as they appear on your college ID.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User size={14} className="text-primary" /> Full Name
                  </label>
                  <Input 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building2 size={14} className="text-primary" /> College Name
                  </label>
                  <Input 
                    placeholder="Tech Institute of Technology" 
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen size={14} className="text-primary" /> Department
                  </label>
                  <Input 
                    placeholder="Computer Science" 
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <GraduationCap size={14} className="text-primary" /> Year of Study
                  </label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    disabled={loading}
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail size={14} className="text-primary" /> Email Address
                  </label>
                  <Input 
                    type="email" 
                    placeholder="john@college.edu" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone size={14} className="text-primary" /> Phone Number
                  </label>
                  <Input 
                    type="tel" 
                    placeholder="+91 9876543210" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock size={14} className="text-primary" /> Password
                  </label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              {isTeam && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-6 border-t border-border pt-6"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Users size={18} className="text-primary" /> Team Member 2
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <Input 
                        placeholder="Jane Smith" 
                        value={formData.teamMemberName}
                        onChange={(e) => setFormData({ ...formData, teamMemberName: e.target.value })}
                        required={isTeam}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="jane@college.edu" 
                        value={formData.teamMemberEmail}
                        onChange={(e) => setFormData({ ...formData, teamMemberEmail: e.target.value })}
                        required={isTeam}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 p-4 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                By clicking register, you agree to our contest rules and guidelines.
              </div>

              <Button className="w-full h-11 text-base group" size="lg" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Complete Registration"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
