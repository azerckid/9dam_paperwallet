import React from "react";

import Divider from "../Layout/Divider";
import StatusBadge from "./StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Wallet } from "lucide-react";

const RegisterInfoCard = ({ walletInfo }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <div className="flex justify-center items-center w-10 h-10 md:w-12 md:h-12 p-2 text-[#10B981]">
            <Wallet />
          </div>
          <CardTitle>
            <div className="text-sm md:text-base font-bold">등록 정보</div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#6B7280]">
              지갑 주소:
            </span>
            <span className="md:text-lg font-bold">
              {walletInfo.address
                ? `${walletInfo.address.slice(0, 10)}...${walletInfo.address.slice(-8)}`
                : "주소 없음"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#6B7280]">
              총 비밀번호 수:
            </span>
            <span className="md:text-lg font-bold">
              {walletInfo.passwordCount ?? "0"}개
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#6B7280]">
              마지막 업데이트:
            </span>
            <span className="md:text-lg font-bold">
              {(() => {
                if (!walletInfo.lastUpdate) return "방금 전";
                const last = new Date(walletInfo.lastUpdate);
                const now = new Date();
                const diffMs = now - last;
                const diffMin = Math.floor(diffMs / 60000);
                if (diffMin < 1) return "방금 전";
                return `${diffMin}분 전`;
              })()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#6B7280]">
              등록 상태:
            </span>
            <span className="font-bold">
              <StatusBadge
                passwordCount={walletInfo.passwordCount}
                isRegistered={walletInfo.isRegistered}
                isProtected={walletInfo.isProtected}
              />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterInfoCard;
