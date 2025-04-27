"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function AdminRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/admin/dashboard")
    } else if (user) {
      router.push(`/${user.role}/dashboard`)
    } else {
      router.push("/login")
    }
  }, [user, router])

  return null
}
