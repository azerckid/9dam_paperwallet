import { useState } from "react";

import { useRouter } from "next/router";
import { useWallet } from "@/contexts/WalletContext";
import isValidWalletAddress from "@/utils/CheckAddress";

import Scanner from "../qr/QRcodeReader";
import Title from "./Title";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Camera,
  CircleQuestionMark,
  Play,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";

export default function Verification() {
  const router = useRouter();
  const { updateWalletInfo, fetchWalletInfo } = useWallet();
  const [address, setAddress] = useState("");
  const [scannerOn, setScannerOn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const getWalletAccount = async (data) => {
    if (!isValidWalletAddress(data)) {
      setModalMessage("올바른 지갑주소를 입력해주세요.");
      setShowModal(true);
      return null;
    }
    setScannerOn(false);

    try {
      const walletData = await fetchWalletInfo(data);

      if (walletData) {
        updateWalletInfo(walletData);
        router.push(`/verify/wallet/${walletData.address}`);
      } else {
        // 데이터베이스에 없는 주소인 경우
        setModalMessage("처음 등록하는 주소입니다.\n한번 더 스캔해주세요.");
        setShowModal(true);
        // 주소를 다시 입력할 수 있도록 상태 초기화
        setAddress("");
      }
    } catch (error) {
      console.error("지갑 정보 조회 중 오류:", error);
      // 에러가 발생한 경우에도 사용자 친화적인 메시지 표시
      setModalMessage("처음 등록하는 주소입니다.\n한번 더 스캔해주세요.");
      setShowModal(true);
      setAddress("");
    }
  };

  // QR Scan ON/OFF 토글 핸들러: 상태 모두 초기화
  const handleScannerToggle = () => {
    setScannerOn((prev) => {
      const next = !prev;
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
              <Scanner
                getWalletAccount={getWalletAccount}
                getNewAccount={() => {}}
              />
            </div>
          )}

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
                value={address}
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
            <Button
              variant="destructive"
              size="xl"
              className="w-full"
              onClick={() => window.open(EXTERNAL_LINKS.GUIDE, "_blank")}
            >
              <Play /> 사용방법 바로가기
            </Button>
          </div>

          <p className="text-[#9CA3AF] text-center mt-8 text-sm md:text-base">
            MOBICK SHELL은 MOBICK 종이지갑 기반 위조 검증 시스템입니다.
          </p>
        </div>
      </div>

      {/* 커스텀 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold">알림</h3>
            </div>
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {modalMessage}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowModal(false)}
                variant="defaultGreen"
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
