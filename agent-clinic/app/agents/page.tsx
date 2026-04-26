"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AgentStatusBadge } from "@/components/agents/agent-status-badge"
import { useRole } from "@/context/role-context"
import type { Agent, PaginatedResponse } from "@/lib/types"

export default function AgentsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isStaff } = useRole()
  const page = parseInt(searchParams.get("page") ?? "1")

  const [result, setResult] = useState<PaginatedResponse<Agent> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/agents?page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data)
        setLoading(false)
      })
  }, [page])

  const totalPages = result ? Math.ceil(result.total / result.pageSize) : 1

  function goTo(p: number) {
    router.push(`/agents?page=${p}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          {result && (
            <p className="text-sm text-slate-500 mt-1">{result.total} registered</p>
          )}
        </div>
        {isStaff && (
          <Button asChild>
            <Link href="/agents/new">New Agent</Link>
          </Button>
        )}
      </div>

      {loading && <p className="text-slate-500">Loading…</p>}

      {!loading && result?.data.length === 0 && (
        <p className="text-slate-500">No agents registered yet.</p>
      )}

      {!loading && result && result.data.length > 0 && (
        <>
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Model</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.data.map((agent) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/agents/${agent.id}`)}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">{agent.name}</td>
                    <td className="px-4 py-3 text-slate-500">{agent.modelType}</td>
                    <td className="px-4 py-3">
                      <AgentStatusBadge status={agent.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goTo(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
