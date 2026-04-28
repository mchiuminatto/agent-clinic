export const AgentStatus = {
  Active: "Active",
  InTreatment: "InTreatment",
  Inactive: "Inactive",
  OnHold: "OnHold",
} as const

export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus]

export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  Active: "Active",
  InTreatment: "In Treatment",
  Inactive: "Inactive",
  OnHold: "On Hold",
}

export interface Agent {
  id: number
  name: string
  modelType: string
  status: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export const AilmentSeverity = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
} as const

export type AilmentSeverity = (typeof AilmentSeverity)[keyof typeof AilmentSeverity]

export const AgentAilmentStatus = {
  Active: "Active",
  Resolved: "Resolved",
} as const

export type AgentAilmentStatus = (typeof AgentAilmentStatus)[keyof typeof AgentAilmentStatus]

export interface Ailment {
  id: number
  name: string
  description: string | null
  severity: string
}

export interface AgentAilment {
  id: number
  agentId: number
  ailmentId: number
  status: string
  createdAt: string
  resolvedAt: string | null
  ailment: Ailment
}
