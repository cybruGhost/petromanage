"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserByEmail, addUser, getUserById, initializeLocalStorage, type User } from "@/lib/local-storage"

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

    // Check if user is already logged in from localStorage
    const storedUserId = localStorage.getItem("currentUserId")
    if (storedUserId) {
      const foundUser = getUserById(storedUserId)
      if (foundUser) {
        // Remove password from user object for security
        const { password, ...safeUser } = foundUser
        setUser(safeUser)
      } else {
        // Clear invalid user ID
        localStorage.removeItem("currentUserId")
      }
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

      // Store user ID in localStorage
      localStorage.setItem("currentUserId", foundUser.id)

      // Remove password from user object for security
      const { password: _, ...safeUser } = foundUser
      setUser(safeUser)

      // Redirect based on role
      if (foundUser.role === "admin") {
        router.push("/admin/dashboard")
      } else if (foundUser.role === "distributor") {
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
        address: userData.address,
        phone: userData.phone,
      })

      // Store user ID in localStorage
      localStorage.setItem("currentUserId", newUser.id)

      // Remove password from user object for security
      const { password: _, ...safeUser } = newUser
      setUser(safeUser)

      // Redirect based on role
      if (newUser.role === "admin") {
        router.push("/admin/dashboard")
      } else if (newUser.role === "distributor") {
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
    localStorage.removeItem("currentUserId")
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
