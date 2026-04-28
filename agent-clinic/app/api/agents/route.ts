import { NextResponse } from "next/server"
import { db } from "@/lib/db"

const PAGE_SIZE = 10

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))

  const [data, total] = await Promise.all([
    db.agent.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
    db.agent.count(),
  ])

  return NextResponse.json({ data, total, page, pageSize: PAGE_SIZE })
}

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const { name, status } = body

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  const validStatuses = ["Active", "InTreatment", "Inactive", "OnHold"]
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "valid status is required" }, { status: 400 })
  }

  const agent = await db.agent.create({
    data: { name: name.trim(), modelType: "Claude", status },
  })

  return NextResponse.json(agent, { status: 201 })
}
