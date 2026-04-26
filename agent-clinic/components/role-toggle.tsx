"use client"

import { useRole } from "@/context/role-context"
import { Button } from "@/components/ui/button"

export function RoleToggle() {
  const { role, toggleRole } = useRole()
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500">
        Viewing as <span className="font-medium text-slate-900 capitalize">{role}</span>
      </span>
      <Button variant="outline" size="sm" onClick={toggleRole}>
        Switch to {role === "agent" ? "Staff" : "Agent"}
      </Button>
    </div>
  )
}
