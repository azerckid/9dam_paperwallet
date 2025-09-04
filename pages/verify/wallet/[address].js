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

// 동적 라우팅 페이지의 정적 생성을 비활성화
export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default WalletInfoPage;