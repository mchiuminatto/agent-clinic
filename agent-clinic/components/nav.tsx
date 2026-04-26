"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { RoleToggle } from "@/components/role-toggle"

const links = [
  { href: "/agents", label: "Agents" },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
            AgentClinic
          </Link>
          <nav className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-slate-900",
                  pathname.startsWith(link.href)
                    ? "text-slate-900"
                    : "text-slate-500"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <RoleToggle />
      </div>
    </header>
  )
}
