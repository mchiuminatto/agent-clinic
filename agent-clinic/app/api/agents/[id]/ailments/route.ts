import { NextResponse } from "next/server"
import { db } from "@/lib/db"

interface Params {
  params: { id: string }
}

export async function GET(_request: Request, { params }: Params) {
  const agentId = parseInt(params.id)
  if (isNaN(agentId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const agent = await db.agent.findUnique({ where: { id: agentId } })
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  const ailments = await db.agentAilment.findMany({
    where: { agentId },
    include: { ailment: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(ailments)
}

export async function POST(request: Request, { params }: Params) {
  const agentId = parseInt(params.id)
  if (isNaN(agentId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const agent = await db.agent.findUnique({ where: { id: agentId } })
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const ailmentId = parseInt(body.ailmentId)
  if (isNaN(ailmentId)) {
    return NextResponse.json({ error: "ailmentId is required" }, { status: 400 })
  }

  const ailment = await db.ailment.findUnique({ where: { id: ailmentId } })
  if (!ailment) {
    return NextResponse.json({ error: "Ailment not found" }, { status: 404 })
  }

  const duplicate = await db.agentAilment.findFirst({
    where: { agentId, ailmentId, status: "Active" },
  })
  if (duplicate) {
    return NextResponse.json({ error: "Agent already has this ailment active" }, { status: 409 })
  }

  const record = await db.agentAilment.create({
    data: { agentId, ailmentId, status: "Active" },
    include: { ailment: true },
  })

  return NextResponse.json(record, { status: 201 })
}
