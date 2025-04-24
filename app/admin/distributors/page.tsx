"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Truck } from "lucide-react"
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
import { addUser, getDistributors } from "@/lib/local-storage"
import type { User } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

export default function AdminDistributors() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [distributors, setDistributors] = useState<User[]>([])
  const [newDistributor, setNewDistributor] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Load distributors from localStorage
    setDistributors(getDistributors())
  }, [])

  if (!user || user.role !== "admin") {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDistributor((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddDistributor = () => {
    try {
      // Add new distributor
      const distributorToAdd = {
        name: newDistributor.name,
        email: newDistributor.email,
        password: newDistributor.password,
        role: "distributor" as const,
      }

      const savedDistributor = addUser(distributorToAdd)
      setDistributors([...distributors, savedDistributor])

      toast({
        title: "Distributor Added",
        description: `${newDistributor.name} has been added as a distributor.`,
      })

      setNewDistributor({
        name: "",
        email: "",
        password: "",
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add distributor. Email may already be in use.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Distributor Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Truck className="mr-2 h-4 w-4" />
                Add Distributor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Distributor</DialogTitle>
                <DialogDescription>Enter the details for the new distributor.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newDistributor.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newDistributor.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newDistributor.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddDistributor}>
                  Add Distributor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Distributors</CardTitle>
            <CardDescription>Manage your petroleum product distributors</CardDescription>
          </CardHeader>
          <CardContent>
            {distributors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">You don't have any distributors yet.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Distributor
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributors.map((distributor) => (
                    <TableRow key={distributor.id}>
                      <TableCell className="font-medium">{distributor.name}</TableCell>
                      <TableCell>{distributor.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          Active
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            View Customers
                          </Button>
                          <Button variant="outline" size="sm">
                            View Orders
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
