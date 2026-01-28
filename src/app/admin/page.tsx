"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  FileQuestion, 
  Users, 
  Activity, 
  Settings, 
  Plus, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Terminal,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogOut,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  User as UserIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getRegistrations, getSubmissions, type AdminRegistration, type ArenaSubmission, clearAdminData, removeRegistration } from "@/lib/adminStore"

const stats = [
  { label: "Total Participants", value: "482", change: "+12%", trend: "up", icon: Users },
  { label: "Active Questions", value: "24", change: "+4", trend: "up", icon: FileQuestion },
  { label: "Completion Rate", value: "68%", change: "-2%", trend: "down", icon: Activity },
  { label: "Avg. Solve Time", value: "12m 4s", change: "-1m", trend: "up", icon: Settings },
]

const recentSubmissions = [
  { user: "Binary Beats", action: "solved Q#04", time: "2m ago", status: "success", lang: "Python" },
  { user: "Null Pointers", action: "failed Q#07", time: "5m ago", status: "fail", lang: "JavaScript" },
  { user: "Logic Lords", action: "started Q#05", time: "8m ago", status: "info", lang: "C++" },
  { user: "Code Wizards", action: "solved Q#02", time: "12m ago", status: "success", lang: "Java" },
]

const questions = [
  { id: "Q#01", title: "Array Buffer Overflow", difficulty: "Medium", solves: 142, points: 100 },
  { id: "Q#02", title: "Concurrent Race Condition", difficulty: "Hard", solves: 45, points: 250 },
  { id: "Q#03", title: "Memory Leak in Loop", difficulty: "Easy", solves: 289, points: 50 },
]

