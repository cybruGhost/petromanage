"use client"

import type React from "react"
import type { User } from "@/lib/local-storage"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { addUser, getUserByEmail, initializeLocalStorage } from "@/lib/local-storage"

type AuthContextType = {
  user: Omit<User, "password"> | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<User> & { password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize localStorage with default data
    initializeLocalStorage()

    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const foundUser = getUserByEmail(email)

      if (!foundUser || foundUser.password !== password) {
        throw new Error("Invalid credentials")
      }

      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

      // Redirect based on role
      if (userWithoutPassword.role === "admin") {
        router.push("/admin/dashboard")
      } else if (userWithoutPassword.role === "distributor") {
        router.push("/distributor/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: Partial<User> & { password: string }) => {
    setLoading(true)
    try {
      // Check if email already exists
      const existingUser = getUserByEmail(userData.email || "")
      if (existingUser) {
        throw new Error("Email already in use")
      }

      // Create new user
      const newUser = addUser({
        name: userData.name || "",
        email: userData.email || "",
        password: userData.password,
        role: userData.role || "customer",
        distributorId: userData.distributorId,
      })

      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

      // Redirect based on role
      if (userWithoutPassword.role === "admin") {
        router.push("/admin/dashboard")
      } else if (userWithoutPassword.role === "distributor") {
        router.push("/distributor/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
