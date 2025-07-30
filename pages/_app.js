import { WalletProvider } from "@/contexts/WalletContext";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
      <Toaster />
    </WalletProvider>
  );
}
