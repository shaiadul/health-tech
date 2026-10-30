"use client"

import * as React from "react"

export type UserRole = "patient" | "doctor" | "organizer"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  roleTitle: string
  avatar: string
  department?: string
  phone?: string
  patientId?: string
  staffId?: string
  bloodType?: string
  allergies?: string[]
  emergencyContact?: string
  clinicRoom?: string
}

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  patient: {
    id: "usr_patient_alex",
    name: "Alex Mercer",
    email: "alex.mercer@gmail.com",
    role: "patient",
    roleTitle: "Registered Patient",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 389-9921",
    patientId: "PT-89241",
    bloodType: "O-Positive",
    allergies: ["Penicillin", "Sulfa drugs"],
    emergencyContact: "Elena Mercer (Spouse) · +1 (555) 389-9922",
  },
  doctor: {
    id: "usr_doctor_sarah",
    name: "Dr. Sarah Ahmed, MD, FACC",
    email: "s.ahmed@medpulse.health",
    role: "doctor",
    roleTitle: "Chief Cardiologist & Attending Physician",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    department: "Cardiology & Heart Health",
    phone: "+1 (800) 432-5847",
    staffId: "MD-1029",
    clinicRoom: "Room 402B · West Cardiac Wing",
  },
  organizer: {
    id: "usr_organizer_vance",
    name: "Dr. Marcus Vance, MD, PhD",
    email: "admin@medpulse.health",
    role: "organizer",
    roleTitle: "Hospital Operations Director & Clinic Administrator",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    department: "Clinical Facility Operations",
    phone: "+1 (800) 432-9000",
    staffId: "ORG-001",
    clinicRoom: "Executive Medical Suite 100",
  },
}

interface AuthContextType {
  user: AuthUser | null
  role: UserRole
  isAuthenticated: boolean
  login: (email: string, password?: string, preferredRole?: UserRole) => Promise<{ success: boolean; message?: string }>
  loginAs: (role: UserRole, customEmail?: string, customName?: string) => void
  signup: (details: {
    name: string
    email: string
    role: UserRole
    phone?: string
    department?: string
  }) => Promise<{ success: boolean }>
  switchRole: (role: UserRole) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "medpulse_auth_session"

interface StoredAuthSession {
  isAuthenticated: boolean
  role: UserRole
  user: AuthUser | null
}

function getInitialAuth(): StoredAuthSession {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, role: "patient", user: null }
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed: StoredAuthSession = JSON.parse(stored)
      if (parsed?.isAuthenticated && parsed?.user) {
        return {
          isAuthenticated: true,
          role: parsed.role || parsed.user.role || "patient",
          user: parsed.user,
        }
      }
    }
  } catch {}
  return { isAuthenticated: false, role: "patient", user: null }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = React.useState<StoredAuthSession>(getInitialAuth)
  const role = authData.role
  const user = authData.user
  const isAuthenticated = authData.isAuthenticated && !!authData.user

  const persistAuth = (session: StoredAuthSession) => {
    setAuthData(session)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {}
  }

  const loginAs = React.useCallback(
    (newRole: UserRole, customEmail?: string, customName?: string) => {
      const base = DEMO_USERS[newRole]
      const updatedUser: AuthUser = {
        ...base,
        email: customEmail || base.email,
        name: customName || base.name,
      }
      persistAuth({
        isAuthenticated: true,
        role: newRole,
        user: updatedUser,
      })
    },
    []
  )

  const login = React.useCallback(
    async (
      email: string,
      _password?: string,
      preferredRole?: UserRole
    ): Promise<{ success: boolean; message?: string }> => {
      await new Promise((r) => setTimeout(r, 400))

      const normalized = email.toLowerCase().trim()
      let detectedRole: UserRole = preferredRole || "patient"

      if (normalized.includes("doctor") || normalized.includes("ahmed") || normalized.includes("physician")) {
        detectedRole = "doctor"
      } else if (normalized.includes("admin") || normalized.includes("organizer") || normalized.includes("vance")) {
        detectedRole = "organizer"
      } else if (normalized.includes("patient") || normalized.includes("mercer")) {
        detectedRole = "patient"
      }

      const base = DEMO_USERS[detectedRole]
      const authenticatedUser: AuthUser = {
        ...base,
        email: email || base.email,
      }

      persistAuth({
        isAuthenticated: true,
        role: detectedRole,
        user: authenticatedUser,
      })

      return { success: true, message: `Signed in successfully as ${authenticatedUser.name}` }
    },
    []
  )

  const signup = React.useCallback(
    async (details: {
      name: string
      email: string
      role: UserRole
      phone?: string
      department?: string
    }): Promise<{ success: boolean }> => {
      await new Promise((r) => setTimeout(r, 450))

      const base = DEMO_USERS[details.role]
      const newUser: AuthUser = {
        ...base,
        id: `usr_${Date.now()}`,
        name: details.name,
        email: details.email,
        role: details.role,
        phone: details.phone || base.phone,
        department: details.department || base.department,
        patientId: details.role === "patient" ? `PT-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
        staffId: details.role !== "patient" ? `MD-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      }

      persistAuth({
        isAuthenticated: true,
        role: details.role,
        user: newUser,
      })

      return { success: true }
    },
    []
  )

  const switchRole = React.useCallback(
    (newRole: UserRole) => {
      loginAs(newRole)
    },
    [loginAs]
  )

  const logout = React.useCallback(() => {
    persistAuth({
      isAuthenticated: false,
      role: "patient",
      user: null,
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        loginAs,
        signup,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
