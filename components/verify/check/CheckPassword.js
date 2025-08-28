import React, { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";

import Title from "../Title";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CircleCheckBig, CircleQuestionMark, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EXTERNAL_LINKS } from "@/lib/constants";

const CheckPassword = ({ setAllPasswordsCorrect }) => {
  const { walletInfo, setIsVerified } = useWallet();

  const [currentStep, setCurrentStep] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const [verifiedSteps, setVerifiedSteps] = useState([]);

  // 안내 문구
  const [inputStepGuide, setInputStepGuide] = useState(
    "가장 먼저 작성된 비밀번호부터 순서대로 입력해주세요. (오래된 순서)"
  );
  const [error, setError] = useState("");

  const handleInputChange = (value) => {
    setInputValues((prev) => {
      const newValues = [...prev];
      newValues[currentStep] = value;
      return newValues;
    });
    setError("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const passwordInput = inputValues[currentStep] || "";

    try {
      const response = await fetch("/api/password/verifyPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAccountId: walletInfo.walletId,
          passwordIndex: currentStep,
          passwordInput,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVerifiedSteps((prev) => [...prev, currentStep]);

        if (currentStep < walletInfo.passwordCount - 1) {
          // 다음 단계로 이동
          setCurrentStep(currentStep + 1);
          setInputStepGuide(`${currentStep + 2}번 비밀번호를 입력해주세요.`);
        } else {
          // 모든 비밀번호 검증 완료
          setAllPasswordsCorrect(true);
          setIsVerified(true);
        }
      } else {
        setError("비밀번호가 일치하지 않습니다. 다시 확인해 주세요.");
      }
    } catch (error) {
      console.error("비밀번호 검증 실패:", error);
      setError("알 수 없는 오류가 발생했습니다: " + (error.message || ""));
    }
  };

  // 현재 단계의 비밀번호 입력 필드
  const renderCurrentPasswordInput = () => {
    return (
      <div className="space-y-2">
        <label className="flex justify-between items-center text-sm md:text-base mb-2">
          {currentStep + 1}번 비밀번호를 입력해주세요.
          <span className="px-2 py-1 text-xs md:text-sm font-bold rounded-full bg-[#FEF3C7] text-[#92400E]">
            필수
          </span>
        </label>
        <Input
          type="password"
          value={inputValues[currentStep] || ""}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={`${currentStep + 1}번 비밀번호`}
          autoFocus
          autoComplete="current-password"
          className={`${error && "border-[#EF4444] border-2"}`}
        />
        {error && (
          <p className="text-xs md:text-sm text-[#EF4444] flex items-center gap-1">
            <Info /> {error}
          </p>
        )}
      </div>
    );
  };

  // 검증된 비밀번호들 표시
  const renderVerifiedPasswords = () => {
    return (
      <div className="space-y-4">
        {verifiedSteps.map((index) => (
          <div key={index}>
            <label className="flex justify-between items-center text-sm md:text-base mb-2">
              {index + 1}번 비밀번호
              <span className="px-2 py-1 text-xs md:text-sm font-bold rounded-full bg-[#DCFCE7] text-[#166534]">
                완료
              </span>
            </label>
            <div className="relative">
              <Input
                type="password"
                disabled
                value={inputValues[index] || ""}
                className="bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] pr-12"
                autoComplete="current-password"
              />
              <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#166534]" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl min-h-screen container flex flex-col gap-7 md:gap-8 bg-[#F8F9FA] mx-auto py-8 md:py-14 px-8">
        <form
          onSubmit={handlePasswordSubmit}
          className="flex flex-col gap-7 md:gap-8"
        >
          <Title
            title="기존 비밀번호 검증하기"
            subTitle="실물 지갑에 작성된 비밀번호를 순서대로 입력하세요"
          />
          {verifiedSteps.length > 0 && (
            <Card variant="noticeGreen">
              <CardHeader variant="noticeGreen">
                <CardTitle>
                  <CircleCheckBig /> {verifiedSteps.length}번 비밀번호 검증 완료
                </CardTitle>
              </CardHeader>
              <CardContent variant="noticeGreen">
                {verifiedSteps.length}번 비밀번호가 성공적으로 검증되었습니다.
              </CardContent>
            </Card>
          )}

          <Card variant="noticeBlue">
            <CardHeader variant="noticeBlue">
              <CardTitle>
                <Info /> 입력 순서 안내
              </CardTitle>
            </CardHeader>
            <CardContent variant="noticeBlue">{inputStepGuide}</CardContent>
          </Card>
          <div className="flex flex-col gap-4">
            {verifiedSteps.length > 0 && renderVerifiedPasswords()}
            {renderCurrentPasswordInput()}
          </div>

          <Button
            type="submit"
            variant="defaultGreen"
            size="xl"
            disabled={!inputValues[currentStep]}
          >
            검증하기
          </Button>
          <p className="text-[#9CA3AF] flex gap-1 justify-center items-center text-sm md:text-base">
            <CircleQuestionMark /> 비밀번호를 찾을 수 없나요?
            <span
              className="cursor-pointer underline"
              onClick={() => window.open(EXTERNAL_LINKS.FAQ, "_blank")}
            >
              문의하기
            </span>
          </p>
        </form>
      </main>
    </div>
  );
};

export default CheckPassword;
