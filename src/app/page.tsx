"use client"

import Link from "next/link"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Terminal, Code2, Trophy, Zap, Bug, ArrowRight, Cpu, 
  Globe, Shield, Activity, Command, Boxes, Layers, 
  Lock, MousePointer2, Sparkles, Binary, Hash, ChevronDown,
  Monitor, Database, Network, Key
} from "lucide-react"
import { useState, useEffect } from "react"

const languages = [
  { name: "PYTHON", icon: "🐍", color: "#3776AB" },
  { name: "JAVASCRIPT", icon: "JS", color: "#F7DF1E" },
  { name: "JAVA", icon: "☕", color: "#007396" },
  { name: "C++", icon: "C+", color: "#00599C" },
  { name: "GO", icon: "GO", color: "#00ADD8" },
]

const stats = [
  { label: "PATCHES_DEPLOYED", value: "124,892" },
  { label: "ACTIVE_OPERATIVES", value: "12,403" },
  { label: "SYSTEM_UPTIME", value: "99.99%" },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  
  const { scrollYProgress } = useScroll()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`relative w-full bg-[#020202] text-foreground font-sans selection:bg-primary/30 selection:text-primary overflow-x-hidden transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left shadow-[0_0_10px_#00f2ff]"
        style={{ scaleX }}
      />

      {/* Background Infrastructure */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
        
        {/* Animated Scanline */}
        <motion.div 
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[50vh] opacity-30"
        />

        {/* Matrix-like Code Dust */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: `${Math.random() * 100}%` }}
              animate={{ y: "110vh" }}
              transition={{ 
                duration: Math.random() * 20 + 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 10 
              }}
              className="absolute text-[8px] font-mono text-primary/40 writing-mode-vertical"
            >
              {Array.from({ length: 20 }).map(() => (Math.random() > 0.5 ? "0" : "1")).join("")}
            </motion.div>
          ))}
        </div>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[100vh] flex flex-col items-center justify-center px-6 text-center relative pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto relative"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-mono font-bold text-primary tracking-[0.4em] uppercase mb-12 animate-pulse">
              <Activity size={12} />
              Session Connection Established // Secure Layer 7
            </div>
            
            <h1 className="text-[clamp(3.5rem,12vw,9.5rem)] font-black tracking-tighter leading-[0.8] mb-10 uppercase italic">
              REWRITE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">REALITY</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-16 font-medium tracking-tight leading-relaxed">
              A high-stakes arena where logic is your only weapon. 
              Find the bugs, deploy the patches, and dominate the global mainframe.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
              <Button size="lg" className="h-16 px-14 text-lg font-black rounded-none bg-primary text-black hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(0,242,255,0.5)] relative group overflow-hidden" asChild>
                <Link href="/register">
                  <span className="relative z-10 flex items-center gap-3">
                    INITIALIZE_PROTOCOL <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-14 text-lg font-black rounded-none border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm" asChild>
                <Link href="/arena">ACCESS_ARENA</Link>
              </Button>
            </div>
          </motion.div>

          {/* Scrolling Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 opacity-[0.02] overflow-hidden select-none">
            <span className="text-[25vw] font-black italic whitespace-nowrap">DEBUGGER_v4</span>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[9px] font-mono tracking-[0.5em] text-muted-foreground uppercase">SCROLL_FOR_DATA</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </section>

        {/* Stats Grid */}
        <section className="py-24 border-y border-white/5 bg-black/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center text-center"
              >
                <span className="text-[10px] font-mono font-bold text-primary/60 tracking-[0.4em] uppercase mb-4">{stat.label}</span>
                <span className="text-5xl md:text-7xl font-black tracking-tighter tabular-nums text-white">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Protocol Bento Section */}
        <section id="protocols" className="py-40 px-6 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.02)_0%,transparent_50%)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-primary font-mono text-xs font-bold tracking-[0.6em] uppercase mb-6">
                  <div className="h-1 w-12 bg-primary" />
                  System_Core
                </div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">Technical <br /> Architecture</h2>
              </div>
              <p className="text-muted-foreground text-xl max-w-sm font-medium leading-relaxed">
                A multi-layered simulation designed to test the limits of modern software engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Main Feature */}
              <div className="md:col-span-8 group relative overflow-hidden border border-white/5 bg-white/[0.02] p-12 hover:bg-white/[0.04] transition-all rounded-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700">
                  <Cpu size={320} />
                </div>
                <Code2 className="text-primary mb-10" size={48} />
                <h3 className="text-4xl font-black tracking-tighter mb-8 uppercase italic leading-none">Universal Compiler</h3>
                <p className="text-muted-foreground text-xl leading-relaxed max-w-xl mb-12">
                  Integrated support for five major programming languages. Each sandbox is isolated and monitored for precise vulnerability assessment.
                </p>
                <div className="flex flex-wrap gap-4">
                  {languages.map(l => (
                    <div key={l.name} className="px-6 py-3 bg-black border border-white/5 text-[11px] font-black text-primary hover:border-primary/50 hover:shadow-[0_0_10px_rgba(0,242,255,0.2)] transition-all cursor-default">
                      {l.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Feature 1 */}
              <div className="md:col-span-4 group border border-white/5 bg-primary/5 p-12 relative overflow-hidden rounded-3xl">
                <Shield className="text-primary mb-10 shadow-[0_0_20px_rgba(0,242,255,0.4)]" size={48} />
                <h3 className="text-3xl font-black tracking-tighter mb-8 uppercase">Neural Guard</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Real-time pattern recognition detects suspicious activity and validates patches against thousands of edge cases instantly.
                </p>
              </div>

              {/* Side Feature 2 */}
              <div className="md:col-span-4 group border border-white/5 bg-white/[0.02] p-12 hover:bg-white/[0.04] transition-all rounded-3xl">
                <Network className="text-primary mb-10" size={48} />
                <h3 className="text-3xl font-black tracking-tighter mb-8 uppercase italic">Global Sync</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Low-latency synchronization ensures your rank is updated across the worldwide network within milliseconds.
                </p>
              </div>

              {/* Bottom Feature */}
              <div className="md:col-span-8 group border border-white/5 bg-white/[0.02] p-12 relative overflow-hidden rounded-3xl hover:bg-white/[0.04] transition-all">
                <div className="absolute -bottom-10 -right-10 text-primary opacity-[0.02] rotate-12 group-hover:opacity-10 transition-all duration-700">
                  <Trophy size={280} />
                </div>
                <Trophy className="text-primary mb-10" size={48} />
                <h3 className="text-4xl font-black tracking-tighter mb-8 uppercase italic leading-none">Legendary Tier</h3>
                <p className="text-muted-foreground text-xl leading-relaxed max-w-lg">
                  Climb from "Code Apprentice" to "Omniscient Architect." The top 0.1% earn exclusive access to secret experimental protocols.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="arena" className="py-60 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[120px]" />
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              whileInView={{ y: [40, 0], opacity: [0, 1] }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Bug size={100} className="text-primary mx-auto mb-12 drop-shadow-[0_0_30px_rgba(0,242,255,0.6)] animate-bounce" />
              <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase mb-12 leading-[0.8] italic">INITIATE <br /> ATTACK</h2>
              <p className="text-xl md:text-3xl text-muted-foreground mb-20 max-w-3xl mx-auto font-medium">
                The system is vulnerable. The clock is ticking. Will you patch the leak or let the mainframe collapse?
              </p>
              <Button size="lg" className="h-24 px-20 text-3xl font-black rounded-none bg-primary text-black hover:bg-primary/90 transition-all shadow-[0_0_60px_-15px_rgba(0,242,255,0.7)] group" asChild>
                <Link href="/arena">
                  LAUNCH_SYSTEM.exe <ArrowRight className="ml-6 h-8 w-8 group-hover:translate-x-3 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-white/5 py-32 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-24 mb-32">
              <div className="flex flex-col gap-10 max-w-md">
                <Link href="/" className="flex items-center gap-5">
                  <div className="h-14 w-14 flex items-center justify-center border border-primary bg-primary/5">
                    <Terminal size={32} className="text-primary" />
                  </div>
                  <span className="text-4xl font-black tracking-tighter italic">DEBUG.CODE</span>
                </Link>
                <div className="space-y-6">
                  <p className="text-[11px] font-mono font-black text-primary uppercase tracking-[0.6em] flex items-center gap-3">
                    <span className="h-2 w-2 bg-primary rounded-full animate-ping" />
                    PROJECT_TSY_CLUB_INTEL
                  </p>
                  <p className="text-2xl font-bold text-muted-foreground leading-snug">
                    VEL TECH RANGA SANKU ARTS COLLEGE <br />
                    <span className="text-white/30 text-base font-medium">Department of Computational Sciences & TSY CLUB</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-24">
                <div className="flex flex-col gap-8">
                  <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase">Core_Modules</span>
                  <nav className="flex flex-col gap-4 text-base font-bold">
                    <Link href="/arena" className="hover:text-primary transition-all">The Arena</Link>
                    <Link href="/leaderboard" className="hover:text-primary transition-all">Intel Hub</Link>
                    <Link href="/register" className="hover:text-primary transition-all">New Recruit</Link>
                  </nav>
                </div>
                <div className="flex flex-col gap-8">
                  <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase">Directives</span>
                  <nav className="flex flex-col gap-4 text-base font-bold">
                    <span className="hover:text-primary transition-all cursor-pointer">Protocol_Docs</span>
                    <span className="hover:text-primary transition-all cursor-pointer">Security_Brief</span>
                    <span className="hover:text-primary transition-all cursor-pointer">Manifesto</span>
                  </nav>
                </div>
                <div className="flex flex-col gap-8 hidden sm:flex">
                  <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase">Diagnostics</span>
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
                    <span className="text-xs font-black font-mono tracking-widest uppercase text-green-500">System_Online</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Activity size={20} className="text-primary" />
                    <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest">Build_v4.2.0_Stable</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-mono font-black text-muted-foreground tracking-[0.4em] uppercase">
              <p>© 2026 TSY_CLUB_VRS_COLLEGE // ALL_RIGHTS_RESERVED</p>
              <div className="flex gap-12">
                <span className="hover:text-white cursor-pointer transition-colors">Privacy_Layer</span>
                <span className="hover:text-white cursor-pointer transition-colors">Usage_Terms</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Persistent Audio Indicator (Fake for aesthetic) */}
      <div className="fixed bottom-10 right-10 z-[100] flex items-end gap-1 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [4, Math.random() * 20 + 10, 4] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            className="w-1 bg-primary/40 rounded-full"
          />
        ))}
      </div>
    </div>
  )
}
