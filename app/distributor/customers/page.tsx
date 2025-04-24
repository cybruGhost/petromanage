"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Copy, Plus, UserPlus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  addUser,
  formatDate,
  generateDistributorCode,
  getCustomersByDistributorId,
  getOrdersByCustomerId,
} from "@/lib/local-storage"
import type { User } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

export default function DistributorCustomers() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<User[]>([])
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [distributorCode, setDistributorCode] = useState("")
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user) {
      // Load customers from localStorage
      setCustomers(getCustomersByDistributorId(user.id))
    }
  }, [user])

  if (!user || user.role !== "distributor") {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCustomer((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCustomer = () => {
    try {
      // Validate inputs
      if (!newCustomer.name || !newCustomer.email || !newCustomer.password) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Add new customer
      const customerToAdd = {
        name: newCustomer.name,
        email: newCustomer.email,
        password: newCustomer.password,
        role: "customer" as const,
        distributorId: user.id,
        address: newCustomer.address,
        phone: newCustomer.phone,
      }

      const savedCustomer = addUser(customerToAdd)
      setCustomers([...customers, savedCustomer])

      toast({
        title: "Customer Added",
        description: `${newCustomer.name} has been added as your customer.`,
      })

      setNewCustomer({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer. Email may already be in use.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateCode = () => {
    if (!user) return

    const code = generateDistributorCode(user.id)
    setDistributorCode(code)
    setIsCodeDialogOpen(true)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(distributorCode)
    toast({
      title: "Code Copied",
      description: "Distributor code copied to clipboard.",
    })
  }

  const getCustomerOrderCount = (customerId: string) => {
    return getOrdersByCustomerId(customerId).length
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleGenerateCode}>
              Generate Code
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>Enter the details for the new customer.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newCustomer.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newCustomer.password}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newCustomer.phone}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="address" className="text-right pt-2">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={newCustomer.address}
                      onChange={handleInputChange}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddCustomer}>
                    Add Customer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Customers</CardTitle>
            <CardDescription>Manage your registered customers</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No customers found matching your search." : "You don't have any customers yet."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Customer
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || "—"}</TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>{getCustomerOrderCount(customer.id)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/distributor/customers/${customer.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Distributor Registration Code</DialogTitle>
              <DialogDescription>
                Share this code with customers to allow them to register under your distributorship.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 p-4 border rounded-md bg-muted">
              <code className="flex-1 font-mono text-sm">{distributorCode}</code>
              <Button variant="outline" size="icon" onClick={handleCopyCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsCodeDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}
