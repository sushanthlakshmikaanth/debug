"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Terminal, Copy, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function AdminSetupPage() {
  const [copied, setCopied] = React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(id)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const sqlCommands = [
    {
      id: '1',
      title: 'Step 1: Create User in Supabase Dashboard',
      description: 'Go to Authentication > Users > Add user',
      details: [
        'Email: sushanth@admin.local',
        'Password: 123456',
        '✅ CHECK "Auto Confirm User"',
        'Click "Create user"',
        'Copy the User UUID'
      ]
    },
    {
      id: '2',
      title: 'Step 2: Run This SQL in Supabase SQL Editor',
      description: 'Replace YOUR_USER_UUID with the UUID from Step 1',
      sql: `INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';`
    },
    {
      id: '3',
      title: 'Step 3: Verify Admin Role',
      description: 'Run this to check if admin was created',
      sql: `SELECT ur.user_id, ur.role, au.email 
FROM user_roles ur
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'admin';`
    },
    {
      id: '4',
      title: 'Step 4: Fix RLS Policies (if needed)',
      description: 'Ensure admins can access profiles',
      sql: `CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );`
    }
  ]

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tight mb-3">Admin Setup Guide</h1>
        <p className="text-muted-foreground">Follow these steps to create your admin account</p>
      </div>

      <div className="space-y-6">
        {sqlCommands.map((step, index) => (
          <Card key={step.id} className="border-primary/20 bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="mt-1">{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {step.details && (
                <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                  {step.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
              
              {step.sql && (
                <div className="relative">
                  <div className="absolute top-2 right-2">
                    {mounted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(step.sql!, step.id)}
                        className="h-8"
                      >
                        {copied === step.id ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    )}
                  </div>
                  <pre className="p-4 bg-black/50 border border-primary/20 rounded-lg overflow-x-auto text-xs font-mono text-primary">
                    <code>{step.sql}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500">
              <CheckCircle2 size={20} />
              Step 5: Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">After completing the steps above:</p>
              <div className="p-4 bg-black/50 rounded-lg border border-primary/20">
                <div className="space-y-2 font-mono text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>{' '}
                    <span className="text-primary font-bold">sushanth@admin.local</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Password:</span>{' '}
                    <span className="text-primary font-bold">123456</span>
                  </div>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <a href="/login">Go to Login Page</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500">
              <AlertCircle size={20} />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>If you still get "Access denied":</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
              <li>Make sure you copied the correct User UUID</li>
              <li>Verify the SQL ran without errors</li>
              <li>Logout and login again</li>
              <li>Check browser console (F12) for errors</li>
              <li>Verify in Supabase: Run Step 3 SQL to see if admin exists</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
