"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Download, Truck } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate, getOrdersByCustomerId, getPaymentByOrderId } from "@/lib/local-storage"
import type { Order, Payment } from "@/lib/local-storage"
import { generateInvoicePDF } from "@/lib/invoice-generator"

export default function CustomerOrders() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Record<string, Payment>>({})
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all")

  useEffect(() => {
    if (user) {
      // Load orders from localStorage
      const userOrders = getOrdersByCustomerId(user.id)
      setOrders(userOrders)

      // Load payments for each order
      const orderPayments: Record<string, Payment> = {}
      userOrders.forEach((order) => {
        const payment = getPaymentByOrderId(order.id)
        if (payment) {
          orderPayments[order.id] = payment
        }
      })
      setPayments(orderPayments)
    }
  }, [user])

  if (!user || user.role !== "customer") {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "in_transit":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "Pending Payment"
      case "processing":
        return "Processing"
      case "in_transit":
        return "In Transit"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "processing":
        return "Processing"
      case "completed":
        return "Completed"
      case "failed":
        return "Failed"
      case "refunded":
        return "Refunded"
      default:
        return status
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card"
      case "bank_transfer":
        return "Bank Transfer"
      case "cash_on_delivery":
        return "Cash on Delivery"
      default:
        return method
    }
  }

  const filteredOrders = orders
    .filter((order) => {
      if (activeTab === "all") return true
      if (activeTab === "active") return ["pending_payment", "processing", "in_transit"].includes(order.status)
      if (activeTab === "completed") return ["delivered", "cancelled"].includes(order.status)
      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleGenerateInvoice = (order: Order) => {
    const payment = payments[order.id]
    generateInvoicePDF(order, payment, user)
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          <Button onClick={() => router.push("/customer/products")}>Place New Order</Button>
        </div>

        <div className="flex space-x-2 mb-4">
          <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")}>
            All Orders
          </Button>
          <Button variant={activeTab === "active" ? "default" : "outline"} onClick={() => setActiveTab("active")}>
            Active
          </Button>
          <Button variant={activeTab === "completed" ? "default" : "outline"} onClick={() => setActiveTab("completed")}>
            Completed
          </Button>
        </div>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
              <Button onClick={() => router.push("/customer/products")}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`${getStatusColor(order.status)} text-white`}>{getStatusLabel(order.status)}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleGenerateInvoice(order)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
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
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Order Total
                        </TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(order.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Information</h3>
                      <div className="text-sm border rounded-md p-3">
                        <p className="whitespace-pre-line">{order.shippingAddress}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Payment Information</h3>
                      <div className="text-sm border rounded-md p-3">
                        {payments[order.id] ? (
                          <div className="space-y-1">
                            <p>
                              <span className="font-medium">Method:</span>{" "}
                              {getPaymentMethodLabel(payments[order.id].method)}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              {getPaymentStatusLabel(payments[order.id].status)}
                            </p>
                            {payments[order.id].transactionId && (
                              <p>
                                <span className="font-medium">Transaction ID:</span> {payments[order.id].transactionId}
                              </p>
                            )}
                            {payments[order.id].cardLast4 && (
                              <p>
                                <span className="font-medium">Card:</span> **** **** **** {payments[order.id].cardLast4}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p>No payment information available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {order.status === "in_transit" && (
                  <div className="mt-4 border rounded-md p-4 bg-muted/50">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      <h3 className="font-semibold">Delivery Status</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full w-2/3"></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your order is on the way and expected to arrive within 2 days.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  )
}
