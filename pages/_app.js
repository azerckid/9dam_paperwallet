import { WalletProvider } from "@/contexts/WalletContext";
import "@/styles/globals.css";

// 전역 에러 핸들러
if (typeof window !== "undefined") {
  // Sender 관련 에러 필터링
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0];

    // Sender 관련 에러는 무시 (다양한 형태 모두 차단)
    if (typeof message === "string" && (
      message.includes("Sender: Failed to get initial state") ||
      message.includes("sender") ||
      message.includes("sender-wallet-providerResult")
    )) {
      return;
    }

    // 기타 에러는 정상적으로 출력
    originalConsoleError.apply(console, args);
  };

  // 전역 에러 이벤트 핸들러
  window.addEventListener("error", (event) => {
    // Sender 관련 에러는 무시
    if (event.message && (
      event.message.includes("Sender") ||
      event.message.includes("sender")
    )) {
      event.preventDefault();
      return false;
    }
  });

  // Promise rejection 핸들러
  window.addEventListener("unhandledrejection", (event) => {
    // Sender 관련 에러는 무시
    if (event.reason && (
      (event.reason.message && event.reason.message.includes("Sender")) ||
      (event.reason.message && event.reason.message.includes("sender"))
    )) {
      event.preventDefault();
      return false;
    }
  });

  // 추가: console.warn도 필터링
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];

    // Sender 관련 경고는 무시
    if (typeof message === "string" && (
      message.includes("Sender") ||
      message.includes("sender")
    )) {
      return;
    }

    // 기타 경고는 정상적으로 출력
    originalConsoleWarn.apply(console, args);
  };
}

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}
