"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText, Truck } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  formatCurrency,
  formatDate,
  getOrdersByDistributorId,
  getPaymentByOrderId,
  updateOrder,
  getUserById,
} from "@/lib/local-storage"
import type { Order, OrderStatus, Payment, User } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

export default function DistributorOrders() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Record<string, Payment>>({})
  const [customers, setCustomers] = useState<Record<string, User>>({})
  const [activeTab, setActiveTab] = useState<"all" | "pending_payment" | "processing" | "in_transit" | "delivered">(
    "all",
  )
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [customerNote, setCustomerNote] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user) {
      // Load orders from localStorage
      const distributorOrders = getOrdersByDistributorId(user.id)
      setOrders(distributorOrders)

      // Load payments for each order
      const orderPayments: Record<string, Payment> = {}
      const orderCustomers: Record<string, User> = {}

      distributorOrders.forEach((order) => {
        const payment = getPaymentByOrderId(order.id)
        if (payment) {
          orderPayments[order.id] = payment
        }

        const customer = getUserById(order.customerId)
        if (customer) {
          orderCustomers[order.customerId] = customer
        }
      })

      setPayments(orderPayments)
      setCustomers(orderCustomers)
    }
  }, [user])

  if (!user || user.role !== "distributor") {
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

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const orderToUpdate = orders.find((order) => order.id === orderId)
    if (!orderToUpdate) return

    const updatedOrder = { ...orderToUpdate, status: newStatus }
    updateOrder(updatedOrder)

    setOrders(orders.map((order) => (order.id === orderId ? updatedOrder : order)))

    toast({
      title: "Order Updated",
      description: `Order #${orderId} status changed to ${getStatusLabel(newStatus)}`,
    })
  }

  const handleAddNote = (order: Order) => {
    setSelectedOrder(order)
    setCustomerNote(order.notes || "")
    setIsNoteDialogOpen(true)
  }

  const handleSaveNote = () => {
    if (!selectedOrder) return

    const updatedOrder = { ...selectedOrder, notes: customerNote }
    updateOrder(updatedOrder)

    setOrders(orders.map((order) => (order.id === selectedOrder.id ? updatedOrder : order)))

    toast({
      title: "Note Saved",
      description: "Customer note has been updated successfully.",
    })

    setIsNoteDialogOpen(false)
  }

  const filteredOrders = orders
    .filter((order) => {
      // Filter by tab
      if (activeTab !== "all" && order.status !== activeTab) return false

      // Filter by search query
      if (searchQuery) {
        const customer = customers[order.customerId]
        const searchLower = searchQuery.toLowerCase()

        return (
          order.id.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          (customer?.email && customer.email.toLowerCase().includes(searchLower))
        )
      }

      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleGenerateInvoice = (order: Order) => {
    // In a real app, this would generate a PDF invoice
    alert(`Invoice for Order #${order.id} would be generated here.`)
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <div className="w-64">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")}>
            All Orders
          </Button>
          <Button
            variant={activeTab === "pending_payment" ? "default" : "outline"}
            onClick={() => setActiveTab("pending_payment")}
          >
            Pending Payment
          </Button>
          <Button
            variant={activeTab === "processing" ? "default" : "outline"}
            onClick={() => setActiveTab("processing")}
          >
            Processing
          </Button>
          <Button
            variant={activeTab === "in_transit" ? "default" : "outline"}
            onClick={() => setActiveTab("in_transit")}
          >
            In Transit
          </Button>
          <Button variant={activeTab === "delivered" ? "default" : "outline"} onClick={() => setActiveTab("delivered")}>
            Delivered
          </Button>
        </div>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No orders found matching the selected filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>
                    Placed on {formatDate(order.createdAt)} by {order.customerName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    disabled={order.status === "pending_payment" || order.status === "cancelled"}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => handleAddNote(order)}>
                    Add Note
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleGenerateInvoice(order)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Invoice
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
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <div className="text-sm border rounded-md p-3">
                        <p className="font-medium">{order.customerName}</p>
                        {customers[order.customerId] && (
                          <>
                            <p>Email: {customers[order.customerId].email}</p>
                            {customers[order.customerId].phone && <p>Phone: {customers[order.customerId].phone}</p>}
                          </>
                        )}
                        <div className="mt-2">
                          <p className="font-medium">Shipping Address:</p>
                          <p className="whitespace-pre-line">{order.shippingAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Payment Information</h3>
                      <div className="text-sm border rounded-md p-3">
                        {payments[order.id] ? (
                          <div className="space-y-1">
                            <p>
                              <span className="font-medium">Method:</span>{" "}
                              {payments[order.id].method === "credit_card"
                                ? "Credit Card"
                                : payments[order.id].method === "bank_transfer"
                                  ? "Bank Transfer"
                                  : "Cash on Delivery"}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span> {payments[order.id].status}
                            </p>
                            {payments[order.id].transactionId && (
                              <p>
                                <span className="font-medium">Transaction ID:</span> {payments[order.id].transactionId}
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

                {order.notes && (
                  <div className="mt-4 border rounded-md p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Customer Notes</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleAddNote(order)}>
                        Edit
                      </Button>
                    </div>
                    <p className="mt-2 text-sm">{order.notes}</p>
                  </div>
                )}

                {order.status === "in_transit" && (
                  <div className="mt-4 border rounded-md p-4 bg-muted/50">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      <h3 className="font-semibold">Delivery Status</h3>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Update Tracking Information
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customer Note</DialogTitle>
              <DialogDescription>
                Add or update notes for this order. These notes will be visible to the customer.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer-note">Note</Label>
                <Textarea
                  id="customer-note"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  rows={5}
                  placeholder="Enter notes for the customer..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNote}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}
