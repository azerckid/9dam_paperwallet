import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

import Header from "@/components/layout/Header";
import Center from "@/components/layout/Center";
import RegisterPassword from "@/components/verify/register/RegisterPassword";
import RegisterSuccess from "@/components/verify/register/RegisterSuccess";

const RegisterPwdPage = () => {
  const router = useRouter();
  const { address, verified } = router.query;
  const { fetchWalletInfo, isVerified } = useWallet();
  const [onSuccess, setOnSuccess] = useState(false);

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!address) return;

      try {
        const info = await fetchWalletInfo(address);
        // console.log(info);
        // console.log("isVerified: ", isVerified);

        if (info) {
          const isVerifiedFromURL = verified === "true";

          // 1) 첫 저장의 경우
          if (info.passwordCount === 0) return;
          // 2) 기존 비밀번호가 있고 검증 되지 않은 경우
          if (info.passwordCount > 0 && !isVerified && !isVerifiedFromURL) {
            router.push(`/verify/check/${address}`);
            return;
          }
          // 3) 검증된 상태에서 추가 등록하는 경우
          if (isVerifiedFromURL) return;
        }
      } catch (error) {
        console.error("지갑 상태 확인 실패:", error);
      }
    };

    checkWalletStatus();
  }, [address]);

  return (
    <>
      <Header back={true} />
      <Center>
        {!onSuccess ? (
          <RegisterPassword onSuccess={setOnSuccess} />
        ) : (
          <RegisterSuccess />
        )}
      </Center>
    </>
  );
};

export default RegisterPwdPage;
