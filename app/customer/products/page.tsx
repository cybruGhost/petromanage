"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addOrder, getProducts } from "@/lib/local-storage"
import type { Product } from "@/lib/local-storage"

export default function CustomerProducts() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState("0")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Load products from localStorage
    setProducts(getProducts())
  }, [])

  if (!user || user.role !== "customer") {
    return null
  }

  const handleOrderSubmit = () => {
    if (!selectedProduct || !user) return

    const orderItems = [
      {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        quantity: Number(quantity),
        price: selectedProduct.price,
        total: Number(quantity) * selectedProduct.price,
      },
    ]

    const total = orderItems.reduce((sum, item) => sum + item.total, 0)

    // Create a new order
    addOrder({
      customerId: user.id,
      customerName: user.name,
      distributorId: user.distributorId || "",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "Processing",
      total,
      items: orderItems,
    })

    toast({
      title: "Order Placed",
      description: `You've ordered ${quantity} ${selectedProduct.unit} of ${selectedProduct.name}`,
    })

    setIsDialogOpen(false)
    setQuantity("0")
    setSelectedProduct(null)
  }

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Available Products</h1>
        <p className="text-muted-foreground">Browse and order petroleum products from your distributor</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">per {product.unit}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleOrderClick(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Order Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Order</DialogTitle>
              <DialogDescription>
                {selectedProduct ? `Order ${selectedProduct.name} from your distributor` : "Select a product to order"}
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product" className="text-right">
                    Product
                  </Label>
                  <div className="col-span-3">
                    <p className="font-medium">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${selectedProduct.price.toFixed(2)} per {selectedProduct.unit}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="col-span-3"
                    min="1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="total" className="text-right">
                    Total
                  </Label>
                  <div className="col-span-3 font-bold">
                    ${(Number.parseFloat(quantity) * selectedProduct.price).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleOrderSubmit}
                disabled={!selectedProduct || Number.parseFloat(quantity) <= 0}
              >
                Place Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}
