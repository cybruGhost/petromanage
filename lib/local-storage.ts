export type User = {
  id: string
  name: string
  email: string
  role: "customer" | "distributor" | "admin"
  distributorId?: string
  password: string // Note: In a real app, never store plain text passwords
  address?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  distributorId?: string // For distributor-specific products
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export type OrderItem = {
  productId: string
  name: string
  quantity: number
  price: number
  total: number
}

export type PaymentMethod = "credit_card" | "bank_transfer" | "cash_on_delivery"

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"

export type Payment = {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  cardLast4?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = "pending_payment" | "processing" | "in_transit" | "delivered" | "cancelled"

export type Order = {
  id: string
  customerId: string
  customerName: string
  distributorId: string
  date: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  paymentId?: string
  shippingAddress: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Event system for real-time updates
type EventCallback = (data: any) => void
const eventListeners: Record<string, EventCallback[]> = {}

export const addEventListener = (event: string, callback: EventCallback) => {
  if (!eventListeners[event]) {
    eventListeners[event] = []
  }
  eventListeners[event].push(callback)
}

export const removeEventListener = (event: string, callback: EventCallback) => {
  if (!eventListeners[event]) return
  eventListeners[event] = eventListeners[event].filter((cb) => cb !== callback)
}

export const dispatchEvent = (event: string, data: any) => {
  if (!eventListeners[event]) return
  eventListeners[event].forEach((callback) => callback(data))
}

// Helper function to generate timestamps
export const getCurrentTimestamp = () => new Date().toISOString()

// Initialize localStorage with default data if empty
export const initializeLocalStorage = () => {
  if (typeof window === "undefined") return

  // Initialize users if not exists
  if (!localStorage.getItem("users")) {
    const timestamp = getCurrentTimestamp()
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        password: "password",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "2",
        name: "East Region Petroleum",
        email: "distributor@example.com",
        role: "distributor",
        password: "password",
        address: "123 Distribution Ave, Business District",
        phone: "+1 (555) 123-4567",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "3",
        name: "ABC Gas Station",
        email: "customer@example.com",
        role: "customer",
        distributorId: "2",
        password: "password",
        address: "456 Station Rd, City Center",
        phone: "+1 (555) 987-6543",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }

  // Initialize products if not exists
  if (!localStorage.getItem("products")) {
    const timestamp = getCurrentTimestamp()
    const defaultProducts: Product[] = [
      {
        id: "1",
        name: "Premium Gasoline",
        category: "Fuel",
        price: 4.25,
        stock: 5000,
        unit: "Liters",
        description: "High-octane premium gasoline for optimal engine performance.",
        imageUrl: "/placeholder.svg?height=200&width=200",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "2",
        name: "Regular Gasoline",
        category: "Fuel",
        price: 3.75,
        stock: 7500,
        unit: "Liters",
        description: "Standard gasoline for everyday use in most vehicles.",
        imageUrl: "/placeholder.svg?height=200&width=200",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "3",
        name: "Diesel",
        category: "Fuel",
        price: 3.95,
        stock: 6000,
        unit: "Liters",
        description: "High-quality diesel fuel for diesel engines.",
        imageUrl: "/placeholder.svg?height=200&width=200",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "4",
        name: "Kerosene",
        category: "Fuel",
        price: 3.5,
        stock: 2000,
        unit: "Liters",
        description: "Clean-burning kerosene for heating and lighting applications.",
        imageUrl: "/placeholder.svg?height=200&width=200",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "5",
        name: "Engine Oil",
        category: "Lubricant",
        price: 25.99,
        stock: 500,
        unit: "Bottles",
        description: "Premium synthetic engine oil for superior engine protection.",
        imageUrl: "/placeholder.svg?height=200&width=200",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "6",
        name: "Transmission Fluid",
        category: "Lubricant",
        price: 18.5,
        stock: 350,
        unit: "Bottles",
        description: "High-performance transmission fluid for smooth gear shifting.",
        imageUrl: "/placeholder.svg?height=200&width=200",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ]
    localStorage.setItem("products", JSON.stringify(defaultProducts))
  }

  // Initialize orders if not exists
  if (!localStorage.getItem("orders")) {
    const timestamp = getCurrentTimestamp()
    const defaultOrders: Order[] = []
    localStorage.setItem("orders", JSON.stringify(defaultOrders))
  }

  // Initialize payments if not exists
  if (!localStorage.getItem("payments")) {
    const payments: Payment[] = []
    localStorage.setItem("payments", JSON.stringify(payments))
  }
}

// User operations
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

export const getUserById = (id: string): User | undefined => {
  return getUsers().find((user) => user.id === id)
}

export const getUserByEmail = (email: string): User | undefined => {
  return getUsers().find((user) => user.email === email)
}

export const addUser = (user: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
  const users = getUsers()
  const timestamp = getCurrentTimestamp()
  const newUser = {
    ...user,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  localStorage.setItem("users", JSON.stringify([...users, newUser]))

  // Dispatch event for real-time updates
  dispatchEvent("user:created", newUser)

  return newUser
}

export const updateUser = (user: User): User => {
  const users = getUsers()
  const updatedUser = {
    ...user,
    updatedAt: getCurrentTimestamp(),
  }
  const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
  localStorage.setItem("users", JSON.stringify(updatedUsers))

  // Dispatch event for real-time updates
  dispatchEvent("user:updated", updatedUser)

  return updatedUser
}

export const deleteUser = (id: string): void => {
  const users = getUsers()
  const updatedUsers = users.filter((user) => user.id !== id)
  localStorage.setItem("users", JSON.stringify(updatedUsers))

  // Dispatch event for real-time updates
  dispatchEvent("user:deleted", { id })
}

// Product operations
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []
  const products = localStorage.getItem("products")
  return products ? JSON.parse(products) : []
}

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find((product) => product.id === id)
}

export const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
  const products = getProducts()
  const timestamp = getCurrentTimestamp()
  const newProduct = {
    ...product,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  localStorage.setItem("products", JSON.stringify([...products, newProduct]))

  // Dispatch event for real-time updates
  dispatchEvent("product:created", newProduct)

  return newProduct
}

export const updateProduct = (product: Product): Product => {
  const products = getProducts()
  const updatedProduct = {
    ...product,
    updatedAt: getCurrentTimestamp(),
  }
  const updatedProducts = products.map((p) => (p.id === product.id ? updatedProduct : p))
  localStorage.setItem("products", JSON.stringify(updatedProducts))

  // Dispatch event for real-time updates
  dispatchEvent("product:updated", updatedProduct)

  return updatedProduct
}

export const deleteProduct = (id: string): void => {
  const products = getProducts()
  const updatedProducts = products.filter((product) => product.id !== id)
  localStorage.setItem("products", JSON.stringify(updatedProducts))

  // Dispatch event for real-time updates
  dispatchEvent("product:deleted", { id })
}

// Update product stock
export const updateProductStock = (productId: string, quantityChange: number): Product | undefined => {
  const product = getProductById(productId)
  if (!product) return undefined

  const updatedProduct = {
    ...product,
    stock: Math.max(0, product.stock + quantityChange),
    updatedAt: getCurrentTimestamp(),
  }

  updateProduct(updatedProduct)
  return updatedProduct
}

// Order operations
export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return []
  const orders = localStorage.getItem("orders")
  return orders ? JSON.parse(orders) : []
}

export const getOrderById = (id: string): Order | undefined => {
  return getOrders().find((order) => order.id === id)
}

export const getOrdersByCustomerId = (customerId: string): Order[] => {
  return getOrders().filter((order) => order.customerId === customerId)
}

export const getOrdersByDistributorId = (distributorId: string): Order[] => {
  return getOrders().filter((order) => order.distributorId === distributorId)
}

export const addOrder = (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order => {
  const orders = getOrders()
  const timestamp = getCurrentTimestamp()
  const newOrder = {
    ...order,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  localStorage.setItem("orders", JSON.stringify([...orders, newOrder]))

  // Update product stock
  newOrder.items.forEach((item) => {
    updateProductStock(item.productId, -item.quantity)
  })

  // Dispatch event for real-time updates
  dispatchEvent("order:created", newOrder)

  return newOrder
}

export const updateOrder = (order: Order): Order => {
  const orders = getOrders()
  const updatedOrder = {
    ...order,
    updatedAt: getCurrentTimestamp(),
  }
  const updatedOrders = orders.map((o) => (o.id === order.id ? updatedOrder : o))
  localStorage.setItem("orders", JSON.stringify(updatedOrders))

  // Dispatch event for real-time updates
  dispatchEvent("order:updated", updatedOrder)

  return updatedOrder
}

export const deleteOrder = (id: string): void => {
  const orders = getOrders()
  const updatedOrders = orders.filter((order) => order.id !== id)
  localStorage.setItem("orders", JSON.stringify(updatedOrders))

  // Dispatch event for real-time updates
  dispatchEvent("order:deleted", { id })
}

// Payment operations
export const getPayments = (): Payment[] => {
  if (typeof window === "undefined") return []
  const payments = localStorage.getItem("payments")
  return payments ? JSON.parse(payments) : []
}

export const getPaymentById = (id: string): Payment | undefined => {
  return getPayments().find((payment) => payment.id === id)
}

export const getPaymentByOrderId = (orderId: string): Payment | undefined => {
  return getPayments().find((payment) => payment.orderId === orderId)
}

export const addPayment = (payment: Omit<Payment, "id" | "createdAt" | "updatedAt">): Payment => {
  const payments = getPayments()
  const timestamp = getCurrentTimestamp()
  const newPayment = {
    ...payment,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  localStorage.setItem("payments", JSON.stringify([...payments, newPayment]))

  // Update order with payment ID
  const order = getOrderById(payment.orderId)
  if (order) {
    updateOrder({
      ...order,
      paymentId: newPayment.id,
      status: payment.status === "completed" ? "processing" : "pending_payment",
    })
  }

  // Dispatch event for real-time updates
  dispatchEvent("payment:created", newPayment)

  return newPayment
}

export const updatePayment = (payment: Payment): Payment => {
  const payments = getPayments()
  const updatedPayment = {
    ...payment,
    updatedAt: getCurrentTimestamp(),
  }
  const updatedPayments = payments.map((p) => (p.id === payment.id ? updatedPayment : p))
  localStorage.setItem("payments", JSON.stringify(updatedPayments))

  // Update order status if payment status changes
  if (payment.status === "completed") {
    const order = getOrderById(payment.orderId)
    if (order && order.status === "pending_payment") {
      updateOrder({
        ...order,
        status: "processing",
      })
    }
  }

  // Dispatch event for real-time updates
  dispatchEvent("payment:updated", updatedPayment)

  return updatedPayment
}

// Get customers by distributor ID
export const getCustomersByDistributorId = (distributorId: string): User[] => {
  return getUsers().filter((user) => user.role === "customer" && user.distributorId === distributorId)
}

// Get all distributors
export const getDistributors = (): User[] => {
  return getUsers().filter((user) => user.role === "distributor")
}

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Generate distributor code
export const generateDistributorCode = (distributorId: string): string => {
  return `DIST-${distributorId.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}
