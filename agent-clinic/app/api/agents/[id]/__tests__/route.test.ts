import { describe, it, expect, vi, beforeEach } from "vitest"
import { Prisma } from "@prisma/client"
import { GET, PUT, DELETE } from "../route"

const mockAgent = {
  id: 1,
  name: "HAL 9000",
  modelType: "Claude",
  status: "Active",
  createdAt: new Date(),
}

vi.mock("@/lib/db", () => ({
  db: {
    agent: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { db } from "@/lib/db"

beforeEach(() => {
  vi.clearAllMocks()
})

const params = { params: { id: "1" } }

describe("GET /api/agents/[id]", () => {
  it("returns the agent when found", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(mockAgent as never)
    const req = new Request("http://localhost/api/agents/1")
    const res = await GET(req, params)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe("HAL 9000")
  })

  it("returns 404 when not found", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(null)
    const req = new Request("http://localhost/api/agents/999")
    const res = await GET(req, { params: { id: "999" } })
    expect(res.status).toBe(404)
  })
})

describe("PUT /api/agents/[id]", () => {
  it("updates and returns the agent", async () => {
    const updated = { ...mockAgent, name: "HAL 9001", status: "InTreatment" }
    vi.mocked(db.agent.findUnique).mockResolvedValue(mockAgent as never)
    vi.mocked(db.agent.update).mockResolvedValue(updated as never)

    const req = new Request("http://localhost/api/agents/1", {
      method: "PUT",
      body: JSON.stringify({ name: "HAL 9001", status: "InTreatment" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await PUT(req, params)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe("HAL 9001")
  })

  it("returns 404 for unknown agent", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(null)
    const req = new Request("http://localhost/api/agents/999", {
      method: "PUT",
      body: JSON.stringify({ name: "X" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await PUT(req, { params: { id: "999" } })
    expect(res.status).toBe(404)
  })
})

describe("DELETE /api/agents/[id]", () => {
  it("deletes the agent and returns 204", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(mockAgent as never)
    vi.mocked(db.agent.delete).mockResolvedValue(mockAgent as never)

    const req = new Request("http://localhost/api/agents/1", { method: "DELETE" })
    const res = await DELETE(req, params)
    expect(res.status).toBe(204)
  })

  it("returns 404 when agent not found", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(null)
    const req = new Request("http://localhost/api/agents/999", { method: "DELETE" })
    const res = await DELETE(req, { params: { id: "999" } })
    expect(res.status).toBe(404)
  })

  it("returns 409 when agent has ailments", async () => {
    vi.mocked(db.agent.findUnique).mockResolvedValue(mockAgent as never)
    vi.mocked(db.agent.delete).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("FK constraint failed", {
        code: "P2003",
        clientVersion: "5.0.0",
      })
    )
    const req = new Request("http://localhost/api/agents/1", { method: "DELETE" })
    const res = await DELETE(req, params)
    expect(res.status).toBe(409)
  })
})
