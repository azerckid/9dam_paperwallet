import React from "react";
import Divider from "../Layout/Divider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Wallet } from "lucide-react";
import StatusBadge from "./StatusBadge";

const WalletInfoCard = ({ walletInfo }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div
            className={`flex justify-center items-center w-10 h-10 md:w-12 md:h-12 p-2 bg-[#EFF6FF] text-[#3B82F6] ${walletInfo.isProtected && walletInfo.passwordCount == 1 && "bg-[#FEF3C7] text-[#F59E0B]"} rounded-full`}
          >
            <Wallet />
          </div>
          <CardTitle className="flex flex-col items-start gap-1">
            <div className="text-xs md:text-sm text-[#6B7280]">지갑 주소</div>
            <div className="text-sm md:text-base font-bold">
              {walletInfo.address
                ? `${walletInfo.address.slice(0, 10)}...${walletInfo.address.slice(-8)}`
                : "주소 없음"}
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      <Divider />
      <CardContent>
        <div className="flex flex-col gap-2 pt-5 md:pt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#6B7280]">잔고:</span>
            <div>
              <span className="md:text-lg font-bold">
                {walletInfo.balance ?? "0"}{" "}
              </span>
              <span className="md:text-lg font-bold text-[#05B6A2]">
                MOBICK
              </span>
            </div>
          </div>
          {walletInfo.isProtected && walletInfo.passwordCount == 1 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-[#6B7280]">
                  지갑 유형:
                </span>
                <span className="md:text-lg font-bold">이벤트/고액권</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base text-[#6B7280]">
                  등록 기관:
                </span>
                <span className="md:text-lg font-bold">MOGA 관리자</span>
              </div>
            </>
          )}
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

export default WalletInfoCard;
