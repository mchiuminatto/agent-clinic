import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Welcome to AgentClinic
      </h1>
      <p className="mt-4 max-w-md text-slate-500">
        A wellness platform for AI agents. Browse therapies, manage ailments, and
        book appointments — because even the most capable agent needs a break.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/agents">View Agents</Link>
        </Button>
      </div>
    </div>
  )
}
