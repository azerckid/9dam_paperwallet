import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";

export default function WalletInfoPage() {
  const router = useRouter();
  const { address } = router.query;
  const { walletInfo } = useWallet();

  const handleContinue = () => {
    if (walletInfo.isRegistered) {
      router.push(`/verify/check/${address}`);
    } else {
      router.push(`/verify/register/${address}`);
    }
  };

  return (
    <div>
      <h1>지갑 정보</h1>
      <p>주소: {address}</p>
      <p>잔액: {walletInfo.balance}</p>
      <button onClick={handleContinue}>계속하기</button>
    </div>
  );
}
