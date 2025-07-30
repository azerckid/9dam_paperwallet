import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { Camera, ShieldCheck } from "lucide-react";

const Landing = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#1F2937]">
      {/* Hero Section */}
      <section className="h-[420px] md:h-[480px] bg-gradient-to-r from-[#10B981] to-[#05B6A2] flex items-center justify-center text-center px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-10 w-full h-1/2 justify-center items-center">
          <div className="z-10 text-white md:text-start">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              당신의 MOBICK 종이지갑, <br className="md:hidden" /> 진짜일까요?
            </h1>
            <p className="text-[#E6FFFA] md:text-lg mb-8">
              QR 스캔 또는 주소 입력으로 진위를 확인하고,{" "}
              <br className="md:hidden" />
              안전하게 거래하세요.
            </p>
            <Button
              variant="default"
              size="xl"
              className="w-full"
              onClick={() => router.push("/verify")}
            >
              <Camera />
              지갑 검증 시작
            </Button>
          </div>
          {/* Abstract shape */}
          <div className="w-1/2 rounded-2xl h-full bg-white opacity-10 border hidden md:block flex justify-center items-center"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 md:py-24 bg-white">
        <div className="container mx-auto px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-4">
            MOGA의 핵심 기능
          </h2>
          <p className="text-center mb-8 md:mb-12 text-[#6B7280]">
            종이지갑 검증부터 안전한 거래까지
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-4 md:space-y-0">
            {/* Feature Card 1 */}
            <div className="w-full md:w-1/3 bg-[#F8FAFC] border-[#E2E8F0] border p-6 rounded-lg text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">위조 검증</h3>
              <p className="text-[#64748B]">비밀번호 일치 여부로 진위 확인</p>
            </div>

            {/* Feature Card 2 */}
            <div className="w-full md:w-1/3 bg-[#F8FAFC] border-[#E2E8F0] border p-6 rounded-lg text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#FEF7ED] rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">비밀번호 등록</h3>
              <p className="text-[#64748B]">최초 등록 및 거래 후 갱신</p>
            </div>

            {/* Feature Card 3 */}
            <div className="w-full md:w-1/3 bg-[#F8FAFC] border-[#E2E8F0] border p-6 rounded-lg text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#F0FDF4] rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">안전한 거래</h3>
              <p className="text-[#64748B]">위조 위험 최소화, 거래 신뢰 확보</p>
            </div>
          </div>
        </div>
      </section>

      {/* Step Section */}
      <section className="py-8 md:py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-4">
            간단한 3단계 검증
          </h2>
          <p className="text-center mb-8 md:mb-12 text-[#6B7280]">
            누구나 쉽게 사용할 수 있습니다.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-start md:space-x-8 space-y-8 md:space-y-0">
            {/* Step 1 */}
            <div className="flex md:flex-col gap-4 items-center w-full md:w-1/3 md:text-center">
              <div className="w-10 h-10 md:w-16 md:h-16 md:mx-auto md:mb-4 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl md:text-2xl">
                  1
                </span>
              </div>
              <div>
                <h3 className="md:text-xl font-semibold md:mb-2">
                  QR 코드 스캔 또는 주소 입력
                </h3>
                <p className="text-sm md:text-base text-[#6B7280]">
                  지갑 정보를 확인합니다.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex md:flex-col gap-4 items-center w-full md:w-1/3 md:text-center">
              <div className="w-10 h-10 md:w-16 md:h-16 md:mx-auto md:mb-4 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl md:text-2xl">
                  2
                </span>
              </div>
              <div>
                <h3 className="md:text-xl font-semibold md:mb-2">
                  비밀번호 입력 및 검증
                </h3>
                <p className="text-sm md:text-base text-[#6B7280]">
                  실물 지갑과 비교합니다.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex md:flex-col gap-4 items-center w-full md:w-1/3 md:text-center">
              <div className="w-10 h-10 md:w-16 md:h-16 md:mx-auto md:mb-4 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl md:text-2xl">
                  3
                </span>
              </div>
              <div>
                <h3 className="md:text-xl font-semibold md:mb-2">
                  검증 결과 확인
                </h3>
                <p className="text-sm md:text-base text-[#6B7280]">
                  안전한 거래를 진행하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-8 md:py-24 bg-[#05B6A2] text-white text-center">
        <div className="container mx-auto px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg mb-8 text-[#E6FFFA]">
            안전한 MOBICK 거래의 첫걸음
          </p>
          <Button
            variant="default"
            size="xl"
            className="w-full"
            onClick={() => router.push("/verify")}
          >
            <ShieldCheck />
            무료로 검증하기
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
