import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { sha256 } from "js-sha256";

import Title from "../Title";
import ErrorDialog from "@/components/Layout/ErrorDialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Lightbulb, Shield, Eye, EyeOff } from "lucide-react";

const RegisterPassword = ({ onSuccess }) => {
  const { walletInfo, isVerified, updatePasswordCount, isLoading } = useWallet();

  const [isChecked, setIsChecked] = useState(false); // "적었습니다" 체크박스
  const [password, setPassword] = useState(""); // 비밀번호 입력
  const [hashing, setHashing] = useState("");
  const [passwordChk, setPasswordChk] = useState(""); // 비밀번호 확인 입력
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordChk, setShowPasswordChk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // 중복 로그 방지를 위한 ref
  const loggedWalletIdRef = useRef(null);

  // walletInfo가 로딩 중이거나 아직 설정되지 않은 경우 처리
  useEffect(() => {
    if (walletInfo && walletInfo.walletId && walletInfo.walletId !== 0) {
      // 이미 로그를 출력한 walletId인지 확인
      if (loggedWalletIdRef.current !== walletInfo.walletId) {
        console.log("RegisterPassword: 지갑 정보 설정됨", {
          walletId: walletInfo.walletId,
          address: walletInfo.address,
          passwordCount: walletInfo.passwordCount
        });
        loggedWalletIdRef.current = walletInfo.walletId;
      }
    }
  }, [walletInfo?.walletId]); // walletId만 의존성으로 사용하여 중복 실행 방지

  const disableRegister =
    isChecked === false ||
    !password ||
    !hashing ||
    !passwordChk ||
    password !== passwordChk ||
    isSubmitting;

  const onPasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const hash = sha256(newPassword);
    setHashing(hash);
  };

  const saveSecret = async (e) => {
    e.preventDefault();

    if (!walletInfo || !walletInfo.walletId || walletInfo.walletId === 0) {
      setError("지갑 정보를 찾을 수 없습니다. 페이지를 새로고침해주세요.");
      setShowErrorDialog(true);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("비밀번호 등록 시작:", { walletId: walletInfo.walletId, hashing });

      const response = await fetch("/api/secrets/setSecret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: hashing,
          walletAccountId: walletInfo.walletId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const data = await response.json();
      console.log("비밀번호 등록 성공:", data);

      if (data) {
        // 비밀번호 개수만 빠르게 업데이트 (잔액 조회 제외)
        await updatePasswordCount(walletInfo.address, walletInfo.walletId);
        onSuccess(true);
      } else {
        setError("비밀번호 등록에 실패했습니다.");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("비밀번호 등록 오류:", error);
      setError("알 수 없는 오류가 발생했습니다: " + (error.message || ""));
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중이거나 walletInfo가 설정되지 않은 경우
  if (isLoading || !walletInfo || !walletInfo.walletId || walletInfo.walletId === 0) {
    return (
      <div className="min-h-screen">
        <main className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 flex justify-center items-center rounded-full bg-blue-100">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">지갑 정보를 불러오는 중...</h2>
            <p className="text-gray-600">잠시만 기다려 주세요.</p>
          </div>
        </main>
      </div>
    );
  }

  // 비밀번호가 이미 등록되어 있거나 검증된 경우
  if (walletInfo.passwordCount > 0 && !isVerified) {
    return (
      <div className="min-h-screen">
        <main className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">이미 비밀번호가 등록되어 있습니다</h2>
            <p className="text-gray-600">비밀번호 검증 페이지로 이동합니다.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
        <form onSubmit={saveSecret} className="flex flex-col gap-7 md:gap-8">
          <Title
            title="새 비밀번호 등록하기"
            subTitle="실물 지갑에 비밀번호를 작성하고 등록하세요"
          />
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="w-8 h-8 md:w-9 md:h-9 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-2xl">
                    1
                  </span>
                </div>
                실물 지갑에 작성하기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                실물 지갑 뒷면에 비밀번호를 작성해주세요.
                <Card variant="noticeBlue">
                  <CardHeader variant="noticeBlue" className="text-base">
                    <CardTitle>
                      <Lightbulb /> 작성 팁
                    </CardTitle>
                  </CardHeader>
                  <CardContent variant="noticeBlue">
                    펜을 사용하여 명확하게 작성하고, 다른 사람이 볼 수 없는
                    곳에 보관하세요.
                  </CardContent>
                </Card>
                <Card variant="noticeGreen">
                  <CardHeader variant="noticeGreen" className="text-base">
                    <CardTitle>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={setIsChecked}
                      />{" "}
                      적었습니다
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="w-8 h-8 md:w-9 md:h-9 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-2xl">
                    2
                  </span>
                </div>
                비밀번호 입력하기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-sm md:text-base">
                  비밀번호 입력
                  <div className="relative">
                    <Input
                      placeholder="비밀번호를 입력하세요"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={onPasswordChange}
                      className="pr-12"
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 h-auto w-auto"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm md:text-base">
                  비밀번호 확인 입력
                  <div className="relative">
                    <Input
                      placeholder="비밀번호를 다시 입력하세요"
                      type={showPasswordChk ? "text" : "password"}
                      value={passwordChk}
                      onChange={(e) => setPasswordChk(e.target.value)}
                      className="pr-12"
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 h-auto w-auto"
                      onClick={() => setShowPasswordChk((prev) => !prev)}
                      tabIndex={-1}
                      disabled={isSubmitting}
                    >
                      {showPasswordChk ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button
            type="submit"
            variant="defaultGreen"
            size="xl"
            disabled={disableRegister}
          >
            {isSubmitting ? "등록 중..." : "비밀번호 등록하기"}
          </Button>
          <p className="text-[#9CA3AF] flex gap-1 justify-center items-center text-sm md:text-base">
            <Shield /> 비밀번호는 안전하게 암호화되어 저장됩니다
          </p>
        </form>

        <ErrorDialog
          text={error}
          showErrorDialog={showErrorDialog}
          setShowErrorDialog={setShowErrorDialog}
        />
      </main>
    </div>
  );
};

export default RegisterPassword;
