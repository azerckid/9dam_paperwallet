import React from "react";
import { useRouter } from "next/router";
import { EXTERNAL_LINKS } from "@/lib/constants";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield } from "lucide-react";

const Popup = ({ showPopup, setShowPopup }) => {
  const router = useRouter();

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🎉 춘심 2주년 & Mobick Shell 오픈</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <p className="text-[#4B5563] text-[13px] md:text-[15px] leading-[20px] md:leading-[22px]">
            저희 춘심팀이 2주년을 맞아 종이지갑 위조 검증 플랫폼 Mobick Shell
            베타 버전을 공개합니다.
          </p>
          <p
            className="text-[#4B5563] text-[13px] md:text-[14px] font-[700] text-right underline cursor-pointer"
            onClick={() => window.open(EXTERNAL_LINKS.INTRODUCE, "_blank")}
          >
            소개서(GitBook) 바로가기
          </p>
          <Card variant="noticeGreen">
            <CardHeader variant="noticeGreen">
              <CardTitle className="text-[15px] md:text-base">
                <span>🔎</span> Mobick Shell 소개
              </CardTitle>
            </CardHeader>
            <CardContent variant="noticeGreen" className="text-xs md:text-sm">
              비트모빅 생태계의 종이지갑 거래 신뢰성을 지키고자 출시 준비를 하게
              되었습니다.
              <br />
              <br />
              사용 방법은 안내 링크를 참고해주세요.
              <br />
              <span
                className="block text-[#05B6A2] w-full font-bold cursor-pointer text-right underline"
                onClick={() => window.open(EXTERNAL_LINKS.GUIDE_1, "_blank")}
              >
                👉 사용방법 바로가기
              </span>
            </CardContent>
          </Card>
          <Card variant="noticeBlue">
            <CardHeader variant="noticeBlue">
              <CardTitle className="text-[15px] md:text-base">
                <span>🎉</span> 이벤트 참여 방법
              </CardTitle>
            </CardHeader>
            <CardContent variant="noticeBlue" className="text-xs md:text-sm">
              <div className="flex flex-col justify-center gap-2.5 md:gap-3 overflow-x-auto">
                <div className="flex gap-2.5 md:gap-3 items-center min-w-max">
                  <div className="rounded-full bg-[#3B82F6] w-5 h-5 md:w-6 md:h-6 flex justify-center items-center text-white text-[11px] md:text-sm font-bold">
                    1
                  </div>
                  <span
                    className="font-[700] underline cursor-pointer whitespace-nowrap"
                    onClick={() =>
                      window.open("https://www.mobickshell.com/", "_blank")
                    }
                  >
                    mobickshell.com
                  </span>
                  <span className="whitespace-nowrap">접속 후 이용해보기</span>
                </div>
                <div className="flex gap-2.5 md:gap-3 items-center min-w-max">
                  <div className="rounded-full bg-[#3B82F6] w-5 h-5 md:w-6 md:h-6 flex justify-center items-center text-white text-[11px] md:text-sm font-bold">
                    2
                  </div>
                  <span
                    className="font-[700] underline cursor-pointer whitespace-nowrap"
                    onClick={() =>
                      window.open("https://open.kakao.com/o/gq3NvqFf", "_blank")
                    }
                  >
                    춘심 카카오톡방
                  </span>
                  <span className="whitespace-nowrap">입장</span>
                </div>
                <div className="flex gap-2.5 md:gap-3 items-center min-w-max">
                  <div className="rounded-full bg-[#3B82F6] w-5 h-5 md:w-6 md:h-6 flex justify-center items-center text-white text-[11px] md:text-sm font-bold">
                    3
                  </div>
                  <span
                    className="font-[700] underline cursor-pointer whitespace-nowrap"
                    onClick={() =>
                      window.open(
                        "https://forms.gle/vtkbhxCCGXnUny7Z9",
                        "_blank"
                      )
                    }
                  >
                    구글 폼 작성
                  </span>
                  <span className="whitespace-nowrap">
                    – EVM 주소 + LTM 주소 입력
                  </span>
                </div>
                <div className="font-bold text-[#92400E] rounded-lg border-[1px] border-[#FDE68A] bg-[#FEF3C7] p-2.5">
                  📅 이벤트 기간: 9월 15일 ~ 9월 21일
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogDescription>

        <DialogFooter>
          <div className="flex md:flex-row justify-center gap-3 md:gap-4">
            <Button
              className="text-[13px] md:text-sm border-[1px] border-[#E5E7EB] font-[900] shadow-none"
              onClick={() => router.push("/verify")}
            >
              <Shield />
              지금 검증하기
            </Button>
            <Button
              className="text-[13px] md:text-sm text-[#6B7280] shadow-none border-[1px] border-[#E5E7EB]"
              onClick={() => setShowPopup(false)}
            >
              닫기
            </Button>
          </div>
          <p
            className="cursor-pointer text-center text-[#9CA3AF] text-[11px] underline md:text-xs"
            onClick={() => setShowPopup(false, true)}
          >
            오늘 하루 보지않기
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
