"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Filter, Search, ShoppingCart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, getProducts } from "@/lib/local-storage"
import type { Product } from "@/lib/local-storage"

export default function CustomerProducts() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState("1")
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])

  useEffect(() => {
    // Load products from localStorage
    const allProducts = getProducts()
    setProducts(allProducts)
    setFilteredProducts(allProducts)

    // Load cart from localStorage
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error loading cart:", error)
        }
      }
    }
  }, [user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && cart.length >= 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart))
    }
  }, [cart, user])

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    setFilteredProducts(filtered)
  }, [searchQuery, categoryFilter, products])

  if (!user || user.role !== "customer") {
    return null
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return

    const quantityNum = Number.parseInt(quantity)
    if (quantityNum <= 0 || quantityNum > selectedProduct.stock) {
      toast({
        title: "Invalid Quantity",
        description: `Please enter a quantity between 1 and ${selectedProduct.stock}.`,
        variant: "destructive",
      })
      return
    }

    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item) => item.product.id === selectedProduct.id)

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += quantityNum
      setCart(updatedCart)
    } else {
      // Add new product to cart
      setCart([...cart, { product: selectedProduct, quantity: quantityNum }])
    }

    toast({
      title: "Added to Cart",
      description: `${quantityNum} ${selectedProduct.unit} of ${selectedProduct.name} added to cart.`,
    })

    setIsOrderDialogOpen(false)
    setSelectedProduct(null)
    setQuantity("1")
  }

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product)
    setIsOrderDialogOpen(true)
  }

  const getUniqueCategories = () => {
    const categories = new Set(products.map((product) => product.category))
    return Array.from(categories)
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Available Products</h1>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <Image
                    src={product.imageUrl || "/placeholder.svg?height=200&width=400"}
                    alt={product.name}
                    width={400}
                    height={200}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-2xl font-bold">{formatCurrency(product.price)}</div>
                  <p className="text-sm text-muted-foreground">per {product.unit}</p>
                  {product.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleOrderClick(product)} disabled={product.stock <= 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Cart</DialogTitle>
              <DialogDescription>
                {selectedProduct ? `Add ${selectedProduct.name} to your cart` : "Select a product to order"}
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedProduct.imageUrl || "/placeholder.svg?height=80&width=80"}
                    alt={selectedProduct.name}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">{selectedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(selectedProduct.price)} per {selectedProduct.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.stock} {selectedProduct.unit} available
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
                    max={selectedProduct.stock.toString()}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="total" className="text-right">
                    Total
                  </Label>
                  <div className="col-span-3 font-bold">
                    {formatCurrency(Number.parseFloat(quantity) * selectedProduct.price)}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddToCart}
                disabled={!selectedProduct || Number.parseFloat(quantity) <= 0}
              >
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}
