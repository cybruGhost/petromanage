"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Droplet,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile nav when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Please log in to access the dashboard.</p>
        <Link href="/login">
          <Button className="ml-2">Login</Button>
        </Link>
      </div>
    )
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: `/${user.role}/dashboard`,
        icon: LayoutDashboard,
      },
      {
        title: "Settings",
        href: `/${user.role}/settings`,
        icon: Settings,
      },
    ]

    if (user.role === "admin") {
      return [
        ...baseItems,
        {
          title: "Distributors",
          href: "/admin/distributors",
          icon: Truck,
        },
        {
          title: "Products",
          href: "/admin/products",
          icon: Package,
        },
        {
          title: "Orders",
          href: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          title: "Reports",
          href: "/admin/reports",
          icon: BarChart3,
        },
      ]
    } else if (user.role === "distributor") {
      return [
        ...baseItems,
        {
          title: "Customers",
          href: "/distributor/customers",
          icon: Users,
        },
        {
          title: "Orders",
          href: "/distributor/orders",
          icon: ShoppingCart,
        },
        {
          title: "Products",
          href: "/distributor/products",
          icon: Package,
        },
      ]
    } else {
      // Customer
      return [
        ...baseItems,
        {
          title: "Products",
          href: "/customer/products",
          icon: Package,
        },
        {
          title: "My Orders",
          href: "/customer/orders",
          icon: ShoppingCart,
        },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <Droplet className="h-6 w-6" />
                <span className="font-bold">PetroManage</span>
              </Link>
              <div className="my-4 border-t" />
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
                    pathname === item.href && "bg-muted text-primary",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary justify-start"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Droplet className="h-6 w-6" />
          <span className="font-bold">PetroManage</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex">
            <p className="text-sm font-medium">
              Welcome, {user.name} ({user.role})
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r md:block">
          <nav className="grid gap-2 p-4 text-sm">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
                  pathname === item.href && "bg-muted text-primary",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
