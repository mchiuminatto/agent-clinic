import { describe, it, expect, vi, beforeEach } from "vitest"
import { Prisma } from "@prisma/client"
import { GET, PUT } from "../route"

const mockAilment = {
  id: 1,
  name: "Context Overflow",
  description: "Too much context.",
  severity: "High",
}

vi.mock("@/lib/db", () => ({
  db: {
    ailment: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

import { db } from "@/lib/db"

beforeEach(() => {
  vi.clearAllMocks()
})

const params = { params: { id: "1" } }

describe("GET /api/ailments/[id]", () => {
  it("returns the ailment when found", async () => {
    vi.mocked(db.ailment.findUnique).mockResolvedValue(mockAilment as never)
    const req = new Request("http://localhost/api/ailments/1")
    const res = await GET(req, params)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe("Context Overflow")
    expect(data.severity).toBe("High")
  })

  it("returns 404 when not found", async () => {
    vi.mocked(db.ailment.findUnique).mockResolvedValue(null)
    const req = new Request("http://localhost/api/ailments/999")
    const res = await GET(req, { params: { id: "999" } })
    expect(res.status).toBe(404)
  })

  it("returns 400 for non-numeric id", async () => {
    const req = new Request("http://localhost/api/ailments/abc")
    const res = await GET(req, { params: { id: "abc" } })
    expect(res.status).toBe(400)
  })
})

describe("PUT /api/ailments/[id]", () => {
  it("updates and returns the ailment", async () => {
    const updated = { ...mockAilment, description: "Updated description." }
    vi.mocked(db.ailment.findUnique).mockResolvedValue(mockAilment as never)
    vi.mocked(db.ailment.update).mockResolvedValue(updated as never)

    const req = new Request("http://localhost/api/ailments/1", {
      method: "PUT",
      body: JSON.stringify({ description: "Updated description." }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await PUT(req, params)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.description).toBe("Updated description.")
  })

  it("returns 404 when not found", async () => {
    vi.mocked(db.ailment.findUnique).mockResolvedValue(null)
    const req = new Request("http://localhost/api/ailments/999", {
      method: "PUT",
      body: JSON.stringify({ name: "X" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await PUT(req, { params: { id: "999" } })
    expect(res.status).toBe(404)
  })

  it("returns 400 for empty name", async () => {
    vi.mocked(db.ailment.findUnique).mockResolvedValue(mockAilment as never)
    const req = new Request("http://localhost/api/ailments/1", {
      method: "PUT",
      body: JSON.stringify({ name: "  " }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await PUT(req, params)
    expect(res.status).toBe(400)
  })

  it("returns 400 for invalid severity", async () => {
    vi.mocked(db.ailment.findUnique).mockResolvedValue(mockAilment as never)
    const req = new Request("http://localhost/api/ailments/1", {
      method: "PUT",
      body: JSON.stringify({ severity: "Critical" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await PUT(req, params)
    expect(res.status).toBe(400)
  })

  it("returns 400 for malformed JSON", async () => {
    vi.mocked(db.ailment.findUnique).mockResolvedValue(mockAilment as never)
    const req = new Request("http://localhost/api/ailments/1", {
      method: "PUT",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    })
    const res = await PUT(req, params)
    expect(res.status).toBe(400)
  })

  it("returns 409 when name already exists", async () => {
    vi.mocked(db.ailment.findUnique).mockResolvedValue(mockAilment as never)
    vi.mocked(db.ailment.update).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.0.0",
      })
    )
    const req = new Request("http://localhost/api/ailments/1", {
      method: "PUT",
      body: JSON.stringify({ name: "Token Anxiety" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await PUT(req, params)
    expect(res.status).toBe(409)
  })
})
