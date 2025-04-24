"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  date: string
}

export function NotificationsPopover() {
  const { user } = useAuth()

  // Mock notifications - in a real app, these would come from the database
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Order Status Update",
      message: "Your order #1234 has been processed and is now in transit.",
      read: false,
      date: "2 hours ago",
    },
    {
      id: "2",
      title: "New Product Available",
      message: "Premium Diesel is now available for ordering.",
      read: false,
      date: "1 day ago",
    },
    {
      id: "3",
      title: "Payment Received",
      message: "Payment for order #1233 has been received. Thank you!",
      read: true,
      date: "3 days ago",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-80 overflow-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${notification.read ? "" : "bg-muted"}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-medium">{notification.title}</h5>
                  <span className="text-xs text-muted-foreground">{notification.date}</span>
                </div>
                <p className="text-sm">{notification.message}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
