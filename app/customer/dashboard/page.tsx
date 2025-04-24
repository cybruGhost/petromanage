"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "customer") {
      router.push(`/${user.role}/dashboard`)
    }
  }, [user, router])

  if (!user || user.role !== "customer") {
    return null
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Customer Dashboard</h1>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">1 pending delivery</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">From your distributor</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your recent product orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Order #1234</p>
                      <p className="text-sm text-muted-foreground">Placed on April 15, 2025</p>
                    </div>
                    <div className="ml-auto font-medium">$750.00</div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Order #1233</p>
                      <p className="text-sm text-muted-foreground">Placed on April 2, 2025</p>
                    </div>
                    <div className="ml-auto font-medium">$1,200.00</div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Order #1232</p>
                      <p className="text-sm text-muted-foreground">Placed on March 20, 2025</p>
                    </div>
                    <div className="ml-auto font-medium">$950.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order History</CardTitle>
                <Button size="sm">Place New Order</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 font-medium border-b pb-2">
                    <div>Order ID</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="grid grid-cols-4 items-center border-b pb-4">
                    <div>#1234</div>
                    <div className="text-sm text-muted-foreground">April 15, 2025</div>
                    <div>$750.00</div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      Processing
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center border-b pb-4">
                    <div>#1233</div>
                    <div className="text-sm text-muted-foreground">April 2, 2025</div>
                    <div>$1,200.00</div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      In Transit
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center border-b pb-4">
                    <div>#1232</div>
                    <div className="text-sm text-muted-foreground">March 20, 2025</div>
                    <div>$950.00</div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Delivered
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
