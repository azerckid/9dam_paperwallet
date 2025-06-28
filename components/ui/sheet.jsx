import * as React from "react"
import { cn } from "@/lib/utils"

export function Sheet({ open, onOpenChange, children }) {
    return (
        <div>
            {open && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)} />
            )}
            <div
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transition-transform duration-300",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
                style={{ willChange: "transform" }}
            >
                {children}
            </div>
        </div>
    )
} 