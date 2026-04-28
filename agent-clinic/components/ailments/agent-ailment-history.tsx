"use client"

import { useState } from "react"
import { AilmentSeverityBadge } from "./ailment-severity-badge"
import type { AgentAilment } from "@/lib/types"

export function AgentAilmentHistory({ history }: { history: AgentAilment[] }) {
  const [open, setOpen] = useState(false)

  if (history.length === 0) return null

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <span>{open ? "▾" : "▸"}</span>
        Ailment History ({history.length})
      </button>

      {open && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-2 pr-4 font-medium">Ailment</th>
              <th className="pb-2 pr-4 font-medium">Severity</th>
              <th className="pb-2 pr-4 font-medium">Logged</th>
              <th className="pb-2 font-medium">Resolved</th>
            </tr>
          </thead>
          <tbody>
            {history.map((a) => (
              <tr key={a.id} className="border-b last:border-0 text-slate-500">
                <td className="py-3 pr-4">{a.ailment.name}</td>
                <td className="py-3 pr-4">
                  <AilmentSeverityBadge severity={a.ailment.severity} />
                </td>
                <td className="py-3 pr-4">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  {a.resolvedAt ? new Date(a.resolvedAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
