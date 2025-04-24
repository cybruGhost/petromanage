"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Droplet, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingCart, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationsPopover } from "@/components/notifications-popover"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(0)

  // Load cart items from localStorage
  useEffect(() => {
    if (user) {
      const cartItems = localStorage.getItem(`cart_${user.id}`)
      if (cartItems) {
        try {
          const parsedCart = JSON.parse(cartItems)
          // Calculate total quantity of items in cart
          const totalItems = Array.isArray(parsedCart)
            ? parsedCart.reduce((count, item) => count + (item.quantity || 0), 0)
            : 0
          setCartItemsCount(totalItems)
        } catch (error) {
          console.error("Error parsing cart items:", error)
          setCartItemsCount(0)
        }
      }
    }
  }, [user, pathname])

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
    if (user.role === "admin") {
      return [
        {
          title: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Products",
          href: "/admin/products",
          icon: Package,
        },
        {
          title: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ]
    } else if (user.role === "distributor") {
      return [
        {
          title: "Dashboard",
          href: "/distributor/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Products",
          href: "/distributor/products",
          icon: Package,
        },
        {
          title: "Settings",
          href: "/distributor/settings",
          icon: Settings,
        },
      ]
    } else {
      // Customer
      return [
        {
          title: "Products",
          href: "/customer/products",
          icon: Package,
        },
        {
          title: "Cart",
          href: "/customer/cart",
          icon: ShoppingCart,
          badge: cartItemsCount > 0 ? cartItemsCount : undefined,
        },
        {
          title: "Orders",
          href: "/customer/orders",
          icon: CreditCard,
        },
        {
          title: "Profile",
          href: "/customer/settings",
          icon: User,
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
                  {item.badge && (
                    <Badge className="ml-auto h-6 w-6 justify-center rounded-full p-0">{item.badge}</Badge>
                  )}
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
          {user.role === "customer" && (
            <Link href="/customer/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          <NotificationsPopover />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${user.role}/settings`}>Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                <span>{item.title}</span>
                {item.badge && <Badge className="ml-auto h-5 w-5 justify-center rounded-full p-0">{item.badge}</Badge>}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
