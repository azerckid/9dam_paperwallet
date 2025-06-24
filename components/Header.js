import Link from "next/link";
import Center from "./Center";

export default function Header() {
    return (
        <div className="w-full bg-gray-900 text-white py-4 flex justify-center">
            <nav className="flex space-x-8">
                <Link href="/">
                    <span className="hover:underline">Home</span>
                </Link>
                <Link href="/about">
                    <span className="hover:underline">About</span>
                </Link>
                <Link href="/contact">
                    <span className="hover:underline">Contact</span>
                </Link>
            </nav>
        </div>
    );
}