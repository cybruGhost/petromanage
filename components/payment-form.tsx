"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, DollarSign, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { addPayment, formatCurrency, updateOrder } from "@/lib/local-storage"
import type { Order, PaymentMethod } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

interface PaymentFormProps {
  order: Order
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentForm({ order, onSuccess, onCancel }: PaymentFormProps) {
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Validate card details if credit card payment
      if (paymentMethod === "credit_card") {
        if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
          throw new Error("Please fill in all card details")
        }

        if (cardDetails.cardNumber.length < 16) {
          throw new Error("Invalid card number")
        }

        if (cardDetails.cvv.length < 3) {
          throw new Error("Invalid CVV")
        }
      }

      // Create payment record
      const payment = addPayment({
        orderId: order.id,
        amount: order.total,
        method: paymentMethod,
        status: paymentMethod === "cash_on_delivery" ? "pending" : "completed",
        transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        cardLast4: paymentMethod === "credit_card" ? cardDetails.cardNumber.slice(-4) : undefined,
      })

      // Update order status
      updateOrder({
        ...order,
        status: paymentMethod === "cash_on_delivery" ? "processing" : "processing",
      })

      toast({
        title: "Payment Successful",
        description: `Your payment of ${formatCurrency(order.total)} has been processed.`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred during payment processing.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Complete your order by providing payment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Order Summary</h3>
            <div className="mt-3 space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center gap-2 font-normal">
                  <CreditCard className="h-4 w-4" />
                  Credit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex items-center gap-2 font-normal">
                  <DollarSign className="h-4 w-4" />
                  Bank Transfer
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 font-normal">
                  <Truck className="h-4 w-4" />
                  Cash on Delivery
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "credit_card" && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4111 1111 1111 1111"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  maxLength={16}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "bank_transfer" && (
            <div className="rounded-md border p-4 space-y-2">
              <p className="font-medium">Bank Transfer Instructions</p>
              <p className="text-sm text-muted-foreground">
                Please transfer the total amount to the following account:
              </p>
              <div className="text-sm">
                <p>Bank: National Bank</p>
                <p>Account Name: PetroManage Inc.</p>
                <p>Account Number: 1234567890</p>
                <p>Reference: Order #{order.id}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your order will be processed once payment is confirmed.
              </p>
            </div>
          )}

          {paymentMethod === "cash_on_delivery" && (
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">
                You will pay the full amount when your order is delivered. Please ensure you have the exact amount
                ready.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : `Pay ${formatCurrency(order.total)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
