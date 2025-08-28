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

  const fetchPasswordCount = async (address, walletId = null) => {
    if (!address) return { passwordCount: 0, lastUpdate: "" };
    try {
      let targetWalletId = walletId;

      // walletId가 제공되지 않은 경우에만 조회
      if (!targetWalletId) {
        const response = await fetch("/api/wallet/findWalletIdByAddress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account: address }),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        targetWalletId = await response.json();
        if (!targetWalletId) return { passwordCount: 0, lastUpdate: "" };
      }

      const pwRes = await fetch("/api/password/getPasswords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAccountId: targetWalletId }),
      });
      if (!pwRes.ok) throw new Error("Failed to fetch passwords");
      const pwData = await pwRes.json();
      const updatedAt = pwData[pwData.length - 1]?.updated_at || "";
      return {
        passwordCount: Array.isArray(pwData) ? pwData.length : 0,
        lastUpdate: updatedAt,
        walletId: targetWalletId,
      };
    } catch {
      return { passwordCount: 0, lastUpdate: "", walletId: null };
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

  const fetchWalletInfo = async (address, includeBalance = true) => {
    if (!address) return null;
    setIsLoading(true);
    setError(null);

    try {
      // 1. 비밀번호 개수 (walletId도 함께 가져옴)
      const { passwordCount, lastUpdate, walletId } = await fetchPasswordCount(address);

      let balance = null;
      let balanceError = "";

      // 2. 잔액 조회 (필요한 경우에만)
      if (includeBalance) {
        const balanceResult = await fetchBalance(address);
        balance = balanceResult.balance;
        balanceError = balanceResult.balanceError;
      }

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

  // 비밀번호 등록 후 빠른 업데이트를 위한 함수
  const updatePasswordCount = async (address, walletId) => {
    if (!address || !walletId) return;

    try {
      const { passwordCount, lastUpdate } = await fetchPasswordCount(address, walletId);
      setWalletInfo(prev => ({
        ...prev,
        passwordCount,
        isRegistered: passwordCount > 0,
        lastUpdate,
      }));
    } catch (error) {
      console.error("비밀번호 개수 업데이트 실패:", error);
    }
  };

  // 검증된 상태에서 빠른 정보 조회를 위한 함수
  const fetchVerifiedWalletInfo = async (address, walletId) => {
    if (!address || !walletId) return null;

    try {
      const { passwordCount, lastUpdate } = await fetchPasswordCount(address, walletId);

      const newWalletInfo = {
        walletId,
        address,
        balance: null, // 검증된 상태에서는 잔액 조회 제외
        balanceError: "",
        passwordCount,
        isRegistered: passwordCount > 0,
        lastUpdate,
      };

      setWalletInfo(newWalletInfo);
      return newWalletInfo;
    } catch (error) {
      console.error("검증된 지갑 정보 조회 실패:", error);
      return null;
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
        isVerified,
        setIsVerified,
        updateWalletInfo,
        fetchWalletInfo,
        updatePasswordCount,
        fetchVerifiedWalletInfo,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
