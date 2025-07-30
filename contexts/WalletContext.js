import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletInfo, setWalletInfo] = useState({
    address: "",
    balance: null,
    passwordCount: 0,
    isRegistered: false,
  });

  const updateWalletInfo = (newInfo) => {
    setWalletInfo((prev) => ({ ...prev, ...newInfo }));
  };

  return (
    <WalletContext.Provider value={{ walletInfo, updateWalletInfo }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
