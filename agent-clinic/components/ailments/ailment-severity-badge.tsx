import { Badge } from "@/components/ui/badge"
import type { BadgeProps } from "@/components/ui/badge"
import { AilmentSeverity } from "@/lib/types"

const SEVERITY_VARIANTS: Record<string, BadgeProps["variant"]> = {
  [AilmentSeverity.Low]: "secondary",
  [AilmentSeverity.Medium]: "warning",
  [AilmentSeverity.High]: "destructive",
}

export function AilmentSeverityBadge({ severity }: { severity: string }) {
  const variant = SEVERITY_VARIANTS[severity] ?? "outline"
  return <Badge variant={variant}>{severity}</Badge>
}
