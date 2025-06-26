import { useState } from "react";
import PasswordFirstRegister from "./Password/PasswordFirstRegister";
import PasswordVerify from "./Password/PasswordVerify";
import PasswordAdd from "./Password/PasswordAdd";
import TitleDescription from "./TitleDescription";
import Scanner from "./QRscan/QRcodeReader";
import isValidBitcoinAddress from '../utils/CheckAddress';
import { Button } from "@/components/ui/button";

export default function Verification() {
    const [walletAccount, setWalletAccount] = useState('');
    const [passwordCount, setPasswordCount] = useState(0); // 등록된 비밀번호 개수
    const [scannerOn, setScannerOn] = useState(false);
    const [step, setStep] = useState(''); // '', 'first', 'verify', 'add'

    // address로 등록된 비밀번호 개수 fetch
    const fetchPasswordCount = async (address) => {
        if (!address) return 0;
        try {
            const response = await fetch('/api/wallet/findWalletIdByAddress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account: address }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const walletId = await response.json();
            if (!walletId) return 0;
            const pwRes = await fetch('/api/password/getPasswords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAccountId: walletId }),
            });
            if (!pwRes.ok) throw new Error('Failed to fetch passwords');
            const pwData = await pwRes.json();
            return Array.isArray(pwData) ? pwData.length : 0;
        } catch {
            return 0;
        }
    };

    const getWalletAccount = async (data) => {
        setWalletAccount(data);
        if (data && isValidBitcoinAddress(data)) {
            setScannerOn(false);
            // address로 등록된 비밀번호 개수 확인 후 step 결정
            const count = await fetchPasswordCount(data);
            setPasswordCount(count);
            if (count === 0) setStep('first');
            else setStep('verify');
        }
    };

    const handleAllPasswordCorrect = (count) => {
        setPasswordCount(count);
        setStep('add');
    };

    const handleAddSuccess = async () => {
        // 비밀번호 추가 후 다시 검증 단계로 돌아가거나, 원하는 UX에 맞게 처리
        const count = await fetchPasswordCount(walletAccount);
        setPasswordCount(count);
        setStep('verify');
    };

    // QR Scan ON/OFF 토글 핸들러: 상태 모두 초기화
    const handleScannerToggle = () => {
        setScannerOn((prev) => {
            const next = !prev;
            if (next) {
                setWalletAccount('');
                setPasswordCount(0);
                setStep('');
            }
            return next;
        });
    };

    return (
        <>
            <TitleDescription />
            <Button className="my-4" onClick={handleScannerToggle} variant="default">
                {scannerOn ? 'QR Scan OFF' : 'QR Scan ON'}
            </Button>
            {scannerOn ? (
                <div className="flex flex-col items-center">
                    <div className="mb-4 text-lg font-semibold">지갑 QR CODE를 스캔해주세요</div>
                    <Scanner getWalletAccount={getWalletAccount} />
                </div>
            ) : (
                <>
                    {walletAccount && (
                        <div className="my-2 text-base font-semibold">address : {walletAccount}</div>
                    )}
                    {step === 'first' && (
                        <PasswordFirstRegister address={walletAccount} onSuccess={handleAddSuccess} />
                    )}
                    {step === 'verify' && (
                        <PasswordVerify address={walletAccount} onAllCorrect={handleAllPasswordCorrect} />
                    )}
                    {step === 'add' && (
                        <div className="flex flex-col items-center mt-8">
                            <PasswordAdd address={walletAccount} onSuccess={handleAddSuccess} index={passwordCount} />
                        </div>
                    )}
                </>
            )}
        </>
    );
}