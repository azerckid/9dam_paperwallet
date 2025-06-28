import Link from "next/link";
import * as React from "react";
import { NavigationMenu } from "../ui/navigation-menu";
import { Sheet } from "../ui/sheet";

export default function Header() {
    const [open, setOpen] = React.useState(false);
    const menuItems = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <div className="w-full bg-white text-black py-4 flex justify-center">
            {/* 데스크탑 네비게이션 */}
            <div className="hidden md:flex">
                <NavigationMenu />
            </div>
            {/* 모바일 햄버거 메뉴 */}
            <div className="flex md:hidden items-center w-full px-4 relative">
                <button
                    className="focus:outline-none mr-2"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#000">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="absolute left-0 right-0 mx-auto text-center font-bold text-lg pointer-events-none select-none">Menu</span>
                <Sheet open={open} onOpenChange={setOpen}>
                    <div className="flex flex-col p-6 space-y-6 h-full bg-white text-black">
                        <button
                            className="self-end mb-4"
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                        >
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#000">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                                <span className="text-lg font-medium hover:underline">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </Sheet>
            </div>
        </div>
    );
}