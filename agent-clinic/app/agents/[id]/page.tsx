"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentStatusBadge } from "@/components/agents/agent-status-badge"
import { AgentAilmentList } from "@/components/ailments/agent-ailment-list"
import { AgentAilmentHistory } from "@/components/ailments/agent-ailment-history"
import { useRole } from "@/context/role-context"
import type { Agent, AgentAilment, Ailment } from "@/lib/types"

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isStaff } = useRole()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [ailments, setAilments] = useState<AgentAilment[]>([])
  const [catalog, setCatalog] = useState<Ailment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/agents/${id}`).then((r) => {
        if (!r.ok) router.push("/agents")
        return r.json()
      }),
      fetch(`/api/agents/${id}/ailments`).then((r) => r.json()),
      fetch("/api/ailments").then((r) => r.json()),
    ]).then(([agentData, ailmentsData, catalogData]) => {
      setAgent(agentData)
      setAilments(ailmentsData)
      setCatalog(catalogData)
      setLoading(false)
    })
  }, [id, router])

  async function handleDelete() {
    if (!window.confirm(`Delete agent "${agent?.name}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/agents/${id}`, { method: "DELETE" })
    router.push("/agents")
    router.refresh()
  }

  if (loading) return <p className="text-slate-500">Loading…</p>
  if (!agent) return null

  const activeAilments = ailments.filter((a) => a.status === "Active")
  const resolvedAilments = ailments.filter((a) => a.status === "Resolved")

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/agents">← Agents</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{agent.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Model</p>
              <p className="font-medium">{agent.modelType}</p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <div className="mt-1">
                <AgentStatusBadge status={agent.status} />
              </div>
            </div>
            <div>
              <p className="text-slate-500">Registered</p>
              <p className="font-medium">
                {new Date(agent.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <AgentAilmentList
            agentId={parseInt(id)}
            activeAilments={activeAilments}
            catalog={catalog}
            isStaff={isStaff}
          />
          <AgentAilmentHistory history={resolvedAilments} />
        </CardContent>
      </Card>

      {isStaff && (
        <div className="flex gap-3">
          <Button asChild>
            <Link href={`/agents/${id}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      )}
    </div>
  )
}
