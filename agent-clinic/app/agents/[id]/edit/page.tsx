"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AgentForm } from "@/components/agents/agent-form"
import type { Agent } from "@/lib/types"

export default function EditAgentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/agents/${id}`)
      .then((r) => {
        if (!r.ok) router.push("/agents")
        return r.json()
      })
      .then((data) => {
        setAgent(data)
        setLoading(false)
      })
  }, [id, router])

  if (loading) return <p className="text-slate-500">Loading…</p>
  if (!agent) return null

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/agents/${id}`}>← Back</Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Edit Agent</h1>
        <p className="text-sm text-slate-500 mt-1">Update {agent.name}&apos;s details.</p>
      </div>
      <AgentForm
        initialValues={{ name: agent.name, status: agent.status }}
        agentId={parseInt(id)}
      />
    </div>
  )
}
