"use client"

import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [role, setRole] = useState<"administrator" | "operator">("operator")

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    // TEMP (later we decode JWT)
    setRole("administrator")
  }, [])

  return (
    <div className="min-h-screen bg-white-100 flex flex-col">

      <DashboardHeader role={role} />

      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  )
}