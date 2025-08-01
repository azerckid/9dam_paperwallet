import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

const Header = ({ back }) => {
  const router = useRouter();
  return (
    <div>
      {/* Header - Desktop */}
      <header className="fixed w-full hidden md:flex items-center bg-white justify-between h-20 px-10">
        {back ? (
          <div
            className="flex items-center gap-2 cursor-pointer hover:font-semibold"
            onClick={() => router.back()}
          >
            <ArrowLeft />
            뒤로
          </div>
        ) : (
          <Link href="/">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="MOGA Logo" className="w-10 h-10" />
              <span className="text-gray-800 font-semibold text-xl">MOGA</span>
            </div>
          </Link>
        )}
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-[#FEF3C7] text-[#92400E] rounded-full text-sm font-medium">
            BETA
          </div>
        </div>
      </header>

      {/* Header - Mobile */}
      <header className="fixed flex w-full md:hidden items-center bg-white justify-between h-16 px-4">
        {back ? (
          <div
            className="flex items-center gap-2 cursor-pointer text-sm md:text-base hover:font-semibold"
            onClick={() => router.back()}
          >
            <ArrowLeft />
            뒤로
          </div>
        ) : (
          <Link href="/">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="MOGA Logo" className="w-10 h-10" />
              <span className="text-gray-800 font-semibold text-xl">MOGA</span>
            </div>
          </Link>
        )}
        <div className="px-3 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs font-medium">
          BETA
        </div>
      </header>
    </div>
  );
};

export default Header;