type Profile = AdminRegistration

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState("Dashboard")
  const [isLive, setIsLive] = React.useState(true)
  const [participants, setParticipants] = React.useState<Profile[]>([])
  const [loadingParticipants, setLoadingParticipants] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [submissions, setSubmissions] = React.useState<ArenaSubmission[]>([])
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Check admin authentication
    if (typeof window !== 'undefined') {
      const adminAuth = localStorage.getItem('admin_authenticated')
      if (adminAuth === 'true') {
        setIsAuthenticated(true)
        setLoading(false)
      } else {
        toast.error("Access denied. Admin privileges required.")
        router.push("/admin-login")
      }
    }
  }, [router])

  const signOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_authenticated')
      localStorage.removeItem('admin_id')
    }
    router.push("/admin-login")
  }

  React.useEffect(() => {
    if (activeTab === "Participants" && isAuthenticated) {
      fetchParticipants()
    }
  }, [activeTab, isAuthenticated])

  const fetchParticipants = async () => {
    setLoadingParticipants(true)
    try {
      const regs = getRegistrations()
      setParticipants(regs)
    } catch (error: any) {
      console.error("Error fetching participants:", error)
      toast.error("Failed to load participants")
      setParticipants([])
    } finally {
      setLoadingParticipants(false)
    }
  }

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const scoreByEmail = React.useMemo(() => {
    const map = new Map<string, { marks: number; max: number; success: number; total: number }>()
    for (const s of submissions) {
      const key = (s.userEmail || "unknown").toLowerCase()
      const prev = map.get(key) || { marks: 0, max: 0, success: 0, total: 0 }
      map.set(key, {
        marks: prev.marks + (s.marks ?? 0),
        max: prev.max + (s.maxMarks ?? 0),
        success: prev.success + (s.status === "success" ? 1 : 0),
        total: prev.total + 1,
      })
    }
    return map
  }, [submissions])

  React.useEffect(() => {
    if (!isAuthenticated) return
    if (activeTab === "Dashboard" || activeTab === "Live Contest") {
      setSubmissions(getSubmissions())
    }
  }, [activeTab, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono text-sm">LOADING_AUTHENTICATION...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Participants", value: String(getRegistrations().length), change: "", trend: "up", icon: Users },
                { label: "Total Submissions", value: String(getSubmissions().length), change: "", trend: "up", icon: Activity },
                { label: "Solved", value: String(getSubmissions().filter(s => s.status === "success").length), change: "", trend: "up", icon: CheckCircle2 },
                { label: "Failed", value: String(getSubmissions().filter(s => s.status === "fail").length), change: "", trend: "down", icon: XCircle },
              ].map((stat) => (
                <Card key={stat.label} className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <stat.icon size={20} />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-mono tracking-tight text-white">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-white/5 bg-white/[0.02]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black italic">LIVE FEED</CardTitle>
                    <CardDescription>Real-time submission stream</CardDescription>
                  </div>
                  <div className="relative w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input className="h-8 pl-8 text-[10px] font-mono bg-white/5 border-white/10" placeholder="SEARCH_OPERATIVES..." />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(submissions.slice(0, 12)).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className={`h-2 w-2 rounded-full ${
                            item.status === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                            'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                          }`} />
                          <div>
                            <p className="text-sm font-black text-white italic">{item.userName}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {item.status === "success" ? "solved" : "failed"} {item.questionId}{" "}
                              <span className="text-primary/40">[{item.language}]</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-white/5 bg-white/[0.02]">
                  <CardHeader>
                    <CardTitle className="text-lg font-black italic">CONTEST_STATUS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Mainframe</span>
                      <Badge variant={isLive ? "default" : "destructive"} className="rounded-none font-mono text-[9px] tracking-widest">
                        {isLive ? "OPERATIONAL" : "OFFLINE"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Runtime</span>
                      <span className="text-sm font-mono font-bold text-white">01:42:15</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        className="h-full bg-primary shadow-[0_0_10px_#00f2ff]"
                      />
                    </div>
                    <Button 
                      onClick={() => setIsLive(!isLive)}
                      variant={isLive ? "destructive" : "default"} 
                      className="w-full rounded-none font-black text-[10px] tracking-widest uppercase"
                    >
                      {isLive ? "SUSPEND_ALL_PROTOCOLS" : "INITIALIZE_SYSTEM"}
                    </Button>
                    <Button
                      onClick={() => {
                        clearAdminData()
                        setParticipants([])
                        setSubmissions([])
                        toast.success("Local admin data cleared")
                      }}
                      variant="outline"
                      className="w-full rounded-none font-black text-[10px] tracking-widest uppercase border-white/10 bg-white/5 hover:bg-white/10"
                      disabled={!mounted}
                    >
                      CLEAR_LOCAL_DATA
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-white/5 bg-white/[0.02]">
                  <CardHeader>
                    <CardTitle className="text-lg font-black italic">KERNEL_LOGS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 font-mono text-[9px] text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-green-500">[OK]</span>
                      <span>SYNC_NODES_ACTIVE</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">[INFO]</span>
                      <span>ENCRYPTING_SESSION_DATA</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-500">[WARN]</span>
                      <span>LATENCY_SPIKE_DETECTED</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      case "Questions":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase">Challenge Repository</h2>
              <Button className="rounded-none bg-primary text-black font-black text-[10px] tracking-widest uppercase px-6">
                <Plus className="mr-2 h-4 w-4" /> ADD_NEW_VULNERABILITY
              </Button>
            </div>
            <div className="grid gap-4">
              {questions.map((q) => (
                <Card key={q.id} className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 flex items-center justify-center border border-white/10 bg-white/5 font-mono text-xs font-black text-primary group-hover:border-primary transition-colors">
                        {q.id}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white italic uppercase">{q.title}</h3>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">{q.difficulty}</span>
                          <span className="text-[10px] font-mono text-primary uppercase">{q.points} PTS</span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">{q.solves} SOLVED</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                      <MoreVertical size={20} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      case "Participants":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase">Registered Participants</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10 bg-white/5 border-white/10" 
                  placeholder="Search participants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loadingParticipants ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono mb-4">
                  Total: {filteredParticipants.length} participant{filteredParticipants.length !== 1 ? 's' : ''}
                </div>
                {filteredParticipants.length === 0 ? (
                  <Card className="border-white/5 bg-white/[0.02]">
                    <CardContent className="p-12 text-center">
                      <Users className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <p className="text-muted-foreground font-medium">No participants found</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredParticipants.map((participant) => {
                    const score =
                      scoreByEmail.get(participant.email.toLowerCase()) || {
                        marks: 0,
                        max: 0,
                        success: 0,
                        total: 0,
                      }

                    return (
                      <Card
                        key={participant.id}
                        className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                      >
                        <CardContent className="p-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <UserIcon size={20} className="text-primary" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-black text-white italic uppercase">
                                    {participant.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    {participant.isTeam && (
                                      <Badge variant="default" className="text-[9px] font-mono">
                                        TEAM
                                      </Badge>
                                    )}
                                    <Badge
                                      variant="outline"
                                      className="rounded-none font-mono text-[9px] tracking-widest border-white/10 bg-white/5"
                                    >
                                      SCORE {score.marks}/{score.max}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="rounded-none font-mono text-[9px] tracking-widest border-white/10 bg-white/5"
                                    >
                                      {score.success}/{score.total} OK
                                    </Badge>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                      {new Date(participant.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-3 pl-13">
                                <div className="flex items-center gap-3">
                                  <Mail size={14} className="text-primary/60" />
                                  <span className="text-sm text-muted-foreground font-mono">
                                    {participant.email || "N/A"}
                                  </span>
                                </div>
                                {participant.phone && (
                                  <div className="flex items-center gap-3">
                                    <Phone size={14} className="text-primary/60" />
                                    <span className="text-sm text-muted-foreground font-mono">
                                      {participant.phone}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-3">
                                  <Building2 size={14} className="text-primary/60" />
                                  <span className="text-sm text-muted-foreground font-mono">
                                    {participant.college}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Terminal size={14} className="text-primary/60" />
                                  <span className="text-sm text-muted-foreground font-mono">
                                    {participant.department}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <GraduationCap size={14} className="text-primary/60" />
                                  <span className="text-sm text-muted-foreground font-mono">
                                    {participant.year}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {participant.isTeam && participant.teamMemberName && (
                              <div className="space-y-4 border-l border-white/5 pl-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users size={16} className="text-primary" />
                                  <h4 className="text-sm font-black text-white uppercase">
                                    Team Member 2
                                  </h4>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                                      Name
                                    </p>
                                    <p className="text-sm font-medium text-white">
                                      {participant.teamMemberName}
                                    </p>
                                  </div>
                                  {participant.teamMemberEmail && (
                                    <div>
                                      <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                                        Email
                                      </p>
                                      <p className="text-sm font-medium text-white font-mono">
                                        {participant.teamMemberEmail}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Button
                              variant="outline"
                              className="rounded-none border-red-500/40 text-[10px] font-mono tracking-widest text-red-400 hover:bg-red-500/10 hover:border-red-500"
                              onClick={() => {
                                if (confirm(`Delete participant "${participant.name}"?`)) {
                                  removeRegistration(participant.id)
                                  setParticipants((prev) =>
                                    prev.filter((p) => p.id !== participant.id),
                                  )
                                  toast.success("Participant deleted.")
                                }
                              }}
                            >
                              DELETE PARTICIPANT
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )
      case "Live Contest":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase">Answers / Submissions</h2>
              <Button
                variant="outline"
                className="rounded-none border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-mono tracking-widest uppercase"
                onClick={() => setSubmissions(getSubmissions())}
                disabled={!mounted}
              >
                REFRESH
              </Button>
            </div>

            <div className="space-y-4">
              {submissions.length === 0 ? (
                <Card className="border-white/5 bg-white/[0.02]">
                  <CardContent className="p-12 text-center">
                    <Terminal className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground font-medium">No submissions yet</p>
                  </CardContent>
                </Card>
              ) : (
                submissions.map((s) => (
                  <Card key={s.id} className="border-white/5 bg-white/[0.02]">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="text-sm font-black text-white italic">{s.userName} <span className="text-muted-foreground font-mono text-xs">({s.userEmail})</span></p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {s.questionId} <span className="text-primary/40">[{s.language}]</span>
                          </p>
                        </div>
                        <Badge
                          variant={s.status === "success" ? "default" : "destructive"}
                          className="rounded-none font-mono text-[9px] tracking-widest"
                        >
                          {s.status.toUpperCase()} {s.marks ?? 0}/{s.maxMarks ?? 0}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">{new Date(s.createdAt).toLocaleString()}</div>
                      <pre className="p-4 bg-black/60 border border-white/10 rounded-lg overflow-x-auto text-xs font-mono text-primary/90 whitespace-pre-wrap">
{s.answer}
                      </pre>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertTriangle className="text-primary mb-6 animate-pulse" size={64} />
            <h2 className="text-3xl font-black italic uppercase mb-4">Under Development</h2>
            <p className="text-muted-foreground max-w-md font-medium">
              This sector of the Command Center is currently being encrypted and optimized for deployment.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-foreground pt-20">
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl p-8 hidden lg:block">
          <div className="space-y-10">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-black text-primary tracking-[0.4em] uppercase">Auth_Level</span>
              <span className="text-xs font-black text-white italic tracking-widest uppercase">SUPER_ADMIN_VRS</span>
            </div>
            
            <nav className="space-y-2">
              {[
                { name: "Dashboard", icon: LayoutDashboard },
                { name: "Questions", icon: FileQuestion },
                { name: "Participants", icon: Users },
                { name: "Live Contest", icon: Activity },
                { name: "Settings", icon: Settings },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex w-full items-center gap-4 rounded-none px-4 py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all relative group ${
                    activeTab === item.name 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {activeTab === item.name && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-full bg-primary shadow-[0_0_10px_#00f2ff]"
                    />
                  )}
                  <item.icon size={18} className={activeTab === item.name ? "text-primary" : "text-muted-foreground group-hover:text-white"} />
                  {item.name}
                </button>
              ))}
              <button
                onClick={signOut}
                className="flex w-full items-center gap-4 rounded-none px-4 py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all text-muted-foreground hover:text-red-500 hover:bg-red-500/5 mt-4 border-t border-white/5 pt-4"
              >
                <LogOut size={18} />
                LOGOUT
              </button>
            </nav>

            <div className="pt-10 border-t border-white/5">
              <div className="bg-primary/5 border border-primary/20 p-6">
                <p className="text-[9px] font-mono font-black text-primary uppercase mb-3">System_Health</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-white font-bold">ALL_NODES_STABLE</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.03)_0%,transparent_50%)]">
          <header className="mb-12">
            <div className="flex items-center gap-3 text-primary font-mono text-[10px] font-black tracking-[0.5em] uppercase mb-4">
              <div className="h-1 w-10 bg-primary" />
              Sector_01 // {activeTab}
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Command Center</h1>
            <p className="text-muted-foreground mt-4 text-lg font-medium">Global infrastructure monitoring and asset management.</p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
