import React from "react";
import Header from "../../../components/Layout/Header";
import Center from "../../../components/Layout/Center";
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