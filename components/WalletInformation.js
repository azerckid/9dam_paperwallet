import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

import Title from "./verify/Title";
import WalletInfoCard from "./verify/WalletInfoCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  PlusCircle,
  TriangleAlert,
  SquarePen,
  Play,
  Shield,
  MapPin,
  MessageCircle,
  Info,
  Phone,
} from "lucide-react";

const WalletInformation = () => {
  const router = useRouter();
  const { address } = router.query;
  const { walletInfo, fetchWalletInfo } = useWallet();

  useEffect(() => {
    if (address && address !== walletInfo.address) {
      fetchWalletInfo(address);
    }
  }, [address, walletInfo.address]);

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
        {walletInfo.isRegistered ? (
          walletInfo.isProtected && walletInfo.passwordCount === 1 ? (
            <>
              {/* 사전 등록됨 */}
              <div>
                <div className="mb-4 md:mb-5">
                  <div className="flex gap-1 px-4 py-2 text-sm md:text-base rounded-full bg-[#FEF3C7] w-fit text-[#92400E] font-bold">
                    <Shield className="text-[#F59E0B]" />
                    보호 지갑
                  </div>
                </div>
                <Title
                  title="보호된 지갑입니다"
                  subTitle="이 지갑은 특별 관리 대상입니다"
                />
              </div>
              <WalletInfoCard walletInfo={walletInfo} />
              <Card variant="warning">
                <CardHeader variant="warning">
                  <CardTitle>
                    <TriangleAlert className="text-[#F59E0B]" />
                    보호 지갑 안내
                  </CardTitle>
                </CardHeader>
                <CardContent variant="warning" className="flex flex-col gap-2">
                  <span className="text-base font-semibold">
                    이 지갑은 이벤트/고액권 용도로 사전 등록된 보호 지갑입니다.
                  </span>
                  <span>
                    악의적인 사용자의 무단 등록을 방지하기 위해 MOGA에서 미리
                    보호 조치를 위했습니다.
                  </span>
                </CardContent>
              </Card>
              <Button variant="defaultOrange" size="xl">
                <MapPin />
                가까운 회관 찾기
              </Button>

              <Card className="bg-transparent">
                <CardHeader>
                  <CardTitle>
                    <Phone />
                    문의사항이 있으신가요?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button size="lg" className="text-[#6B7280] w-full">
                    <MessageCircle />
                    고객센터 문의
                  </Button>
                </CardContent>
              </Card>
              <Card variant="noticeBlue">
                <CardHeader variant="noticeBlue">
                  <CardTitle>
                    <Info className="text-[#3B82F6]" />
                    등록 방법 안내
                  </CardTitle>
                </CardHeader>
                <CardContent
                  variant="noticeBlue"
                  className="flex flex-col gap-2"
                >
                  <span className="text-base">
                    실물 소지자는 가까운 회관에 방문하여 비밀번호를 확인 후
                    등록하실 수 있습니다.
                  </span>
                  <span>
                    <span className="text-[#3B82F6]">●</span> 가까운 회관 방문
                  </span>
                  <span>
                    <span className="text-[#3B82F6]">●</span> 실물 지갑 및
                    신분증 지참
                  </span>
                  <span>
                    <span className="text-[#3B82F6]">●</span> 담당자 확인 후
                    비밀번호 등록
                  </span>
                </CardContent>
              </Card>
              <Button variant="defaultGreen" size="xl">
                <SquarePen />
                비밀번호 입력 후 검증하기
              </Button>
            </>
          ) : (
            <>
              {/* 등록됨 */}
              <Title
                title="지갑 정보"
                subTitle="등록된 정보를 확인하고 검증을 진행하세요"
              />
              <WalletInfoCard walletInfo={walletInfo} />
              <Card variant="warning">
                <CardHeader variant="warning">
                  <CardTitle>
                    <TriangleAlert className="text-[#F59E0B]" />
                    위조 지갑 주의
                  </CardTitle>
                </CardHeader>
                <CardContent variant="warning" className="flex flex-col gap-2">
                  <span>
                    이 지갑은 이미 등록되어 있습니다.
                    <br />
                    본인이 등록한 적 없는 지갑이라면,
                    <br />
                    위조 지갑일 수 있습니다.
                  </span>
                  <span>
                    의심스러운 지갑이라면 아래 버튼을 눌러 신고해주세요.
                  </span>
                  <Button variant="warning" size="lg">
                    <TriangleAlert className="text-[#F59E0B]" />
                    문의 / 신고하기
                  </Button>
                </CardContent>
              </Card>
              <Button variant="defaultGreen" size="xl">
                <SquarePen />
                비밀번호 입력 후 검증하기
              </Button>
              <Button variant="destructive" size="lg">
                <Play />
                검증 방법 영상 가이드
              </Button>
            </>
          )
        ) : (
          <>
            {/* 미등록 */}
            <Title
              title="지갑 정보"
              subTitle="새로운 지갑을 등록하고 검증을 시작하세요"
            />
            <WalletInfoCard walletInfo={walletInfo} />
            <Card variant="noticeGreen">
              <CardHeader variant="noticeGreen">
                <CardTitle>
                  <PlusCircle />
                  최초 등록 가능
                </CardTitle>
              </CardHeader>
              <CardContent variant="noticeGreen">
                이 지갑은 아직 등록되지 않았습니다. 최초 등록이 가능합니다.
              </CardContent>
            </Card>
            <Button
              variant="defaultGreen"
              size="xl"
              onClick={() =>
                router.push(`/verify/register/${walletInfo.address}`)
              }
            >
              <Lock />새 비밀번호 등록하기
            </Button>
            <Card variant="destructive">
              <CardHeader variant="destructive">
                <CardTitle>
                  <TriangleAlert />
                  주의사항
                </CardTitle>
              </CardHeader>
              <CardContent
                variant="destructive"
                className="flex flex-col gap-2"
              >
                <span>
                  실물 지갑 정보와 일치하지 않으면 위조 가능성이 있습니다.
                </span>
                <span>문제가 있다면 문의해주세요.</span>
                <Button variant="destructiveInvert" size="lg">
                  <TriangleAlert />
                  문의 / 신고하기
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default WalletInformation;
