import * as React from "react"
import Link from "next/link"

const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
]

export function NavigationMenu({ className = "" }) {
    return (
        <nav className={`flex space-x-8 ${className}`}>
            {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                    <span className="hover:underline">{item.label}</span>
                </Link>
            ))}
        </nav>
    )
} 