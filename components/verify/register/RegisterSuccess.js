import React from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

import Title from "../Title";
import RegisterInfoCard from "./RegisterInfoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, ShieldCheck } from "lucide-react";

const RegisterSuccess = () => {
  const router = useRouter();
  const { walletInfo } = useWallet();

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
        <div className="w-20 h-20 md:w-22 md:h-22 flex justify-center items-center rounded-full bg-[#F0FDF4] text-[#10B981] text-4xl">
          <CircleCheckBig size={48} />
        </div>
        <Title
          title="등록 완료!"
          subTitle="지갑이 성공적으로 등록되었습니다."
        />
        <RegisterInfoCard walletInfo={walletInfo} />
        <Card variant="noticeGreen">
          <CardHeader variant="noticeGreen">
            <CardTitle>
              <ShieldCheck className="text-[#10B981]" />
              보안 완료
            </CardTitle>
          </CardHeader>
          <CardContent variant="noticeGreen">
            새로운 비밀번호가 안전하게 등록되어 지갑 보안이 강화되었습니다.
          </CardContent>
        </Card>
        <Button
          variant="defaultGreen"
          size="xl"
          onClick={() => router.push("/")}
        >
          메인으로
        </Button>
      </main>
    </div>
  );
};

export default RegisterSuccess;
