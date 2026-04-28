import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

interface Params {
  params: { id: string }
}

export async function GET(_request: Request, { params }: Params) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const agent = await db.agent.findUnique({ where: { id } })
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  return NextResponse.json(agent)
}

export async function PUT(request: Request, { params }: Params) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const existing = await db.agent.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { name, status } = body

  const validStatuses = ["Active", "InTreatment", "Inactive", "OnHold"]
  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    return NextResponse.json({ error: "name must be a non-empty string" }, { status: 400 })
  }
  if (status !== undefined && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "invalid status value" }, { status: 400 })
  }

  const agent = await db.agent.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(status !== undefined && { status }),
    },
  })

  return NextResponse.json(agent)
}

export async function DELETE(_request: Request, { params }: Params) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const existing = await db.agent.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  try {
    await db.agent.delete({ where: { id } })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete agent with active ailments" },
        { status: 409 }
      )
    }
    throw e
  }
  return new NextResponse(null, { status: 204 })
}
