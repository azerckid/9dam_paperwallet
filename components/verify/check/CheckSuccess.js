import React from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

import Title from "../Title";
import CheckInfoCard from "./CheckInfoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, CirclePlus } from "lucide-react";

const CheckSuccess = () => {
  const router = useRouter();
  const { walletInfo } = useWallet();

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
        <div className="w-20 h-20 md:w-22 md:h-22 flex justify-center items-center rounded-full bg-[#F0FDF4] text-[#10B981] text-4xl">
          <CircleCheckBig size={48} />
        </div>
        <Title
          title="검증 성공!"
          subTitle="비밀번호가 일치합니다. 새 비밀번호를 등록하시겠습니까?"
        />
        <CheckInfoCard walletInfo={walletInfo} />
        <Card variant="noticeBlue">
          <CardHeader variant="noticeBlue">
            <CardTitle>
              <CirclePlus />
              추가 등록 안내
            </CardTitle>
          </CardHeader>
          <CardContent variant="noticeBlue">
            새로운 비밀번호를 추가로 등록하여 보안을 강화할 수 있습니다.
          </CardContent>
        </Card>
        <Button
          variant="defaultGreen"
          size="xl"
          onClick={() =>
            router.push(`/verify/register/${walletInfo.address}?verified=true`)
          }
        >
          예, 등록하겠습니다
        </Button>
        <Button variant="outline" size="lg" onClick={() => router.push("/")}>
          아니오, 돌아가기
        </Button>
      </main>
    </div>
  );
};

export default CheckSuccess;
