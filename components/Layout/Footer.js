import React from "react";
import Link from "next/link";
import { Mail, MessageCircle, Play } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";

const Footer = () => {
  const menuItems = [
    { href: EXTERNAL_LINKS.FAQ, label: "문의하기", icon: <Mail /> },
    {
      href: EXTERNAL_LINKS.KAKAO_OPENCHAT,
      label: "오픈채팅",
      icon: <MessageCircle />,
    },
    {
      href: EXTERNAL_LINKS.GUIDE_0,
      label: "가이드 문서",
      icon: <Play />,
    },
  ];

  return (
    <div>
      <footer className="bg-[#1F2937] text-[#D1D5DB] py-8 md:py-14">
        <div className="container flex flex-col gap-6 mx-auto px-4 text-center">
          <p>
            MOBICK SHELL은 MOBICK 종이지갑의 위조 방지와 거래 안전을 위한 검증
            플랫폼입니다.
          </p>
          <div className="flex justify-center space-x-6 md:space-x-10 text-[#9CA3AF]">
            {menuItems.map((menu, index) => (
              <Link
                key={index}
                href={menu.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 hover:font-semibold"
              >
                {menu.icon}
                {menu.label}
              </Link>
            ))}
          </div>
          <div className="text-[#6B7280] text-sm flex flex-col gap-3">
            <p>Version 1.0.0 BETA</p>
            <p>&copy; 2024 MOBICK SHELL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
