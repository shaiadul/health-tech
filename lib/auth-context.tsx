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
  },
}

interface AuthContextType {
  user: AuthUser | null
  role: UserRole
  isAuthenticated: boolean
  loginAs: (role: UserRole, email?: string, name?: string) => void
  switchRole: (role: UserRole) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "medpulse_auth_session"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<UserRole>("patient")
  const [user, setUser] = React.useState<AuthUser | null>(DEMO_USERS.patient)
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Initialize from localStorage safely
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.role && DEMO_USERS[parsed.role as UserRole]) {
          setRole(parsed.role)
          setUser(parsed.user || DEMO_USERS[parsed.role as UserRole])
        }
      }
    } catch {
      // Fallback to default demo user
    } finally {
      setIsInitialized(true)
    }
  }, [])

  const loginAs = React.useCallback(
    (newRole: UserRole, customEmail?: string, customName?: string) => {
      const base = DEMO_USERS[newRole]
      const updatedUser: AuthUser = {
        ...base,
        email: customEmail || base.email,
        name: customName || base.name,
      }
      setRole(newRole)
      setUser(updatedUser)
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ role: newRole, user: updatedUser })
        )
      } catch {}
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
    setUser(null)
    setRole("patient")
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        loginAs,
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
