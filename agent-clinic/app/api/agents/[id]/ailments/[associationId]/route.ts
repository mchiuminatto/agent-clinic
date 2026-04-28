import { NextResponse } from "next/server"
import { db } from "@/lib/db"

interface Params {
  params: { id: string; associationId: string }
}

export async function PATCH(_request: Request, { params }: Params) {
  const agentId = parseInt(params.id)
  const associationId = parseInt(params.associationId)

  if (isNaN(agentId) || isNaN(associationId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const record = await db.agentAilment.findUnique({ where: { id: associationId } })
  if (!record || record.agentId !== agentId) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 })
  }
  if (record.status === "Resolved") {
    return NextResponse.json({ error: "Ailment is already resolved" }, { status: 400 })
  }

  const updated = await db.agentAilment.update({
    where: { id: associationId },
    data: { status: "Resolved", resolvedAt: new Date() },
    include: { ailment: true },
  })

  return NextResponse.json(updated)
}
