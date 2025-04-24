// Types for our data models
export type User = {
  id: string
  name: string
  email: string
  role: "customer" | "distributor" | "admin"
  distributorId?: string
  password: string // Note: In a real app, never store plain text passwords
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
}

export type OrderItem = {
  productId: string
  name: string
  quantity: number
  price: number
  total: number
}

export type Order = {
  id: string
  customerId: string
  customerName: string
  distributorId: string
  date: string
  status: "Processing" | "In Transit" | "Delivered" | "Cancelled"
  total: number
  items: OrderItem[]
}

// Initialize localStorage with default data if empty
export const initializeLocalStorage = () => {
  if (typeof window === "undefined") return

  // Initialize users if not exists
  if (!localStorage.getItem("users")) {
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        password: "password",
      },
      {
        id: "2",
        name: "Distributor User",
        email: "distributor@example.com",
        role: "distributor",
        password: "password",
      },
      {
        id: "3",
        name: "Customer User",
        email: "customer@example.com",
        role: "customer",
        distributorId: "2",
        password: "password",
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }

  // Initialize products if not exists
  if (!localStorage.getItem("products")) {
    const defaultProducts: Product[] = [
      { id: "1", name: "Premium Gasoline", category: "Fuel", price: 4.25, stock: 5000, unit: "Liters" },
      { id: "2", name: "Regular Gasoline", category: "Fuel", price: 3.75, stock: 7500, unit: "Liters" },
      { id: "3", name: "Diesel", category: "Fuel", price: 3.95, stock: 6000, unit: "Liters" },
      { id: "4", name: "Kerosene", category: "Fuel", price: 3.5, stock: 2000, unit: "Liters" },
      { id: "5", name: "Engine Oil", category: "Lubricant", price: 25.99, stock: 500, unit: "Bottles" },
      { id: "6", name: "Transmission Fluid", category: "Lubricant", price: 18.5, stock: 350, unit: "Bottles" },
    ]
    localStorage.setItem("products", JSON.stringify(defaultProducts))
  }

  // Initialize orders if not exists
  if (!localStorage.getItem("orders")) {
    const defaultOrders: Order[] = [
      {
        id: "1234",
        customerId: "3",
        customerName: "Customer User",
        distributorId: "2",
        date: "April 15, 2025",
        status: "Processing",
        total: 750.0,
        items: [
          { productId: "1", name: "Premium Gasoline", quantity: 100, price: 4.25, total: 425.0 },
          { productId: "5", name: "Engine Oil", quantity: 10, price: 25.99, total: 259.9 },
        ],
      },
      {
        id: "1233",
        customerId: "3",
        customerName: "Customer User",
        distributorId: "2",
        date: "April 2, 2025",
        status: "In Transit",
        total: 1200.0,
        items: [
          { productId: "2", name: "Regular Gasoline", quantity: 200, price: 3.75, total: 750.0 },
          { productId: "3", name: "Diesel", quantity: 100, price: 3.95, total: 395.0 },
        ],
      },
      {
        id: "1232",
        customerId: "3",
        customerName: "Customer User",
        distributorId: "2",
        date: "March 20, 2025",
        status: "Delivered",
        total: 950.0,
        items: [
          { productId: "4", name: "Kerosene", quantity: 150, price: 3.5, total: 525.0 },
          { productId: "6", name: "Transmission Fluid", quantity: 20, price: 18.5, total: 370.0 },
        ],
      },
    ]
    localStorage.setItem("orders", JSON.stringify(defaultOrders))
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

export const addUser = (user: Omit<User, "id">): User => {
  const users = getUsers()
  const newUser = {
    ...user,
    id: Math.random().toString(36).substring(2, 9),
  }
  localStorage.setItem("users", JSON.stringify([...users, newUser]))
  return newUser
}

export const updateUser = (user: User): User => {
  const users = getUsers()
  const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
  localStorage.setItem("users", JSON.stringify(updatedUsers))
  return user
}

export const deleteUser = (id: string): void => {
  const users = getUsers()
  const updatedUsers = users.filter((user) => user.id !== id)
  localStorage.setItem("users", JSON.stringify(updatedUsers))
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

export const addProduct = (product: Omit<Product, "id">): Product => {
  const products = getProducts()
  const newProduct = {
    ...product,
    id: Math.random().toString(36).substring(2, 9),
  }
  localStorage.setItem("products", JSON.stringify([...products, newProduct]))
  return newProduct
}

export const updateProduct = (product: Product): Product => {
  const products = getProducts()
  const updatedProducts = products.map((p) => (p.id === product.id ? product : p))
  localStorage.setItem("products", JSON.stringify(updatedProducts))
  return product
}

export const deleteProduct = (id: string): void => {
  const products = getProducts()
  const updatedProducts = products.filter((product) => product.id !== id)
  localStorage.setItem("products", JSON.stringify(updatedProducts))
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

export const addOrder = (order: Omit<Order, "id">): Order => {
  const orders = getOrders()
  const newOrder = {
    ...order,
    id: Math.random().toString(36).substring(2, 9),
  }
  localStorage.setItem("orders", JSON.stringify([...orders, newOrder]))
  return newOrder
}

export const updateOrder = (order: Order): Order => {
  const orders = getOrders()
  const updatedOrders = orders.map((o) => (o.id === order.id ? order : o))
  localStorage.setItem("orders", JSON.stringify(updatedOrders))
  return order
}

export const deleteOrder = (id: string): void => {
  const orders = getOrders()
  const updatedOrders = orders.filter((order) => order.id !== id)
  localStorage.setItem("orders", JSON.stringify(updatedOrders))
}

// Get customers by distributor ID
export const getCustomersByDistributorId = (distributorId: string): User[] => {
  return getUsers().filter((user) => user.role === "customer" && user.distributorId === distributorId)
}

// Get all distributors
export const getDistributors = (): User[] => {
  return getUsers().filter((user) => user.role === "distributor")
}
