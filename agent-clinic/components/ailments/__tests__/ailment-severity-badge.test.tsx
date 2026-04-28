import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { AilmentSeverityBadge } from "../ailment-severity-badge"
import { AilmentSeverity } from "@/lib/types"

describe("AilmentSeverityBadge", () => {
  it.each([
    [AilmentSeverity.Low, "Low"],
    [AilmentSeverity.Medium, "Medium"],
    [AilmentSeverity.High, "High"],
  ])("renders label for %s", (severity, label) => {
    render(<AilmentSeverityBadge severity={severity} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("covers all three severity values", () => {
    expect(Object.values(AilmentSeverity)).toHaveLength(3)
  })
})
