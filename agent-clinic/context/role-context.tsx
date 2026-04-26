"use client"

import { createContext, useContext, useState } from "react"

type Role = "agent" | "staff"

interface RoleContextValue {
  role: Role
  isStaff: boolean
  toggleRole: () => void
}

const RoleContext = createContext<RoleContextValue>({
  role: "agent",
  isStaff: false,
  toggleRole: () => {},
})

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("agent")
  const toggleRole = () => setRole((r) => (r === "agent" ? "staff" : "agent"))
  return (
    <RoleContext.Provider value={{ role, isStaff: role === "staff", toggleRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
