import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

import Header from "../../../components/Layout/Header";
import Center from "../../../components/Layout/Center";
import RegisterPassword from "@/components/verify/register/RegisterPassword";
import RegisterSuccess from "@/components/verify/register/RegisterSuccess";

const RegisterPwdPage = () => {
  const router = useRouter();
  const { address, verified } = router.query;
  const { fetchWalletInfo, fetchVerifiedWalletInfo, isVerified, isLoading } = useWallet();
  const [onSuccess, setOnSuccess] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!address) return;

      try {
        setIsPageLoading(true);

        // 검증된 상태에서 추가 등록하는 경우 최적화된 정보 조회
        const isVerifiedFromURL = verified === "true";
        let info;

        if (isVerifiedFromURL && walletInfo?.walletId) {
          // 이미 지갑 정보가 있고 검증된 상태라면 빠른 조회
          info = await fetchVerifiedWalletInfo(address, walletInfo.walletId);
        } else {
          // 일반적인 정보 조회
          info = await fetchWalletInfo(address, !isVerifiedFromURL);
        }

        if (info) {
          // 1) 첫 저장의 경우
          if (info.passwordCount === 0) {
            setIsPageLoading(false);
            return;
          }
          // 2) 기존 비밀번호가 있고 검증 되지 않은 경우
          if (info.passwordCount > 0 && !isVerified && !isVerifiedFromURL) {
            router.push(`/verify/check/${address}`);
            return;
          }
          // 3) 검증된 상태에서 추가 등록하는 경우
          if (isVerifiedFromURL) {
            setIsPageLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("지갑 상태 확인 실패:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    checkWalletStatus();
  }, [address, fetchWalletInfo, isVerified, router, verified]);

  // 로딩 스켈레톤 컴포넌트
  const LoadingSkeleton = () => (
    <div className="min-h-screen">
      <main className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex justify-center items-center rounded-full bg-blue-100">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">지갑 정보를 불러오는 중...</h2>
          <p className="text-gray-600">잠시만 기다려 주세요.</p>
        </div>

        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>

          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <>
      <Header back={true} />
      <Center>
        {isPageLoading ? (
          <LoadingSkeleton />
        ) : !onSuccess ? (
          <RegisterPassword onSuccess={setOnSuccess} />
        ) : (
          <RegisterSuccess />
        )}
      </Center>
    </>
  );
};

export default RegisterPwdPage;