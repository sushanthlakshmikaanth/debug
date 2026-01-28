"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  Timer, 
  Send, 
  AlertCircle, 
  ChevronRight, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Globe, 
  Code2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Search,
  Activity,
  Cpu,
  Shield,
  Zap,
  Lock,
  Binary,
  MessageSquare
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { addSubmission, getCurrentUser } from "@/lib/adminStore"

type Question = {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard" | "Tough"
  code: string
  instruction: string
  bugLine: number
  hint: string
  accepted: string[]
}

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")

// Very lenient auto-check:
// - If there are accepted patterns, answer is correct if it contains ANY of them
// - If no patterns, any non-empty answer is accepted
const isAnswerRoughlyCorrect = (answer: string, accepted: string[]) => {
  const norm = normalize(answer)
  if (!norm) return false
  if (!accepted || accepted.length === 0) return norm.length > 0
  return accepted.some((a) => norm.includes(normalize(a)))
}

const marksFor = (difficulty: Question["difficulty"]) => {
  switch (difficulty) {
    case "Easy":
      return 10
    case "Medium":
      return 20
    case "Hard":
      return 30
    case "Tough":
      return 50
  }
}

const QUESTIONS: Record<string, Question[]> = {
  python: [
    {
      id: "PY01",
      title: "List Summation",
      difficulty: "Easy",
      code: `def sum_list(items):\n    total = 0\n    for i in range(len(items) + 1):\n        total += items[i]\n    return total`,
      instruction: "The function crashes when calculating the sum. Fix the range logic.",
      bugLine: 3,
      hint: "Check the range upper bound.",
      accepted: ["range(len(items))", "for i in range(len(items)):"]
    },
    {
      id: "PY02",
      title: "Dictionary Access",
      difficulty: "Easy",
      code: `def get_user_age(data, name):\n    return data.name`,
      instruction: "The function fails to retrieve the value from the dictionary using the variable.",
      bugLine: 2,
      hint: "Use bracket notation for dynamic keys.",
      accepted: ["data[name]", "return data[name]"]
    },
    {
      id: "PY03",
      title: "Factorial Recursion",
      difficulty: "Medium",
      code: `def factorial(n):\n    if n == 0: return 1\n    return n * factorial(n)`,
      instruction: "The function causes a RecursionError. Fix the recursive call.",
      bugLine: 3,
      hint: "The input to the next call should be smaller.",
      accepted: ["factorial(n-1)", "factorial(n - 1)"]
    },
    {
      id: "PY04",
      title: "String Formatting",
      difficulty: "Medium",
      code: `def greet(name):\n    return "Hello {name}"`,
      instruction: "The string is not interpolating the variable correctly.",
      bugLine: 2,
      hint: "Python 3 f-strings start with a specific letter.",
      accepted: ['f"hello {name}"', "f'hello {name}'", 'f"hello {name}"'.toLowerCase()]
    },
    {
      id: "PY05",
      title: "Class Method",
      difficulty: "Hard",
      code: `class Counter:\n    def __init__(self):\n        self.count = 0\n    def increment():\n        self.count += 1`,
      instruction: "The increment method fails when called on an instance.",
      bugLine: 4,
      hint: "All instance methods need a specific first argument.",
      accepted: ["def increment(self):", "increment(self)"]
    },
    {
      id: "PY06",
      title: "Mutable Default Trap",
      difficulty: "Tough",
      code: `def add_item(item, items=[]):\n    items.append(item)\n    return items`,
      instruction: "Fix the shared default list bug (should not persist between calls).",
      bugLine: 1,
      hint: "Use None default + initialize inside.",
      accepted: ["items=None", "if items is none:", "items = []"]
    }
  ],
  javascript: [
    {
      id: "JS01",
      title: "Array Iteration",
      difficulty: "Easy",
      code: `function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i <= items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`,
      instruction: "Fix the off-by-one error in the loop condition.",
      bugLine: 3,
      hint: "Arrays are 0-indexed.",
      accepted: ["i < items.length", "i < items.length;"]
    },
    {
      id: "JS02",
      title: "Scope Issue",
      difficulty: "Easy",
      code: `function createTimers() {\n  for (var i = 0; i < 3; i++) {\n    setTimeout(() => console.log(i), 100);\n  }\n}`,
      instruction: "The function prints '3, 3, 3' instead of '0, 1, 2'. Fix the variable declaration.",
      bugLine: 2,
      hint: "Var has function scope, try block scope.",
      accepted: ["for (let i = 0", "let i = 0"]
    },
    {
      id: "JS03",
      title: "Async Await",
      difficulty: "Medium",
      code: `async function fetchData() {\n  const res = fetch('/api/data');\n  return res.json();\n}`,
      instruction: "The function returns a promise instead of the JSON data.",
      bugLine: 2,
      hint: "Don't forget to wait for the network request.",
      accepted: ["await fetch", "const res = await fetch"]
    },
    {
      id: "JS04",
      title: "Deep Equality",
      difficulty: "Medium",
      code: `const compare = (a, b) => a == b;\n// fails for compare([], [])`,
      instruction: "Strict equality check required for primitives.",
      bugLine: 1,
      hint: "Use the triple equals operator.",
      accepted: ["a === b"]
    },
    {
      id: "JS05",
      title: "Object Context",
      difficulty: "Hard",
      code: `const obj = {\n  val: 10,\n  getVal: () => this.val\n};`,
      instruction: "The arrow function is using the wrong 'this' context.",
      bugLine: 3,
      hint: "Arrow functions don't have their own 'this'.",
      accepted: ["getval() {", "getval: function", "function ()"]
    },
    {
      id: "JS06",
      title: "Promise Chain Return",
      difficulty: "Tough",
      code: `function getJson(url) {\n  fetch(url)\n    .then(res => res.json())\n    .then(data => data)\n}`,
      instruction: "The function should return the promise so callers can await it.",
      bugLine: 1,
      hint: "Return the fetch chain.",
      accepted: ["return fetch", "return fetch(url)"]
    }
  ],
  java: [
    {
      id: "JV01",
      title: "String Comparison",
      difficulty: "Easy",
      code: `public boolean check(String s) {\n  return s == "admin";\n}`,
      instruction: "The comparison fails even when the string is 'admin'.",
      bugLine: 2,
      hint: "Strings are objects in Java."
    },
    {
      id: "JV02",
      title: "Null Pointer",
      difficulty: "Easy",
      code: `String name = null;\nint len = name.length();`,
      instruction: "Identify why the program crashes.",
      bugLine: 2,
      hint: "You cannot call methods on null."
    },
    {
      id: "JV03",
      title: "Array Bounds",
      difficulty: "Medium",
      code: `int[] arr = {1, 2, 3};\nfor(int i=0; i<4; i++) {\n  System.out.println(arr[i]);\n}`,
      instruction: "The loop goes past the end of the array.",
      bugLine: 2,
      hint: "Array length is 3."
    },
    {
      id: "JV04",
      title: "Constructor Logic",
      difficulty: "Medium",
      code: `class User {\n  String id;\n  User(String id) {\n    id = id;\n  }\n}`,
      instruction: "The instance variable is not being assigned.",
      bugLine: 4,
      hint: "Use 'this' to refer to instance variables."
    },
    {
      id: "JV05",
      title: "Static Access",
      difficulty: "Hard",
      code: `class Main {\n  int x = 5;\n  public static void main(String[] args) {\n    System.out.println(x);\n  }\n}`,
      instruction: "Static methods cannot access instance variables directly.",
      bugLine: 4,
      hint: "Make x static or create an instance."
    }
  ],
  cpp: [
    {
      id: "CP01",
      title: "Semicolon Missing",
      difficulty: "Easy",
      code: `int x = 10\ncout << x << endl;`,
      instruction: "The code fails to compile.",
      bugLine: 1,
      hint: "Every statement needs a terminator."
    },
    {
      id: "CP02",
      title: "Pointer Dereference",
      difficulty: "Easy",
      code: `int x = 5;\nint* p = x;\ncout << *p;`,
      instruction: "The pointer assignment is incorrect.",
      bugLine: 2,
      hint: "Pointers store memory addresses."
    },
    {
      id: "CP03",
      title: "Infinite Loop",
      difficulty: "Medium",
      code: `for(int i=10; i>0; i++) {\n  // do something\n}`,
      instruction: "The loop condition or increment is wrong.",
      bugLine: 1,
      hint: "i will always be greater than 0 if you increment."
    },
    {
      id: "CP04",
      title: "Vector Access",
      difficulty: "Medium",
      code: `vector<int> v = {1};\ncout << v[2];`,
      instruction: "Accessing an out-of-bounds index.",
      bugLine: 2,
      hint: "Check the size of the vector."
    },
    {
      id: "CP05",
      title: "Memory Leak",
      difficulty: "Hard",
      code: `void func() {\n  int* p = new int[10];\n  // return without cleanup\n}`,
      instruction: "Identify the missing cleanup step.",
      bugLine: 2,
      hint: "Everything 'new' must be 'deleted'."
    }
  ],
  go: [
    {
      id: "GO01",
      title: "Short Declaration",
      difficulty: "Easy",
      code: `var x int = 10\nx := 20`,
      instruction: "Cannot use short declaration for existing variable.",
      bugLine: 2,
      hint: "Use simple assignment (=)."
    },
    {
      id: "GO02",
      title: "Nil Map",
      difficulty: "Easy",
      code: `var m map[string]int\nm["key"] = 1`,
      instruction: "Assignment to entry in nil map.",
      bugLine: 2,
      hint: "Initialize the map with make()."
    },
    {
      id: "GO03",
      title: "Unused Variable",
      difficulty: "Medium",
      code: `func main() {\n  x := 10\n  fmt.Println("Hello")\n}`,
      instruction: "Go compiler fails if a variable is declared but not used.",
      bugLine: 2,
      hint: "Use the variable or remove it."
    },
    {
      id: "GO04",
      title: "Slice Header",
      difficulty: "Medium",
      code: `s := []int{1, 2}\ns[2] = 3`,
      instruction: "Index out of range.",
      bugLine: 2,
      hint: "Use append() to grow slices."
    },
    {
      id: "GO05",
      title: "Goroutine Sync",
      difficulty: "Hard",
      code: `func main() {\n  go fmt.Println("Wait")\n}`,
      instruction: "The program exits before the goroutine finishes.",
      bugLine: 2,
      hint: "Use WaitGroups or channels to sync."
    }
  ]
}

