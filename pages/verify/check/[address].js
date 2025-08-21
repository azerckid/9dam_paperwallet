import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

import Header from "../../../components/Layout/Header";
import Center from "../../../components/Layout/Center";
import CheckPassword from "@/components/verify/check/CheckPassword";
import CheckSuccess from "@/components/verify/check/CheckSuccess";

const CheckPwdPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const { walletInfo, fetchWalletInfo, isVerified } = useWallet();
  const [allPasswordsCorrect, setAllPasswordsCorrect] = useState(false);

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!address) return;
      try {
        const info = await fetchWalletInfo(address);
        if (info) {
          if (info.passwordCount === 0) {
            router.push(`/verify/wallet/${address}`);
            return;
          }
        }
      } catch (error) {
        console.error("지갑 상태 확인 실패:", error);
      }
    };

    checkWalletStatus();
  }, [address, fetchWalletInfo, router]);

  return (
    <>
      <Header back={true} />
      <Center>
        {walletInfo && walletInfo.passwordCount > 0 && !allPasswordsCorrect && (
          <CheckPassword setAllPasswordsCorrect={setAllPasswordsCorrect} />
        )}
        {allPasswordsCorrect && isVerified && <CheckSuccess />}
      </Center>
    </>
  );
};

export default CheckPwdPage;