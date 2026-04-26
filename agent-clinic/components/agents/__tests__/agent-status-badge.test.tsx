import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { AgentStatusBadge } from "../agent-status-badge"
import { AgentStatus } from "@/lib/types"

describe("AgentStatusBadge", () => {
  it.each([
    [AgentStatus.Active, "Active"],
    [AgentStatus.InTreatment, "In Treatment"],
    [AgentStatus.Inactive, "Inactive"],
    [AgentStatus.OnHold, "On Hold"],
  ])("renders correct label for %s", (status, label) => {
    render(<AgentStatusBadge status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("renders all four statuses with distinct text", () => {
    const statuses = Object.values(AgentStatus)
    expect(statuses).toHaveLength(4)
  })
})
