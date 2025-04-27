"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Trash } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, getProductById, addOrder, getUserById } from "@/lib/local-storage"
import type { Product } from "@/lib/local-storage"
import { PaymentForm } from "@/components/payment-form"

export default function CustomerCart() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [shippingAddress, setShippingAddress] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const [newOrder, setNewOrder] = useState<any>(null)

  useEffect(() => {
    if (user) {
      // Load cart from localStorage
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error loading cart:", error)
        }
      }

      // Load user address if available
      const userDetails = getUserById(user.id)
      if (userDetails?.address) {
        setShippingAddress(userDetails.address)
      }
    }
  }, [user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && cart.length >= 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart))
    }
  }, [cart, user])

  if (!user || user.role !== "customer") {
    return null
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = getProductById(productId)
    if (!product) return

    // Ensure quantity is within valid range
    newQuantity = Math.max(1, Math.min(newQuantity, product.stock))

    setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const handleRemoveItem = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some products before checkout.",
        variant: "destructive",
      })
      return
    }

    setShowShippingForm(true)
  }

  const handleProceedToPayment = () => {
    if (!shippingAddress) {
      toast({
        title: "Shipping Address Required",
        description: "Please enter a shipping address.",
        variant: "destructive",
      })
      return
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    // Create order items
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity,
    }))

    // Create new order
    const order = {
      customerId: user.id,
      customerName: user.name,
      distributorId: user.distributorId || "",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "pending_payment" as const,
      total,
      items: orderItems,
      shippingAddress,
      notes: orderNotes,
    }

    setNewOrder(order)
    setIsCheckingOut(true)
    setShowShippingForm(false)
  }

  const handlePaymentSuccess = () => {
    setIsCheckingOut(false)
    // Clear cart after successful order
    setCart([])
    localStorage.removeItem(`cart_${user.id}`)
    setOrderNotes("")

    toast({
      title: "Order Placed Successfully",
      description: "Your order has been placed and is being processed.",
    })

    router.push("/customer/orders")
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
          <Button variant="outline" onClick={() => router.push("/customer/products")}>
            Continue Shopping
          </Button>
        </div>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => router.push("/customer/products")}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                  <CardDescription>You have {cart.length} items in your cart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg?height=80&width=80"}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.product.price)} per {item.product.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, Number.parseInt(e.target.value) || 1)}
                          className="h-8 w-16 text-center"
                          min="1"
                          max={item.product.stock.toString()}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-24 text-right font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleProceedToCheckout}
                    disabled={showShippingForm || isCheckingOut}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>

              {showShippingForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>Please provide your shipping details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingAddress">Shipping Address *</Label>
                      <Textarea
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Enter your shipping address"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                      <Textarea
                        id="orderNotes"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Any special instructions for your order"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleProceedToPayment}>
                      Proceed to Payment
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        )}

        {isCheckingOut && newOrder && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>Complete your purchase by providing payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm
                order={addOrder(newOrder)}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setIsCheckingOut(false)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}