export default function ArenaPage() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("javascript")
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answer, setAnswer] = React.useState("")
  const [timeLeft, setTimeLeft] = React.useState(3600)
  const [solvedQuestions, setSolvedQuestions] = React.useState<Record<string, string[]>>({
    python: [],
    javascript: [],
    java: [],
    cpp: [],
    go: []
  })
    const [patchResult, setPatchResult] = React.useState<"idle" | "success" | "error">("idle")
    const [isFinished, setIsFinished] = React.useState(false)
    const [showSuccessModal, setShowSuccessModal] = React.useState(false)
    const [systemLogs, setSystemLogs] = React.useState<string[]>([

    "System Initialized...",
    "Neural Uplink Stable.",
    "Awaiting Vulnerability Selection..."
  ])
  const logContainerRef = React.useRef<HTMLDivElement>(null)

  const questions = QUESTIONS[selectedLanguage]
  const currentQuestion = questions[currentQuestionIndex]
  const isSolved = solvedQuestions[selectedLanguage]?.includes(currentQuestion.id)
  const TOTAL_QUESTIONS = Object.values(QUESTIONS).reduce((acc, arr) => acc + arr.length, 0)
  const MIN_QUESTIONS_FOR_COMPLETION_POP = 7

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [systemLogs])

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setSystemLogs(prev => [...prev.slice(-15), `[${timestamp}] ${msg}`])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleLanguageChange = (val: string) => {
    setSelectedLanguage(val)
    setCurrentQuestionIndex(0)
    setAnswer("")
    setPatchResult("idle")
    addLog(`Switched Language Core to ${val.toUpperCase()}`)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setAnswer("")
      setPatchResult("idle")
      addLog(`Loading Vulnerability ${questions[currentQuestionIndex + 1].id}...`)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setAnswer("")
      setPatchResult("idle")
      addLog(`Reverting to Vulnerability ${questions[currentQuestionIndex - 1].id}...`)
    }
  }

  const handleExecutePatch = () => {
    if (!answer.trim()) return

    addLog(`Initiating Patch Deployment: ${currentQuestion.id}`)
    
    const maxMarks = marksFor(currentQuestion.difficulty)
    const accepted = currentQuestion.accepted ?? []
    // For JS questions, be extra lenient: any non-empty JS-looking line is accepted.
    // This matches your request to accept even a single line of JS code.
    const isCorrect =
      selectedLanguage === "javascript"
        ? answer.trim().length > 0
        : isAnswerRoughlyCorrect(answer, accepted)
    
      if (isCorrect) {
        setPatchResult("success")
        addLog(`SUCCESS: Functional Integrity Restored for ${currentQuestion.id}`)

        // Store answer locally for admin panel (no Supabase required)
        const currentUser = getCurrentUser()
        addSubmission({
          id: crypto.randomUUID(),
          userEmail: currentUser?.email || "unknown",
          userName: currentUser?.name || "unknown",
          language: selectedLanguage,
          questionId: currentQuestion.id,
          answer,
          status: "success",
          marks: maxMarks,
          maxMarks,
          createdAt: new Date().toISOString(),
        })
        
        const newSolvedQuestions = {
          ...solvedQuestions,
          [selectedLanguage]: [...(solvedQuestions[selectedLanguage] || []).filter(id => id !== currentQuestion.id), currentQuestion.id]
        }
        setSolvedQuestions(newSolvedQuestions)
        
        const newTotalSolved = Object.values(newSolvedQuestions).flat().length
        
        setTimeout(() => {
          setPatchResult("idle")
          if (newTotalSolved >= MIN_QUESTIONS_FOR_COMPLETION_POP) {
            addLog("TEST COMPLETED. FINALIZING...")
            setShowSuccessModal(true)
            setTimeout(() => setIsFinished(true), 2000)
          } else if (currentQuestionIndex < questions.length - 1) {
            nextQuestion()
          } else {
            addLog("Category Sector Cleared. Please switch sectors to continue.")
          }
        }, 1500)
      } else {

      setPatchResult("error")
      addLog(`CRITICAL ERROR: Patch Rejected by System Core.`)

      // Store failed attempt locally for admin panel (no Supabase required)
      const currentUser = getCurrentUser()
      addSubmission({
        id: crypto.randomUUID(),
        userEmail: currentUser?.email || "unknown",
        userName: currentUser?.name || "unknown",
        language: selectedLanguage,
        questionId: currentQuestion.id,
        answer,
        status: "fail",
        marks: 0,
        maxMarks,
        createdAt: new Date().toISOString(),
      })

      setTimeout(() => setPatchResult("idle"), 2000)
    }
  }

  const getCategoryProgress = (lang: string) => {
    const solved = solvedQuestions[lang]?.length || 0
    const total = QUESTIONS[lang].length
    return (solved / total) * 100
  }

    const totalSolved = Object.values(solvedQuestions).flat().length
    const canFinalize = totalSolved >= TOTAL_QUESTIONS

    if (isFinished) {
    return (
      <div className="relative w-full min-h-screen bg-[#020202] text-foreground font-sans selection:bg-primary/30 selection:text-primary overflow-x-hidden">
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

        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto relative"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-mono font-bold text-primary tracking-[0.4em] uppercase mb-12 animate-pulse">
              <CheckCircle2 size={12} />
              Mission_Accomplished // Session_Terminated
            </div>
            
            <h1 className="text-[clamp(3.5rem,12vw,8rem)] font-black tracking-tighter leading-[0.8] mb-10 uppercase italic">
              THANKS FOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">ATTENDING</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-16 font-medium tracking-tight leading-relaxed">
              Your performance metrics have been securely transmitted to the mainframe. 
              <br />
              <span className="text-primary font-black uppercase tracking-widest mt-4 block">
                Results will be released soon.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
              <Button size="lg" className="h-16 px-14 text-lg font-black rounded-none bg-primary text-black hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(0,242,255,0.5)] relative group overflow-hidden" asChild>
                <a href="/">
                  <span className="relative z-10 flex items-center gap-3">
                    RETURN_TO_BASE <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Scrolling Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 opacity-[0.02] overflow-hidden select-none">
            <span className="text-[25vw] font-black italic whitespace-nowrap uppercase">TERMINATED</span>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex h-[calc(100vh-64px)] flex-col bg-[#020202] text-foreground font-mono selection:bg-primary/30 overflow-hidden">
      {/* Background Infrastructure */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <motion.div 
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[40vh]"
        />
      </div>

      {/* Top Bar Navigation */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[220px] h-11 border-primary/30 bg-primary/5 font-black uppercase tracking-widest transition-all hover:bg-primary/10">
                <SelectValue placeholder="CORE_SECTOR" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-primary/20 backdrop-blur-xl">
                {Object.keys(QUESTIONS).map(lang => (
                  <SelectItem key={lang} value={lang} className="focus:bg-primary/20 cursor-pointer py-3">
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-primary text-xs">
                          {lang === 'python' ? '🐍' : lang === 'javascript' ? 'JS' : lang === 'java' ? '☕' : lang === 'cpp' ? 'C+' : 'GO'}
                        </span>
                        <span className="font-black uppercase tracking-tighter text-sm">{lang}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{solvedQuestions[lang]?.length || 0}</span>
                        <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${getCategoryProgress(lang)}%` }} />
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="absolute -bottom-1 left-0 h-[2px] bg-primary shadow-[0_0_10px_#00f2ff] transition-all" style={{ width: `${getCategoryProgress(selectedLanguage)}%` }} />
          </div>

          <div className="hidden lg:flex items-center gap-4 px-5 py-2 rounded-lg border border-white/5 bg-white/5 backdrop-blur-sm">
            <Activity size={14} className="text-primary animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active_Protocol</span>
              <span className="text-xs font-black text-white italic">{currentQuestion.title}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
              currentQuestion.difficulty === 'Easy' ? 'bg-terminal-green/10 text-terminal-green' : 
              currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-destructive/10 text-destructive'
            }`}>
              {currentQuestion.difficulty}_THREAT
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/70">
                    <Globe size={10} /> Network_Sync: {Math.round((totalSolved / TOTAL_QUESTIONS) * 100)}%
                  </div>
                </div>
              <div className="h-1.5 w-64 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  className="h-full bg-primary shadow-[0_0_15px_rgba(0,242,255,0.6)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalSolved / TOTAL_QUESTIONS) * 100, 100)}%` }}
                />
              </div>
            </div>

          <div className="flex items-center gap-4 border-x border-white/10 px-8">
            <Timer size={18} className="text-destructive" />
            <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
              <ChevronLeft size={20} />
            </Button>
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sector</span>
              <span className="text-sm font-black text-white">{currentQuestionIndex + 1} / {questions.length}</span>
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all" onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
              <ChevronRightIcon size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Code Editor Area */}
        <div className="relative flex flex-1 flex-col overflow-hidden border-r border-white/10">
          <div className="flex items-center justify-between bg-black/60 px-6 py-3 border-b border-white/5">
            <div className="flex items-center gap-3 text-[11px] font-black text-primary/80 tracking-[0.3em] uppercase">
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/50" />
                <div className="h-1.5 w-1.5 rounded-full bg-green-500/50" />
              </div>
              VULNERABILITY_ASSESSMENT_SYSTEM
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/50 tracking-widest uppercase">
              <Binary size={12} />
              Hex_Buffer: {currentQuestion.id}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-12 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                className="flex gap-10"
              >
                <div className="flex flex-col text-right text-white/5 select-none border-r border-white/5 pr-8 font-mono text-sm leading-[1.8]">
                  {currentQuestion.code.split('\n').map((_, i) => (
                    <span key={i} className={i + 1 === currentQuestion.bugLine ? "text-destructive/40 font-black" : ""}>
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                  ))}
                </div>
                <div className="flex-1 font-mono text-base leading-[1.8] tracking-tight">
                  {currentQuestion.code.split('\n').map((line, i) => (
                    <div
                      key={i}
                      className={`group relative px-4 transition-all duration-300 ${
                        i + 1 === currentQuestion.bugLine 
                          ? "bg-destructive/5 -mx-4 border-l-2 border-destructive shadow-[inset_10px_0_20px_-10px_rgba(239,68,68,0.2)]" 
                          : "hover:bg-white/[0.02] -mx-4 cursor-text"
                      }`}
                    >
                      <span className={i + 1 === currentQuestion.bugLine ? "text-destructive font-bold" : "text-white/80"}>
                        {line || " "}
                      </span>
                      {i + 1 === currentQuestion.bugLine && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute -left-12 top-1/2 -translate-y-1/2"
                        >
                          <AlertCircle size={16} className="text-destructive animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Holographic Overlays */}
            <div className="absolute top-10 right-10 flex flex-col gap-4 opacity-5 pointer-events-none">
              <Cpu size={120} />
              <Shield size={120} />
            </div>
          </div>

          {/* System Status Bar */}
          <div className="h-10 bg-black/80 border-t border-white/5 flex items-center justify-between px-6 text-[10px] font-black tracking-widest text-muted-foreground/60">
            <div className="flex gap-6">
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                Neural_Link: ACTIVE
              </span>
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_5px_#00f2ff]" />
                Encryption: LAYER_7
              </span>
            </div>
            <span>LOC: {currentQuestion.bugLine}:00 // UTF-8</span>
          </div>
        </div>

        {/* Interaction Panel */}
        <div className="flex w-[450px] flex-col bg-black/40 backdrop-blur-3xl border-l border-white/10 relative overflow-hidden">
          {/* Subtle Scanning Light */}
          <motion.div 
            animate={{ y: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-[1px] bg-primary/10 blur-[1px] z-[-1] pointer-events-none"
          />

          <div className="flex flex-1 flex-col p-10 overflow-auto custom-scrollbar relative z-10">
            {/* Mission Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.5em] text-primary/60 mb-6">
                <div className="h-[1px] w-8 bg-primary/30" />
                Mission_Directive
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all" />
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
                  <p className="text-base text-white/90 leading-relaxed font-bold italic">
                    "{currentQuestion.instruction}"
                  </p>
                </div>
              </div>
            </div>

            {/* Hint Decryption */}
            <div className="mb-12">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground/50 mb-4">
                <Search size={14} />
                Hint_Decryption
              </div>
              <div className="pl-6 border-l border-white/5 py-2">
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {currentQuestion.hint}
                </p>
              </div>
            </div>

            {/* Submission Logic */}
            <div className="mt-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Patch_Payload</label>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-muted-foreground font-black uppercase">Integrity:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 w-3 rounded-full ${answer.length > 5 ? 'bg-primary' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    <textarea 
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="relative h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/60 p-6 font-mono text-sm shadow-2xl focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20 text-primary z-30"
                      placeholder="// ENTER PATCH SEQUENCE HERE..."
                    />
                  <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
                    <TerminalIcon size={16} />
                  </div>
                </div>
              </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    className={`w-full h-16 group text-lg font-black uppercase tracking-[0.3em] transition-all rounded-2xl relative overflow-hidden ${
                      patchResult === 'success' ? 'bg-terminal-green text-black hover:bg-terminal-green/90 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 
                      patchResult === 'error' ? 'bg-destructive text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 
                      'bg-primary text-black hover:bg-primary/90 shadow-[0_0_30px_rgba(0,242,255,0.3)]'
                    }`}
                    disabled={!answer || patchResult !== 'idle' || totalSolved >= TOTAL_QUESTIONS}
                    onClick={handleExecutePatch}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {patchResult === 'success' ? (
                        <>PATCH_DEPLOYED <CheckCircle2 size={24} /></>
                      ) : patchResult === 'error' ? (
                        <>SYSTEM_REJECTION <AlertCircle size={24} /></>
                      ) : totalSolved >= TOTAL_QUESTIONS ? (
                        <>LIMIT_REACHED <Lock size={20} /></>
                      ) : (
                        <>EXECUTE_PATCH <Zap size={20} className="fill-current" /></>
                      )}
                    </span>
                    <motion.div 
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-white/20 skew-x-12"
                    />
                  </Button>

                    {canFinalize ? (
                      <Button 
                        onClick={() => setIsFinished(true)}
                        className="h-16 bg-white/5 border border-white/10 hover:bg-primary hover:text-black hover:border-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(0,242,255,0.4)]"
                      >
                        FINALIZE_SESSION.exe
                      </Button>
                    ) : (
                      <div className="h-16 flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/5 bg-black/40 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] cursor-not-allowed opacity-50 px-4 text-center">
                        <div className="flex items-center gap-2">
                          <Lock size={12} /> SESSION_LOCKED
                        </div>
                        <span>REMAINING: {Math.max(0, TOTAL_QUESTIONS - totalSolved)} PKTS // MISSION_IN_PROGRESS</span>
                      </div>
                    )}
                </div>
            </div>
          </div>

          {/* System Console Footer */}
          <div className="border-t border-white/10 bg-black/80 backdrop-blur-xl p-8 h-[250px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                <MessageSquare size={14} />
                System_Log
              </div>
              <div className="flex gap-1">
                <div className="h-1 w-4 bg-primary/40 rounded-full" />
                <div className="h-1 w-2 bg-primary/20 rounded-full" />
              </div>
            </div>
            <div 
              ref={logContainerRef}
              className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar pr-4"
            >
              {systemLogs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex gap-3 ${log.includes('SUCCESS') ? 'text-terminal-green' : log.includes('ERROR') ? 'text-destructive' : 'text-muted-foreground/80'}`}
                >
                  <span className="shrink-0 opacity-40">{i.toString().padStart(2, '0')}</span>
                  <span className="leading-relaxed">{log}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-black/95 border-primary/20 backdrop-blur-2xl text-white max-w-md p-0 overflow-hidden border-2 shadow-[0_0_50px_rgba(0,242,255,0.2)]">
          <div className="relative p-10 flex flex-col items-center text-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-50" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="h-20 w-20 flex items-center justify-center border-2 border-primary bg-primary/10 rounded-full">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
            </motion.div>

            <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Mission Success</h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-8">
              Test completed. Your performance has been recorded in the global mainframe.
              <br />
              <span className="text-primary font-black block mt-4 uppercase tracking-widest">
                Results will be released soon.
              </span>
            </p>

            <Button 
              className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 shadow-[0_0_20px_rgba(0,242,255,0.4)]"
              onClick={() => {
                setShowSuccessModal(false)
                setIsFinished(true)
              }}
            >
              RETURN_TO_BASE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 242, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
