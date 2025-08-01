import Header from "@/components/Layout/Header";
import Center from "@/components/Layout/Center";
import WalletInformation from "@/components/WalletInformation";

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
