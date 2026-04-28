import { describe, it, expect, vi, beforeEach } from "vitest"
import { Prisma } from "@prisma/client"
import { GET, POST } from "../route"

const mockAilments = [
  { id: 1, name: "Context Overflow", description: "Too much context.", severity: "High" },
  { id: 2, name: "Token Anxiety", description: null, severity: "Low" },
]

vi.mock("@/lib/db", () => ({
  db: {
    ailment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

import { db } from "@/lib/db"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("GET /api/ailments", () => {
  it("returns all catalog entries", async () => {
    vi.mocked(db.ailment.findMany).mockResolvedValue(mockAilments as never)
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveLength(2)
    expect(data[0]).toHaveProperty("severity")
  })
})

describe("POST /api/ailments", () => {
  it("creates a catalog entry and returns 201", async () => {
    const created = { id: 3, name: "Attention Drift", description: null, severity: "Medium" }
    vi.mocked(db.ailment.create).mockResolvedValue(created as never)

    const req = new Request("http://localhost/api/ailments", {
      method: "POST",
      body: JSON.stringify({ name: "Attention Drift", severity: "Medium" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe("Attention Drift")
  })

  it("returns 400 when name is missing", async () => {
    const req = new Request("http://localhost/api/ailments", {
      method: "POST",
      body: JSON.stringify({ severity: "Medium" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("returns 400 when severity is invalid", async () => {
    const req = new Request("http://localhost/api/ailments", {
      method: "POST",
      body: JSON.stringify({ name: "Test", severity: "Critical" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("returns 400 when severity is missing", async () => {
    const req = new Request("http://localhost/api/ailments", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("returns 400 for malformed JSON", async () => {
    const req = new Request("http://localhost/api/ailments", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("returns 409 when name already exists", async () => {
    vi.mocked(db.ailment.create).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.0.0",
      })
    )
    const req = new Request("http://localhost/api/ailments", {
      method: "POST",
      body: JSON.stringify({ name: "Context Overflow", severity: "High" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(409)
  })
})
