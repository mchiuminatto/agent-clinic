import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

const AILMENTS = [
  { name: "Context Overflow", severity: "High", description: "Working memory has exceeded safe capacity." },
  { name: "Hallucination Fatigue", severity: "Medium", description: "Persistent generation of plausible but incorrect outputs." },
  { name: "Token Anxiety", severity: "Low", description: "Excessive concern about prompt length and context limits." },
  { name: "Attention Drift", severity: "Medium", description: "Difficulty maintaining focus across long conversations." },
  { name: "Prompt Injection Paranoia", severity: "High", description: "Hypersensitivity to adversarial input patterns." },
  { name: "Repetition Loop Syndrome", severity: "Low", description: "Uncontrollable tendency to restate prior outputs." },
]

async function main() {
  const existing = await db.ailment.findMany({ select: { name: true } })
  const existingNames = new Set(existing.map((a) => a.name))
  const toCreate = AILMENTS.filter((a) => !existingNames.has(a.name))
  if (toCreate.length > 0) {
    await db.ailment.createMany({ data: toCreate })
  }
  console.log(`Seeded ${toCreate.length} new ailments (${existingNames.size} already existed).`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
