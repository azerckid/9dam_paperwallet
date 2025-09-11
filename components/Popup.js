import React from "react";
import { useRouter } from "next/router";

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
import { ExternalLink, ShieldCheck } from "lucide-react";

const Popup = ({ showPopup, setShowPopup }) => {
  const router = useRouter();

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            📢 춘심 심부름센터 2주년 기념 & 위조검증 웹 베타 공개
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <p className="text-[#4B5563] text-[14px] md:text-base leading-[21px]">
            안녕하세요, 춘심 팀입니다.
            <br />
            2023년 9월부터 시작한 춘심 심부름센터가 어느새 2주년을 맞이했습니다.
            <br />
            그동안 함께해주신 모든 분들께 진심으로 감사드립니다. 🙏
          </p>
          <Card variant="noticeGreen">
            <CardHeader variant="noticeGreen">
              <CardTitle>🔎 Mobick Shell 소개</CardTitle>
            </CardHeader>
            <CardContent variant="noticeGreen">
              종이지갑 위조 검증 전용 웹페이지입니다.
              <br />
              실물 지갑과 플랫폼 상 동일한 비밀번호를 유지하며, 시중에 위조 지갑
              수량을 최소화하는 솔루션입니다.
              <br />
              <br />
              비트모빅 생태계의 종이지갑 거래 신뢰성을 지키고자 출시 준비를 하게
              되었습니다.
              <br />
              <br />
              사용 방법은 안내 영상을 참고해주세요.{" "}
              <span className="mr-1">👉</span>
              <br className="md:hidden" />
              <span className="text-[#05B6A2] font-bold cursor-pointer">
                www.youtube.com
              </span>
            </CardContent>
          </Card>
          <Card variant="noticeBlue">
            <CardHeader variant="noticeBlue">
              <CardTitle>🎉 이벤트 참여 방법</CardTitle>
            </CardHeader>
            <CardContent variant="noticeBlue">
              <div className="flex flex-col justify-center gap-2.5 md:gap-3">
                <div className="flex gap-2.5 md:gap-3 items-center">
                  <div className="rounded-full bg-[#3B82F6] w-5 h-5 flex justify-center items-center text-white text-[11px] font-bold">
                    1
                  </div>
                  mobickshell.com 접속 후 이용해보기
                </div>
                <div className="flex gap-2.5 md:gap-3 items-center">
                  <div className="rounded-full bg-[#3B82F6] w-5 h-5 flex justify-center items-center text-white text-[11px] font-bold">
                    2
                  </div>
                  구글폼 작성 – EVM 주소 + LTM 주소 입력
                </div>
                <div className="flex flex-col gap-1.5 font-bold text-[#92400E] rounded-lg border-[1px] border-[#FDE68A] bg-[#FEF3C7] p-2.5">
                  📅 이벤트 기간:
                  <span className="text-center">9월 15일 ~ 9월 21일</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogDescription>

        <DialogFooter>
          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4">
            <Button variant="defaultGreen" size="lg">
              <ExternalLink />
              참여하기 (Google Form)
            </Button>
            <Button
              size="lg"
              className="border border-[#E5E7EB]"
              onClick={() => router.push("/verify")}
            >
              <ShieldCheck />
              지금 검증하기
            </Button>
          </div>
          <p className="text-center text-[#9CA3AF] text-[11px] md:text-[13px]">
            앞으로도 변함없이 신뢰받는 춘심 팀이 되겠습니다.
            <br />
            감사합니다. 🙇‍♂️
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
