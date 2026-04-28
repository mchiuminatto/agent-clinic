import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "../route"

const mockAgent = { id: 1, name: "HAL 9000", modelType: "Claude", status: "Active", createdAt: new Date() }
const mockAilment = { id: 1, name: "Context Overflow", description: null, severity: "High" }
const mockRecord = {
  id: 1,
  agentId: 1,
  ailmentId: 1,
  status: "Active",
  createdAt: new Date(),
  resolvedAt: null,
  ailment: mockAilment,
}

vi.mock("@/lib/db", () => ({
  db: {
    agent: { findUnique: vi.fn() },
    ailment: { findUnique: vi.fn() },
    agentAilment: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}))

import { db } from "@/lib/db"

beforeEach(() => {
  vi.clearAllMocks()
})

const params = { params: { id: "1" } }

describe("GET /api/agents/[id]/ailments", () => {
  it("returns ailments for agent including ailment data", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(mockAgent as never)
    vi.mocked(db.agentAilment.findMany).mockResolvedValue([mockRecord] as never)

    const req = new Request("http://localhost/api/agents/1/ailments")
    const res = await GET(req, params)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveLength(1)
    expect(data[0].ailment.name).toBe("Context Overflow")
  })

  it("returns 404 for unknown agent", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(null)
    const req = new Request("http://localhost/api/agents/999/ailments")
    const res = await GET(req, { params: { id: "999" } })
    expect(res.status).toBe(404)
  })
})

describe("POST /api/agents/[id]/ailments", () => {
  it("logs an ailment and returns 201", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(mockAgent as never)
    vi.mocked(db.ailment.findUnique).mockResolvedValue(mockAilment as never)
    vi.mocked(db.agentAilment.findFirst).mockResolvedValue(null)
    vi.mocked(db.agentAilment.create).mockResolvedValue(mockRecord as never)

    const req = new Request("http://localhost/api/agents/1/ailments", {
      method: "POST",
      body: JSON.stringify({ ailmentId: 1 }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req, params)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.status).toBe("Active")
  })

  it("returns 409 when active duplicate exists", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(mockAgent as never)
    vi.mocked(db.ailment.findUnique).mockResolvedValue(mockAilment as never)
    vi.mocked(db.agentAilment.findFirst).mockResolvedValue(mockRecord as never)

    const req = new Request("http://localhost/api/agents/1/ailments", {
      method: "POST",
      body: JSON.stringify({ ailmentId: 1 }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req, params)
    expect(res.status).toBe(409)
  })

  it("returns 404 when agent not found", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(null)

    const req = new Request("http://localhost/api/agents/999/ailments", {
      method: "POST",
      body: JSON.stringify({ ailmentId: 1 }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req, { params: { id: "999" } })
    expect(res.status).toBe(404)
  })

  it("returns 400 when ailmentId is missing", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(mockAgent as never)

    const req = new Request("http://localhost/api/agents/1/ailments", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req, params)
    expect(res.status).toBe(400)
  })
})
