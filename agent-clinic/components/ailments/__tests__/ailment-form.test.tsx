import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AilmentForm } from "../ailment-form"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
}))

describe("AilmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("disables submit when name is empty", () => {
    render(<AilmentForm />)
    expect(screen.getByRole("button", { name: /add ailment/i })).toBeDisabled()
  })

  it("disables submit when severity is not selected", async () => {
    const user = userEvent.setup()
    render(<AilmentForm />)
    await user.type(screen.getByLabelText(/name/i), "Context Overflow")
    expect(screen.getByRole("button", { name: /add ailment/i })).toBeDisabled()
  })

  it("shows 'Save Changes' label in edit mode", () => {
    render(
      <AilmentForm
        initialValues={{ name: "Token Anxiety", severity: "Low" }}
        ailmentId={1}
      />
    )
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument()
  })

  it("pre-fills name when editing", () => {
    render(
      <AilmentForm
        initialValues={{ name: "Token Anxiety", severity: "Low" }}
        ailmentId={1}
      />
    )
    expect(screen.getByDisplayValue("Token Anxiety")).toBeInTheDocument()
  })
})
