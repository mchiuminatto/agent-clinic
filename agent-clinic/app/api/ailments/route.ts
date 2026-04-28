import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

const VALID_SEVERITIES = ["Low", "Medium", "High"]

export async function GET() {
  const ailments = await db.ailment.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(ailments)
}

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { name, description, severity } = body

  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }
  if (!VALID_SEVERITIES.includes(severity)) {
    return NextResponse.json({ error: "severity must be Low, Medium, or High" }, { status: 400 })
  }

  try {
    const ailment = await db.ailment.create({
      data: {
        name: name.trim(),
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        severity,
      },
    })
    return NextResponse.json(ailment, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "An ailment with that name already exists" }, { status: 409 })
    }
    throw e
  }
}
