export type AdminRegistration = {
  id: string
  name: string
  email: string
  college: string
  department: string
  year: string
  phone: string
  isTeam: boolean
  teamMemberName?: string
  teamMemberEmail?: string
  createdAt: string
}

export type ArenaSubmission = {
  id: string
  userEmail: string
  userName: string
  language: string
  questionId: string
  answer: string
  status: "success" | "fail"
  marks: number
  maxMarks: number
  createdAt: string
}

const KEY_REGISTRATIONS = "orchids_registrations_v1"
const KEY_SUBMISSIONS = "orchids_submissions_v1"
const KEY_CURRENT_USER = "orchids_current_user_v1"

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setCurrentUser(user: { name: string; email: string }) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(user))
}

export function getCurrentUser(): { name: string; email: string } | null {
  if (typeof window === "undefined") return null
  const user = safeParseJson<{ name: string; email: string } | null>(
    localStorage.getItem(KEY_CURRENT_USER),
    null
  )
  if (!user?.email) return null
  return user
}

export function addRegistration(reg: AdminRegistration) {
  if (typeof window === "undefined") return
  const regs = getRegistrations()
  // Keep ALL registrations, even if emails repeat
  const next = [reg, ...regs]
  localStorage.setItem(KEY_REGISTRATIONS, JSON.stringify(next))
}

export function getRegistrations(): AdminRegistration[] {
  if (typeof window === "undefined") return []
  return safeParseJson<AdminRegistration[]>(
    localStorage.getItem(KEY_REGISTRATIONS),
    []
  )
}

export function addSubmission(sub: ArenaSubmission) {
  if (typeof window === "undefined") return
  const subs = getSubmissions()
  const next = [sub, ...subs].slice(0, 500)
  localStorage.setItem(KEY_SUBMISSIONS, JSON.stringify(next))
}

export function getSubmissions(): ArenaSubmission[] {
  if (typeof window === "undefined") return []
  return safeParseJson<ArenaSubmission[]>(
    localStorage.getItem(KEY_SUBMISSIONS),
    []
  )
}

export function clearAdminData() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY_REGISTRATIONS)
  localStorage.removeItem(KEY_SUBMISSIONS)
  localStorage.removeItem(KEY_CURRENT_USER)
}

export function removeRegistration(id: string) {
  if (typeof window === "undefined") return
  const regs = getRegistrations()
  const next = regs.filter((r) => r.id !== id)
  localStorage.setItem(KEY_REGISTRATIONS, JSON.stringify(next))
}

