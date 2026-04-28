import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

const VALID_SEVERITIES = ["Low", "Medium", "High"]

interface Params {
  params: { id: string }
}

export async function GET(_request: Request, { params }: Params) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const ailment = await db.ailment.findUnique({ where: { id } })
  if (!ailment) {
    return NextResponse.json({ error: "Ailment not found" }, { status: 404 })
  }

  return NextResponse.json(ailment)
}

export async function PUT(request: Request, { params }: Params) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const existing = await db.ailment.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Ailment not found" }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { name, description, severity } = body

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    return NextResponse.json({ error: "name must be a non-empty string" }, { status: 400 })
  }
  if (severity !== undefined && !VALID_SEVERITIES.includes(severity)) {
    return NextResponse.json({ error: "severity must be Low, Medium, or High" }, { status: 400 })
  }

  try {
    const ailment = await db.ailment.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(severity !== undefined && { severity }),
      },
    })
    return NextResponse.json(ailment)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "An ailment with that name already exists" }, { status: 409 })
    }
    throw e
  }
}
