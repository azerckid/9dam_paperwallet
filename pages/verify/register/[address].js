import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

import Header from "@/components/Layout/Header";
import Center from "@/components/Layout/Center";
import RegisterPassword from "@/components/RegisterPassword";
import RegisterSuccess from "@/components/RegisterSuccess";

const RegisterPwdPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const { fetchWalletInfo, isVerified } = useWallet();
  const [onSuccess, setOnSuccess] = useState(false);

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!address) return;

      try {
        const info = await fetchWalletInfo(address);
        console.log(info);
        console.log("isVerified: ", isVerified);

        if (info) {
          if (info.passwordCount > 0 && !isVerified) {
            router.push(`/verify/check/${address}`);
            return;
          }
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
