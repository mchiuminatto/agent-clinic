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
