import React from "react";

import StatusBadge from "../StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Wallet } from "lucide-react";

const CheckInfoCard = ({ walletInfo }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <div className="flex justify-center items-center w-10 h-10 md:w-12 md:h-12 p-2 text-[#10B981]">
            <ShieldCheck />
          </div>
          <CardTitle>
            <div className="text-sm md:text-base font-bold">검증 결과</div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#6B7280]">
              검증된 비밀번호:
            </span>
            <span className="md:text-lg font-bold text-[#10B981]">
              {walletInfo.passwordCount ?? "0"}개 모두 일치
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#6B7280]">
              검증 시간:
            </span>
            <span className="md:text-lg font-bold">방금 전</span>
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

export default CheckInfoCard;
