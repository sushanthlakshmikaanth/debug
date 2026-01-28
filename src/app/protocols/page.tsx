"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, Zap, AlertTriangle, Terminal, Cpu, Network, Database } from "lucide-react"

const protocols = [
  {
    id: "01",
    title: "OPERATIONAL INTEGRITY",
    description: "Every patch must be verified against the core mainframe logic. Any attempt to bypass validation layers will result in immediate session termination.",
    icon: Shield,
    color: "text-blue-400"
  },
  {
    id: "02",
    title: "ENCRYPTION STANDARDS",
    description: "All data transmissions within the Arena are protected by Layer 7 quantum-resistant tunnels. Your source code remains your own.",
    icon: Lock,
    color: "text-purple-400"
  },
  {
    id: "03",
    title: "NEURAL MONITORING",
    description: "Our AI, THE EYE, monitors submission patterns to detect non-human intervention. Speed is rewarded, but logic must remain human-centric.",
    icon: Eye,
    color: "text-primary"
  },
  {
    id: "04",
    title: "RESOURCE ALLOCATION",
    description: "Operatives are granted 512MB of isolated memory per compilation. Exceeding these limits will trigger a heap-overflow containment protocol.",
    icon: Cpu,
    color: "text-orange-400"
  },
  {
    id: "05",
    title: "ZERO TRUST ACCESS",
    description: "Command Center access is restricted to verified administrators only. Multiple failed login attempts will initiate a hardware-level lockout.",
    icon: Network,
    color: "text-green-400"
  }
]

export default function ProtocolsPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 text-primary font-mono text-[10px] font-bold tracking-[0.6em] uppercase mb-8">
            <div className="h-[1px] w-12 bg-primary" />
            VRS_COLLEGE // SECURITY_MANIFESTO
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none italic mb-8">
            SYSTEM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">PROTOCOLS</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
            The fundamental directives governing the Arena. Adherence is non-negotiable. 
            Failure to comply results in permanent expulsion from the mainframe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {protocols.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all">
                <p.icon size={120} />
              </div>
              
              <div className={`mb-8 p-3 w-fit rounded-lg bg-black border border-white/5 ${p.color}`}>
                <p.icon size={24} />
              </div>

              <div className="relative z-10">
                <span className="text-[10px] font-mono font-bold text-primary/60 tracking-widest mb-4 block">
                  PROTOCOL_ID // {p.id}
                </span>
                <h3 className="text-2xl font-black tracking-tighter mb-6 uppercase italic">{p.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="md:col-span-2 lg:col-span-3 mt-12 p-12 border border-red-500/20 bg-red-500/5 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 text-red-500 animate-pulse">
              <AlertTriangle size={200} />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
                <AlertTriangle size={48} />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-3xl font-black tracking-tighter text-red-500 uppercase mb-4">CRITICAL VIOLATION NOTICE</h4>
                <p className="text-red-200/60 max-w-2xl font-medium leading-relaxed">
                  The use of external scripts, automation tools, or unauthorized API calls is strictly prohibited. 
                  Our heuristics engine identifies anomalous behavior with 99.9% accuracy. 
                  Violators will be blacklisted across all future TSY CLUB events.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Attribution */}
        <div className="mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 opacity-50">
          <div className="flex items-center gap-4">
            <Terminal size={24} className="text-primary" />
            <span className="text-xs font-mono font-black tracking-[0.4em] uppercase">VRS_COLLEGE_OPERATIONS</span>
          </div>
          <p className="text-[10px] font-mono font-black tracking-[0.4em] uppercase text-center md:text-right">
            TSY CLUB // DEPT OF COMPUTATIONAL SCIENCES
          </p>
        </div>
      </div>
    </div>
  )
}
