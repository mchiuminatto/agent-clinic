import { Badge } from "@/components/ui/badge"
import { AgentStatus, AGENT_STATUS_LABELS } from "@/lib/types"
import type { BadgeProps } from "@/components/ui/badge"

const STATUS_VARIANTS: Record<string, BadgeProps["variant"]> = {
  [AgentStatus.Active]: "success",
  [AgentStatus.InTreatment]: "warning",
  [AgentStatus.Inactive]: "outline",
  [AgentStatus.OnHold]: "secondary",
}

export function AgentStatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANTS[status] ?? "outline"
  const label = AGENT_STATUS_LABELS[status as AgentStatus] ?? status
  return <Badge variant={variant}>{label}</Badge>
}
