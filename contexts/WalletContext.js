import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletInfo, setWalletInfo] = useState({
    walletId: 0,
    address: "",
    balance: null,
    balanceError: "",
    passwordCount: 0,
    isRegistered: false,
    isProtected: false,
    lastUpdate: "",
  });

  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchPasswordCount = async (address) => {
    if (!address) return 0;
    try {
      const response = await fetch("/api/wallet/findWalletIdByAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: address }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const walletId = await response.json();
      if (!walletId) return 0;

      const pwRes = await fetch("/api/password/getPasswords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAccountId: walletId }),
      });
      if (!pwRes.ok) throw new Error("Failed to fetch passwords");
      const pwData = await pwRes.json();
      const updatedAt = pwData[pwData.length - 1].updated_at;
      return {
        passwordCount: Array.isArray(pwData) ? pwData.length : 0,
        lastUpdate:
          Array.isArray(pwData) && pwData.length > 0
            ? pwData[pwData.length - 1].updated_at
            : "",
      };
    } catch {
      return { passwordCount: 0, lastUpdate: "" };
    }
  };

  const fetchBalance = async (address) => {
    const balanceResponse = await fetch(
      `/api/proxy-balance?address=${encodeURIComponent(address.trim())}`
    );

    let balance = null;
    let balanceError = "";

    if (balanceResponse.ok) {
      const balanceData = await balanceResponse.json();
      if (
        balanceData &&
        typeof balanceData.txHistory?.balanceSat === "number"
      ) {
        balance = balanceData.txHistory.balanceSat;
        balance = balance / 100000000;
      } else {
        balanceError = "잔액 정보 없음";
      }
    } else {
      balanceError = "잔액 조회 실패";
    }

    return { balance, balanceError };
  };

  const fetchWalletId = async (address) => {
    const response = await fetch("/api/wallet/findWalletIdByAddress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account: address }),
    });
    const walletId = await response.json();
    return walletId;
  };

  const fetchWalletInfo = async (address) => {
    if (!address) return null;
    setIsLoading(true);
    setError(null);

    try {
      // 1. 비밀번호 개수
      const { passwordCount, lastUpdate } = await fetchPasswordCount(address);
      // 2. 잔액 조회
      const { balance, balanceError } = await fetchBalance(address);
      // 3. 지갑 id 조회
      const walletId = await fetchWalletId(address);

      const newWalletInfo = {
        walletId,
        address,
        balance,
        balanceError,
        passwordCount,
        isRegistered: passwordCount > 0,
        lastUpdate: lastUpdate,
      };

      setWalletInfo(newWalletInfo);
      return newWalletInfo;
    } catch (error) {
      console.error("지갑 정보 조회 실패:", error);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateWalletInfo = (newInfo) => {
    setWalletInfo((prev) => ({ ...prev, ...newInfo }));
  };

  const setVerified = (verified) => {
    setIsVerified(verified);
  };

  return (
    <WalletContext.Provider
      value={{
        walletInfo,
        // walletInfo: {
        //   address: walletInfo.address,
        //   balance: walletInfo.balance,
        //   balanceError: walletInfo.balanceError,
        //   passwordCount: 0,
        //   isRegistered: false,
        //   isProtected: false,
        // },
        isVerified,
        setIsVerified,
        updateWalletInfo,
        fetchWalletInfo,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
