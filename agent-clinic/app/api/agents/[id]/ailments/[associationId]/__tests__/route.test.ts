import { describe, it, expect, vi, beforeEach } from "vitest"
import { PATCH } from "../route"

const mockAilment = { id: 1, name: "Context Overflow", description: null, severity: "High" }
const activeRecord = {
  id: 10,
  agentId: 1,
  ailmentId: 1,
  status: "Active",
  createdAt: new Date(),
  resolvedAt: null,
  ailment: mockAilment,
}
const resolvedRecord = { ...activeRecord, status: "Resolved", resolvedAt: new Date() }

vi.mock("@/lib/db", () => ({
  db: {
    agentAilment: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

import { db } from "@/lib/db"

beforeEach(() => {
  vi.clearAllMocks()
})

const params = { params: { id: "1", associationId: "10" } }

describe("PATCH /api/agents/[id]/ailments/[associationId]", () => {
  it("resolves an active record and returns it", async () => {
    vi.mocked(db.agentAilment.findUnique).mockResolvedValue(activeRecord as never)
    vi.mocked(db.agentAilment.update).mockResolvedValue(resolvedRecord as never)

    const req = new Request("http://localhost/api/agents/1/ailments/10", { method: "PATCH" })
    const res = await PATCH(req, params)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe("Resolved")
  })

  it("returns 400 when record is already resolved", async () => {
    vi.mocked(db.agentAilment.findUnique).mockResolvedValue(resolvedRecord as never)

    const req = new Request("http://localhost/api/agents/1/ailments/10", { method: "PATCH" })
    const res = await PATCH(req, params)
    expect(res.status).toBe(400)
  })

  it("returns 404 when record not found", async () => {
    vi.mocked(db.agentAilment.findUnique).mockResolvedValue(null)

    const req = new Request("http://localhost/api/agents/1/ailments/999", { method: "PATCH" })
    const res = await PATCH(req, { params: { id: "1", associationId: "999" } })
    expect(res.status).toBe(404)
  })

  it("returns 404 when record belongs to a different agent", async () => {
    vi.mocked(db.agentAilment.findUnique).mockResolvedValue({ ...activeRecord, agentId: 99 } as never)

    const req = new Request("http://localhost/api/agents/1/ailments/10", { method: "PATCH" })
    const res = await PATCH(req, params)
    expect(res.status).toBe(404)
  })
})
