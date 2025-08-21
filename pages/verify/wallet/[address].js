import React from "react";
import Header from "@/components/layout/Header";
import Center from "@/components/layout/Center";
import WalletInformation from "@/components/verify/wallet/WalletInformation";

const WalletInfoPage = () => {
  return (
    <>
      <Header back={true} />
      <Center>
        <WalletInformation />
      </Center>
    </>
  );
};

export default WalletInfoPage;