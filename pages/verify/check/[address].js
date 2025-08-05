import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

import Header from "@/components/layout/Header";
import Center from "@/components/layout/Center";

const CheckPwdPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const { fetchWalletInfo } = useWallet();

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!address) return;
      try {
        const info = await fetchWalletInfo(address);
        console.log(info);
        if (info) {
          if (info.passwordCount == 0) {
            router.push(`/verify/wallet/${address}`);
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
      <Center></Center>
    </>
  );
};

export default CheckPwdPage;
