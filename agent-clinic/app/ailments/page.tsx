"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AilmentCatalogTable } from "@/components/ailments/ailment-catalog-table"
import { useRole } from "@/context/role-context"
import type { Ailment } from "@/lib/types"

export default function AilmentsPage() {
  const { isStaff } = useRole()
  const [ailments, setAilments] = useState<Ailment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ailments")
      .then((r) => r.json())
      .then((data) => {
        setAilments(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ailment Catalog</h1>
          {!loading && (
            <p className="text-sm text-slate-500 mt-1">{ailments.length} conditions on record</p>
          )}
        </div>
        {isStaff && (
          <Button asChild>
            <Link href="/ailments/new">New Ailment</Link>
          </Button>
        )}
      </div>

      {loading && <p className="text-slate-500">Loading…</p>}
      {!loading && <AilmentCatalogTable ailments={ailments} />}
    </div>
  )
}
