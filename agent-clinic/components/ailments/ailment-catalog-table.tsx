"use client"

import Link from "next/link"
import { useRole } from "@/context/role-context"
import { AilmentSeverityBadge } from "./ailment-severity-badge"
import { Button } from "@/components/ui/button"
import type { Ailment } from "@/lib/types"

export function AilmentCatalogTable({ ailments }: { ailments: Ailment[] }) {
  const { isStaff } = useRole()

  if (ailments.length === 0) {
    return <p className="text-sm text-slate-500">No ailments in the catalog yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-slate-500">
            <th className="pb-2 pr-4 font-medium">Name</th>
            <th className="pb-2 pr-4 font-medium">Severity</th>
            <th className="pb-2 pr-4 font-medium">Description</th>
            {isStaff && <th className="pb-2 font-medium" />}
          </tr>
        </thead>
        <tbody>
          {ailments.map((a) => (
            <tr key={a.id} className="border-b last:border-0">
              <td className="py-3 pr-4 font-medium">{a.name}</td>
              <td className="py-3 pr-4">
                <AilmentSeverityBadge severity={a.severity} />
              </td>
              <td className="py-3 pr-4 text-slate-600">{a.description ?? "—"}</td>
              {isStaff && (
                <td className="py-3 text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/ailments/${a.id}/edit`}>Edit</Link>
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
