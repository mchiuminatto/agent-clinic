import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AgentForm } from "../agent-form"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
}))

describe("AgentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("disables submit when name is empty", () => {
    render(<AgentForm />)
    expect(screen.getByRole("button", { name: /register agent/i })).toBeDisabled()
  })

  it("enables submit when name is filled", async () => {
    const user = userEvent.setup()
    render(<AgentForm />)
    await user.type(screen.getByLabelText(/name/i), "HAL 9000")
    expect(screen.getByRole("button", { name: /register agent/i })).not.toBeDisabled()
  })

  it("shows 'Save Changes' label in edit mode", () => {
    render(<AgentForm initialValues={{ name: "HAL", status: "Active" }} agentId={1} />)
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument()
  })

  it("pre-fills name when editing", () => {
    render(<AgentForm initialValues={{ name: "HAL 9000", status: "Active" }} agentId={1} />)
    expect(screen.getByDisplayValue("HAL 9000")).toBeInTheDocument()
  })
})
