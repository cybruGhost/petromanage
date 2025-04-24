"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, Users } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DistributorDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "distributor") {
      router.push(`/${user.role}/dashboard`)
    }
  }, [user, router])

  if (!user || user.role !== "distributor") {
    return null
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Distributor Dashboard</h1>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+4 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+2 from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">+2 new products</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Customer Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Order #5432</p>
                        <p className="text-sm text-muted-foreground">Customer: ABC Gas Station</p>
                      </div>
                      <div className="ml-auto font-medium">+$1,250.00</div>
                    </div>
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Order #5431</p>
                        <p className="text-sm text-muted-foreground">Customer: XYZ Fuel Center</p>
                      </div>
                      <div className="ml-auto font-medium">+$2,100.00</div>
                    </div>
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Order #5430</p>
                        <p className="text-sm text-muted-foreground">Customer: City Petroleum</p>
                      </div>
                      <div className="ml-auto font-medium">+$950.00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Product Availability</CardTitle>
                  <CardDescription>Current stock levels from supplier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Premium Gasoline</p>
                        <div className="w-[180px] h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-blue-500 w-[80%] h-full" />
                        </div>
                      </div>
                      <div className="font-medium">Available</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Regular Gasoline</p>
                        <div className="w-[180px] h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-blue-500 w-[65%] h-full" />
                        </div>
                      </div>
                      <div className="font-medium">Available</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Diesel</p>
                        <div className="w-[180px] h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-blue-500 w-[90%] h-full" />
                        </div>
                      </div>
                      <div className="font-medium">Available</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Customers</CardTitle>
                <Button size="sm">Add Customer</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 font-medium border-b pb-2">
                    <div>Customer Name</div>
                    <div>Contact</div>
                    <div>Status</div>
                  </div>
                  <div className="grid grid-cols-3 items-center border-b pb-4">
                    <div>ABC Gas Station</div>
                    <div className="text-sm text-muted-foreground">john@abcgas.com</div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Active
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center border-b pb-4">
                    <div>XYZ Fuel Center</div>
                    <div className="text-sm text-muted-foreground">sarah@xyzfuel.com</div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Active
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center border-b pb-4">
                    <div>City Petroleum</div>
                    <div className="text-sm text-muted-foreground">mike@citypetro.com</div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      Pending
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Management</CardTitle>
                <Button size="sm">New Order</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 font-medium border-b pb-2">
                    <div>Order ID</div>
                    <div>Customer</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="grid grid-cols-4 items-center border-b pb-4">
                    <div>#5432</div>
                    <div>ABC Gas Station</div>
                    <div>$1,250.00</div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      Processing
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center border-b pb-4">
                    <div>#5431</div>
                    <div>XYZ Fuel Center</div>
                    <div>$2,100.00</div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Delivered
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center border-b pb-4">
                    <div>#5430</div>
                    <div>City Petroleum</div>
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
