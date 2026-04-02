"use client"

import Link from "next/link"
import { Home, Users, Bell, MessageCircle, Menu, Search } from "lucide-react"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: Home, href: "/", label: "Home" },
  { icon: Users, href: "/friends", label: "Friends", count: 0 },
  { icon: Bell, href: "/notifications", label: "Notifications", count: 6 },
  { icon: MessageCircle, href: "/chat", label: "Chat", count: 2 },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 h-[66px] bg-card border-t border-border z-[100] px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      <ul className="flex items-center justify-between h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href} className="relative">
              <Link 
                href={item.href} 
                className={`p-3 block rounded-xl transition-all ${
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground/60 hover:text-primary hover:bg-muted"
                }`}
              >
                <item.icon className={`h-6 w-6 ${isActive ? "fill-current" : ""}`} />
                {item.count > 0 && (
                  <span className="absolute top-2 right-2 w-4.5 h-4.5 bg-primary text-[10px] text-white flex items-center justify-center rounded-full border-2 border-card font-bold">
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
        <li>
          <button className="p-3 block rounded-xl text-muted-foreground/60 hover:text-primary hover:bg-muted transition-all">
            <Menu className="h-6 w-6" />
          </button>
        </li>
      </ul>
    </div>
  )
}
