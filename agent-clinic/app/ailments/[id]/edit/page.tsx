"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AilmentForm } from "@/components/ailments/ailment-form"
import type { Ailment } from "@/lib/types"

export default function EditAilmentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ailment, setAilment] = useState<Ailment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/ailments/${id}`)
      .then((r) => {
        if (!r.ok) router.push("/ailments")
        return r.json()
      })
      .then((data) => {
        setAilment(data)
        setLoading(false)
      })
  }, [id, router])

  if (loading) return <p className="text-slate-500">Loading…</p>
  if (!ailment) return null

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ailments">← Back</Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Edit Ailment</h1>
        <p className="text-sm text-slate-500 mt-1">Update {ailment.name}.</p>
      </div>
      <AilmentForm
        initialValues={{ name: ailment.name, description: ailment.description, severity: ailment.severity }}
        ailmentId={ailment.id}
      />
    </div>
  )
}
