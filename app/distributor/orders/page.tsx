"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOrdersByDistributorId, updateOrder } from "@/lib/local-storage"
import type { Order } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

export default function DistributorOrders() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) {
      // Load orders from localStorage
      setOrders(getOrdersByDistributorId(user.id))
    }
  }, [user])

  if (!user || user.role !== "distributor") {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-blue-500"
      case "In Transit":
        return "bg-yellow-500"
      case "Delivered":
        return "bg-green-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleStatusChange = (orderId: string, newStatus: "Processing" | "In Transit" | "Delivered" | "Cancelled") => {
    const orderToUpdate = orders.find((order) => order.id === orderId)
    if (!orderToUpdate) return

    const updatedOrder = { ...orderToUpdate, status: newStatus }
    updateOrder(updatedOrder)

    setOrders(orders.map((order) => (order.id === orderId ? updatedOrder : order)))

    toast({
      title: "Order Updated",
      description: `Order #${orderId} status changed to ${newStatus}`,
    })
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No orders have been placed yet.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>
                    Placed on {order.date} by {order.customerName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) =>
                      handleStatusChange(order.id, value as "Processing" | "In Transit" | "Delivered" | "Cancelled")
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Invoice
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Order Total
                      </TableCell>
                      <TableCell className="text-right font-bold">${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  )
}
