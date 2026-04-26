import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { RoleProvider } from "@/context/role-context"
import { Nav } from "@/components/nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgentClinic",
  description: "A wellness platform for AI agents",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RoleProvider>
          <Nav />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </RoleProvider>
      </body>
    </html>
  )
}
