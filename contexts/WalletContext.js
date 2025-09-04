import { createContext, useContext, useState, useRef } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletInfo, setWalletInfo] = useState(null); // null로 초기화하여 명확한 상태 구분
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  // 무한 루프 방지를 위한 ref들
  const lastFetchRef = useRef({ address: null, timestamp: 0 });
  const isFetchingRef = useRef(false);

  const fetchPasswordCount = async (address, walletId = null) => {
    if (!address) return { passwordCount: 0, lastUpdate: "" };

    // 중복 호출 방지
    if (isFetchingRef.current) {
      console.log("이미 API 호출 중, 중복 호출 방지");
      return { passwordCount: 0, lastUpdate: "", walletId: null };
    }

    try {
      isFetchingRef.current = true;
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
    } catch (error) {
      console.error("비밀번호 개수 조회 실패:", error);
      return { passwordCount: 0, lastUpdate: "", walletId: null };
    } finally {
      isFetchingRef.current = false;
    }
  };

  const fetchBalance = async (address) => {
    try {
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
    } catch (error) {
      console.error("잔액 조회 실패:", error);
      return { balance: null, balanceError: "잔액 조회 중 오류 발생" };
    }
  };

  const fetchWalletId = async (address) => {
    try {
      const response = await fetch("/api/wallet/findWalletIdByAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: address }),
      });
      if (!response.ok) throw new Error("Failed to fetch wallet ID");
      const walletId = await response.json();
      return walletId;
    } catch (error) {
      console.error("지갑 ID 조회 실패:", error);
      return null;
    }
  };

  const fetchWalletInfo = async (address, includeBalance = true) => {
    if (!address) return null;

    // 중복 호출 방지 (같은 주소, 1초 이내)
    const now = Date.now();
    if (lastFetchRef.current.address === address &&
      now - lastFetchRef.current.timestamp < 1000) {
      console.log("중복 호출 방지:", address);
      return walletInfo;
    }

    // 이미 로딩 중이면 기존 정보 반환
    if (isLoading) {
      console.log("이미 로딩 중, 기존 정보 반환");
      return walletInfo;
    }

    setIsLoading(true);
    setError(null);
    lastFetchRef.current = { address, timestamp: now };

    try {
      console.log("지갑 정보 조회 시작:", address);

      // 1. 비밀번호 개수 (walletId도 함께 가져옴)
      const { passwordCount, lastUpdate, walletId } = await fetchPasswordCount(address);

      if (!walletId) {
        throw new Error("지갑 ID를 찾을 수 없습니다.");
      }

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

      console.log("지갑 정보 설정됨:", newWalletInfo);
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
      console.log("비밀번호 개수 업데이트 시작:", { address, walletId });
      const { passwordCount, lastUpdate } = await fetchPasswordCount(address, walletId);

      setWalletInfo(prev => {
        if (!prev || prev.walletId !== walletId) {
          console.log("이전 지갑 정보가 없거나 다른 지갑, 업데이트 건너뜀");
          return prev;
        }

        const updated = {
          ...prev,
          passwordCount,
          isRegistered: passwordCount > 0,
          lastUpdate,
        };
        console.log("비밀번호 개수 업데이트됨:", updated);
        return updated;
      });
    } catch (error) {
      console.error("비밀번호 개수 업데이트 실패:", error);
    }
  };

  // 검증된 상태에서 빠른 정보 조회를 위한 함수
  const fetchVerifiedWalletInfo = async (address, walletId) => {
    if (!address || !walletId) return null;

    try {
      console.log("검증된 지갑 정보 조회:", { address, walletId });
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

      console.log("검증된 지갑 정보 설정됨:", newWalletInfo);
      setWalletInfo(newWalletInfo);
      return newWalletInfo;
    } catch (error) {
      console.error("검증된 지갑 정보 조회 실패:", error);
      return null;
    }
  };

  const updateWalletInfo = (newInfo) => {
    setWalletInfo((prev) => {
      const updated = { ...prev, ...newInfo };
      // 중요한 변경사항만 로그 출력
      if (newInfo.walletId !== prev?.walletId || newInfo.passwordCount !== prev?.passwordCount) {
        console.log("지갑 정보 업데이트됨:", {
          walletId: updated.walletId,
          passwordCount: updated.passwordCount,
          address: updated.address
        });
      }
      return updated;
    });
  };

  const setVerified = (verified) => {
    setIsVerified(verified);
  };

  // 지갑 정보 초기화
  const resetWalletInfo = () => {
    setWalletInfo(null);
    setIsVerified(false);
    setError(null);
    lastFetchRef.current = { address: null, timestamp: 0 };
    isFetchingRef.current = false;
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
        error,
        resetWalletInfo,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
