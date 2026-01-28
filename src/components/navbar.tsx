"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Terminal, Command, X, Menu, LogOut, User, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const { user, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-sm border border-primary/40 bg-black group-hover:border-primary transition-colors">
              <Terminal size={20} className="text-primary group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none italic">DEBUG.CODE</span>
            <span className="text-[8px] font-mono text-primary/60 uppercase tracking-widest font-bold">VRS_TSY_SYSTEMS_v4.2</span>
          </div>
        </Link>

          <nav className="hidden lg:flex items-center gap-12">
            <Link 
              href="/protocols"
              className={`text-[10px] font-mono font-bold tracking-[0.2em] transition-all uppercase relative group ${
                pathname === "/protocols" ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              PROTOCOLS
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-300 shadow-[0_0_5px_#00f2ff] ${
                pathname === "/protocols" ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
            <Link 
              href="/arena"
              className={`text-[10px] font-mono font-bold tracking-[0.2em] transition-all uppercase relative group ${
                pathname === "/arena" ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              ARENA
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-300 shadow-[0_0_5px_#00f2ff] ${
                pathname === "/arena" ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
            <Link 
              href="/admin-login"
              className={`text-[10px] font-mono font-bold tracking-[0.2em] transition-all uppercase relative group ${
                pathname === "/admin-login" || pathname === "/admin" ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              ADMIN
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-300 shadow-[0_0_5px_#00f2ff] ${
                pathname === "/admin-login" || pathname === "/admin" ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          <div className="h-4 w-[1px] bg-white/10" />
          {!loading && mounted && (
            user ? (
              <div className="flex items-center gap-4">
                {(() => {
                  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('admin_authenticated') === 'true'
                  return isAdmin ? (
                    <Button 
                      variant="default"
                      className="h-9 rounded-none bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary text-primary text-[10px] font-mono tracking-widest hover:shadow-[0_0_15px_-5px_#00f2ff]"
                      asChild
                    >
                      <Link href="/admin" className="flex items-center gap-2">
                        <Shield size={14} />
                        ADMIN PANEL
                      </Link>
                    </Button>
                  ) : null
                })()}
                <Button 
                  variant="outline" 
                  className="h-9 rounded-none border-primary/20 hover:border-primary bg-transparent text-[10px] font-mono tracking-widest hover:shadow-[0_0_15px_-5px_#00f2ff]"
                  onClick={signOut}
                >
                  <LogOut size={12} className="mr-2" />
                  LOGOUT
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="h-9 rounded-none border-primary/20 hover:border-primary bg-transparent text-[10px] font-mono tracking-widest hover:shadow-[0_0_15px_-5px_#00f2ff]" asChild>
                <Link href="/login">COMMAND_CENTER</Link>
              </Button>
            )
          )}
        </nav>

        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Command size={20} />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 lg:hidden"
          >
            <nav className="flex flex-col p-6 gap-6">
              <Link
                href="/protocols"
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono font-bold tracking-[0.3em] text-muted-foreground hover:text-primary transition-all uppercase"
              >
                PROTOCOLS
              </Link>
              <Link
                href="/arena"
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono font-bold tracking-[0.3em] text-muted-foreground hover:text-primary transition-all uppercase"
              >
                ARENA
              </Link>
              <Link
                href="/admin-login"
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono font-bold tracking-[0.3em] text-muted-foreground hover:text-primary transition-all uppercase"
              >
                ADMIN
              </Link>
              {mounted && (() => {
                const isAdmin = typeof window !== 'undefined' && localStorage.getItem('admin_authenticated') === 'true'
                return isAdmin ? (
                  <Button
                    variant="default"
                    className="w-full justify-start h-10 rounded-none bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary text-primary text-xs font-mono tracking-widest"
                    asChild
                  >
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <Shield size={14} />
                      ADMIN PANEL
                    </Link>
                  </Button>
                ) : null
              })()}
              {user ? (
                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="text-xs font-mono font-bold tracking-[0.3em] text-muted-foreground hover:text-primary transition-all uppercase text-left"
                >
                  LOGOUT
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-mono font-bold tracking-[0.3em] text-muted-foreground hover:text-primary transition-all uppercase"
                >
                  COMMAND CENTER
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
