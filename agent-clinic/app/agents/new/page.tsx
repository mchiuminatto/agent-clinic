import { AgentForm } from "@/components/agents/agent-form"

export default function NewAgentPage() {
  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">New Agent</h1>
        <p className="text-sm text-slate-500 mt-1">Register a new agent with the clinic.</p>
      </div>
      <AgentForm />
    </div>
  )
}
