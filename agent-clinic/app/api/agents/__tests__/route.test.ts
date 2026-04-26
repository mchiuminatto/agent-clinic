import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "../route"

const mockAgents = [
  { id: 1, name: "HAL 9000", modelType: "Claude", status: "Active", createdAt: new Date() },
]

vi.mock("@/lib/db", () => ({
  db: {
    agent: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}))

import { db } from "@/lib/db"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("GET /api/agents", () => {
  it("returns paginated list with metadata", async () => {
    vi.mocked(db.agent.findMany).mockResolvedValue(mockAgents as never)
    vi.mocked(db.agent.count).mockResolvedValue(1)

    const req = new Request("http://localhost/api/agents?page=1")
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.data).toHaveLength(1)
    expect(data.total).toBe(1)
    expect(data.page).toBe(1)
    expect(data.pageSize).toBe(10)
  })

  it("defaults to page 1 when no param given", async () => {
    vi.mocked(db.agent.findMany).mockResolvedValue([])
    vi.mocked(db.agent.count).mockResolvedValue(0)

    const req = new Request("http://localhost/api/agents")
    const res = await GET(req)
    const data = await res.json()

    expect(data.page).toBe(1)
  })
})

describe("POST /api/agents", () => {
  it("creates an agent and returns 201", async () => {
    const created = { id: 2, name: "WALL-E", modelType: "Claude", status: "Active", createdAt: new Date() }
    vi.mocked(db.agent.create).mockResolvedValue(created as never)

    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ name: "WALL-E", status: "Active" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.name).toBe("WALL-E")
    expect(data.modelType).toBe("Claude")
  })

  it("returns 400 when name is missing", async () => {
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ status: "Active" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("returns 400 when status is invalid", async () => {
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ name: "WALL-E", status: "Confused" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("always sets modelType to Claude", async () => {
    const created = { id: 3, name: "R2D2", modelType: "Claude", status: "Active", createdAt: new Date() }
    vi.mocked(db.agent.create).mockResolvedValue(created as never)

    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ name: "R2D2", status: "Active" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    const data = await res.json()
    expect(data.modelType).toBe("Claude")
  })
})
