"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AilmentSeverityBadge } from "./ailment-severity-badge"
import type { AgentAilment, Ailment } from "@/lib/types"

interface AgentAilmentListProps {
  agentId: number
  activeAilments: AgentAilment[]
  catalog: Ailment[]
  isStaff: boolean
}

export function AgentAilmentList({ agentId, activeAilments, catalog, isStaff }: AgentAilmentListProps) {
  const router = useRouter()
  const [selectedAilmentId, setSelectedAilmentId] = useState("")
  const [logging, setLogging] = useState(false)
  const [logError, setLogError] = useState<string | null>(null)
  const [resolving, setResolving] = useState<number | null>(null)

  const activeIds = new Set(activeAilments.map((a) => a.ailmentId))
  const available = catalog.filter((a) => !activeIds.has(a.id))

  async function handleLog() {
    if (!selectedAilmentId) return
    setLogging(true)
    setLogError(null)

    const res = await fetch(`/api/agents/${agentId}/ailments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ailmentId: parseInt(selectedAilmentId) }),
    })

    setLogging(false)

    if (!res.ok) {
      const data = await res.json()
      setLogError(data.error ?? "Something went wrong")
      return
    }

    setSelectedAilmentId("")
    router.refresh()
  }

  async function handleResolve(associationId: number) {
    setResolving(associationId)

    const res = await fetch(`/api/agents/${agentId}/ailments/${associationId}`, {
      method: "PATCH",
    })

    setResolving(null)

    if (!res.ok) return
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-800">Active Conditions</h3>

      {isStaff && (
        <div className="flex items-center gap-2">
          <Select value={selectedAilmentId} onValueChange={setSelectedAilmentId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select ailment…" />
            </SelectTrigger>
            <SelectContent>
              {available.length === 0 ? (
                <SelectItem value="__none__" disabled>
                  All catalog ailments are active
                </SelectItem>
              ) : (
                available.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            onClick={handleLog}
            disabled={!selectedAilmentId || logging}
            size="sm"
          >
            {logging ? "Logging…" : "Log"}
          </Button>
          {logError && <p className="text-sm text-red-600">{logError}</p>}
        </div>
      )}

      {activeAilments.length === 0 ? (
        <p className="text-sm text-slate-500">No active conditions.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-2 pr-4 font-medium">Ailment</th>
              <th className="pb-2 pr-4 font-medium">Severity</th>
              <th className="pb-2 pr-4 font-medium">Logged</th>
              {isStaff && <th className="pb-2 font-medium" />}
            </tr>
          </thead>
          <tbody>
            {activeAilments.map((a) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium">{a.ailment.name}</td>
                <td className="py-3 pr-4">
                  <AilmentSeverityBadge severity={a.ailment.severity} />
                </td>
                <td className="py-3 pr-4 text-slate-600">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                {isStaff && (
                  <td className="py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolve(a.id)}
                      disabled={resolving === a.id}
                    >
                      {resolving === a.id ? "Resolving…" : "Resolve"}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
