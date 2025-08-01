import { useState, useEffect } from "react";

import { useWallet } from "@/contexts/WalletContext";
import isValidBitcoinAddress from "../utils/CheckAddress";

import Scanner from "./QRscan/QRcodeReader";
import PasswordFirstRegister from "./Password/PasswordFirstRegister";
import PasswordVerify from "./Password/PasswordVerify";
import PasswordAdd from "./Password/PasswordAdd";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, CircleQuestionMark, Play, ShieldCheck } from "lucide-react";
import { useRouter } from "next/router";
import Title from "./verify/Title";

export default function Verification() {
  const router = useRouter();
  const { updateWalletInfo } = useWallet();

  const [address, setAddress] = useState("");
  //   const [passwordCount, setPasswordCount] = useState(0); // 등록된 비밀번호 개수
  const [scannerOn, setScannerOn] = useState(false);
  //   const [step, setStep] = useState(""); // '', 'first', 'verify', 'add'
  // 잔액 관련 상태 추가
  //   const [balance, setBalance] = useState(null);
  //   const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  //   const [balanceError, setBalanceError] = useState("");

  // address로 등록된 비밀번호 개수 fetch
  // const fetchPasswordCount = async (address) => {
  //   if (!address) return 0;
  //   try {
  //     const response = await fetch("/api/wallet/findWalletIdByAddress", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ account: address }),
  //     });
  //     if (!response.ok) throw new Error("Network response was not ok");
  //     const walletId = await response.json();
  //     if (!walletId) return 0;
  //     const pwRes = await fetch("/api/password/getPasswords", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ walletAccountId: walletId }),
  //     });
  //     if (!pwRes.ok) throw new Error("Failed to fetch passwords");
  //     const pwData = await pwRes.json();
  //     return Array.isArray(pwData) ? pwData.length : 0;
  //   } catch {
  //     return 0;
  //   }
  // };

  // const fetchWalletInfo = async (data) => {
  //   if (!data) return null;

  //   try {
  //     // 1. 비밀번호 개수
  //     const passwordCount = await fetchPasswordCount(data);
  //     console.log(passwordCount);

  //     // 2. 잔액 조회
  //     const balanceResponse = await fetch(
  //       `/api/proxy-balance?address=${encodeURIComponent(data.trim())}`
  //     );
  //     console.log(balanceResponse);

  //     let balance = null;
  //     let balanceError = "";

  //     if (balanceResponse.ok) {
  //       const balanceData = await balanceResponse.json();
  //       if (
  //         balanceData &&
  //         typeof balanceData.txHistory?.balanceSat === "number"
  //       ) {
  //         balance = balanceData.txHistory.balanceSat;
  //       } else {
  //         balanceError = "잔액 정보 없음";
  //       }
  //     } else {
  //       balanceError = "잔액 조회 실패";
  //     }

  //     const walletInfo = {
  //       address: data,
  //       balance,
  //       balanceError,
  //       passwordCount,
  //       isRegistered: passwordCount > 0,
  //     };
  //     console.log(walletInfo);

  //     return walletInfo;
  //   } catch (error) {
  //     console.error("지갑 정보 조회 실패:", error);
  //     return null;
  //   }
  // };

  // 주소가 바뀔 때마다 잔액 조회
  //   useEffect(() => {
  //     if (!walletAccount) {
  //       setBalance(null);
  //       setBalanceError("");
  //       return;
  //     }
  //     setIsLoadingBalance(true);
  //     setBalanceError("");
  //     fetch(
  //       `/api/proxy-balance?address=${encodeURIComponent(walletAccount.trim())}`
  //     )
  //       .then((res) => {
  //         if (!res.ok) throw new Error("잔액 조회 실패");
  //         return res.json();
  //       })
  //       .then((json) => {
  //         if (json && typeof json.txHistory?.balanceSat === "number") {
  //           setBalance(json.txHistory.balanceSat);
  //         } else {
  //           setBalance(null);
  //           setBalanceError("잔액 정보 없음");
  //         }
  //       })
  //       .catch(() => {
  //         setBalance(null);
  //         setBalanceError("잔액 조회 실패");
  //       })
  //       .finally(() => setIsLoadingBalance(false));
  //   }, [walletAccount]);

  const getWalletAccount = async (data) => {
    // setWalletAccount(data);
    if (data && isValidBitcoinAddress(data)) {
      setScannerOn(false);
      const walletData = await fetchWalletInfo(data);

      if (walletData) {
        updateWalletInfo(walletData);
        router.push(`/verify/wallet/${walletData.address}`);
      } else {
        alert("지갑 정보 조회 실패");
      }
    }
  };

  //   const handleAllPasswordCorrect = (count) => {
  //     setPasswordCount(count);
  //     setStep("add");
  //   };

  //   const handleAddSuccess = async () => {
  //     // 비밀번호 추가 후 다시 검증 단계로 돌아가거나, 원하는 UX에 맞게 처리
  //     const count = await fetchPasswordCount(walletAccount);
  //     setPasswordCount(count);
  //     setStep("verify");
  //   };

  // QR Scan ON/OFF 토글 핸들러: 상태 모두 초기화
  const handleScannerToggle = () => {
    setScannerOn((prev) => {
      const next = !prev;
      if (next) {
        // setWalletAccount("");
        // setPasswordCount(0);
        // setStep("");
      }
      return next;
    });
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
          <Title
            title="종이지갑 진위 여부 확인하기"
            subTitle="QR 스캔 또는 지갑 주소 입력으로 시작하세요."
          />

          <div className="flex flex-col gap-3 bg-white p-5 rounded-lg border border-[#E5E7EB]">
            <h2 className="flex gap-2 font-bold">
              <ShieldCheck className="text-[#05B6A2]" />
              검증 시스템 안내
            </h2>
            <p className="text-sm text-[#4B5563]">
              종이지갑의 진위 여부를 확인하여 위조품을 구별할 수 있습니다. 지갑
              주소를 입력하면 등록된 비밀번호 기록과 비교하여 검증 결과를
              제공합니다.
            </p>
          </div>

          <Button
            variant="defaultGreen"
            size="xl"
            className="w-full"
            onClick={handleScannerToggle}
          >
            <Camera />
            {scannerOn ? "QR 코드 스캔 종료하기" : "QR 코드 스캔하기"}
          </Button>
          {scannerOn && (
            <div className="flex flex-col items-center">
              <Scanner getWalletAccount={getWalletAccount} />
            </div>
          )}
          {/* {scannerOn ? (
            <div className="flex flex-col items-center">
              <Scanner getWalletAccount={getWalletAccount} />
            </div>
          ) : (
            <>
              {walletAccount && (
                <div className="my-2 text-base font-semibold">
                  address : {walletAccount}
                  <div className="mt-1 text-sm font-normal">
                    {isLoadingBalance && <span>잔액 조회 중...</span>}
                    {!isLoadingBalance && balance !== null && (
                      <span>
                        잔액: {balance} Satoshi ({(balance / 1e8).toFixed(8)}{" "}
                        BTC)
                      </span>
                    )}
                    {!isLoadingBalance && balanceError && (
                      <span className="text-red-500">{balanceError}</span>
                    )}
                  </div>
                </div>
              )}
              {step === "first" && (
                <PasswordFirstRegister
                  address={walletAccount}
                  onSuccess={handleAddSuccess}
                />
              )}
              {step === "verify" && (
                <PasswordVerify
                  address={walletAccount}
                  onAllCorrect={handleAllPasswordCorrect}
                />
              )}
              {step === "add" && (
                <div className="flex flex-col items-center mt-8">
                  <PasswordAdd
                    address={walletAccount}
                    onSuccess={handleAddSuccess}
                    index={passwordCount}
                  />
                </div>
              )}
            </>
          )} */}

          <div className="flex items-center">
            <div className="flex-grow border-t border-[#9CA3AF]" />
            <span className="mx-4 text-[#9CA3AF]">또는</span>
            <div className="flex-grow border-t border-[#9CA3AF]" />
          </div>

          {/* 지갑 주소 입력 섹션 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold">지갑 주소</h2>
              <Input
                placeholder="지갑 주소를 입력하세요."
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button
              variant="defaultGray"
              size="xl"
              disabled={address.length === 0}
              onClick={() => getWalletAccount(address)}
            >
              검증 시작
            </Button>
          </div>

          {/* 도움 섹션 */}
          <div className="flex flex-col gap-3 items-center">
            <p className="text-[#6B7280] flex gap-2">
              <CircleQuestionMark />
              도움이 필요하신가요?
              <span>가이드 보기</span>
            </p>
            {/* TODO : link */}
            <Button variant="destructive" size="xl" className="w-full">
              <Play /> 유튜브 가이드 영상 보기
            </Button>
          </div>

          <p className="text-[#9CA3AF] text-center mt-8 text-sm md:text-base">
            MOGA는 MOBICK 종이지갑 기반 위조 검증 시스템입니다.
          </p>
        </div>
      </div>
    </>
  );
}
