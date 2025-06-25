import { useEffect, useState } from "react";

import Center from "./Center";
import OldSecretNumber from "./OldSecretNumber";
import NewSecretNumber from "./NewSecretNumber";
import TitleDescription from "./TitleDescription";
import Scanner from "./QRcodeReader";
import isValidBitcoinAddress from '../utils/CheckAddress';

export default function Verification() {
    const [walletAccount, setWalletAccount] = useState('');
    const [oldSecretNumberExists, setOldSecretNumberExists] = useState(false); // null로 초기화하여 아직 확인되지 않음을 나타냅니다.
    const [handleAllPassword, setHandleAllPassword] = useState(false);
    const [newAccount, setNewAccount] = useState(false);
    const [scannerOn, setScannerOn] = useState(false); // QR 스캐너 ON/OFF 상태
    // 추가: 새 비번 생성 UI 표시 여부와 몇번째 비번 생성인지
    const [showNewSecret, setShowNewSecret] = useState(false);
    const [passwordCount, setPasswordCount] = useState(0);

    const getWalletAccount = (data) => {
        setWalletAccount(data);
        // 형식이 맞는 주소일 때만 카메라 OFF 및 다음 단계 진행
        if (data && isValidBitcoinAddress(data)) {
            setScannerOn(false); // 스캔 성공 시 카메라 OFF
            setShowNewSecret(false);
            setPasswordCount(0);
        }
    }
    const checkOldSecretNumberExists = (exists) => {
        setOldSecretNumberExists(exists);
    }
    const AllPasswordCorrect = (isCorrect, count) => {
        if (isCorrect) {
            setPasswordCount(count);
            setShowNewSecret(true);
        }
    };
    const getNewAccount = (data) => {
        setNewAccount(data);
    }
    useEffect(() => {
    }, [showNewSecret]);

    // QR Scan ON/OFF 토글 핸들러: 상태 모두 초기화
    const handleScannerToggle = () => {
        setScannerOn((prev) => {
            const next = !prev;
            if (next) {
                // QR Scan ON: 모든 상태 초기화
                setWalletAccount('');
                setShowNewSecret(false);
                setPasswordCount(0);
                setOldSecretNumberExists(false);
                setHandleAllPassword(false);
                setNewAccount(false);
            }
            return next;
        });
    };

    return (
        <Center>
            <TitleDescription />
            {/* QR 스캐너 ON/OFF 토글 버튼 */}
            <button
                className="my-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleScannerToggle}
            >
                {scannerOn ? 'QR Scan OFF' : 'QR Scan ON'}
            </button>
            {/* QR 스캐너가 ON일 때는 address 등 모든 정보 숨김 */}
            {scannerOn ? (
                <div className="flex flex-col items-center">
                    <div className="mb-4 text-lg font-semibold">지갑 QR CODE를 스캔해주세요</div>
                    <Scanner
                        getWalletAccount={getWalletAccount}
                        getNewAccount={getNewAccount}
                    />
                </div>
            ) : (
                <>
                    {/* 스캔된 주소가 있으면 버튼 아래에 표시 */}
                    {walletAccount && (
                        <div className="my-2 text-base font-semibold">address : {walletAccount}</div>
                    )}
                    {/* address, 안내문구, OldSecretNumber 등 기존 UI */}
                    {!showNewSecret && (
                        <OldSecretNumber
                            address={walletAccount}
                            checkOldSecretNumberExists={checkOldSecretNumberExists}
                            AllPasswordCorrect={AllPasswordCorrect}
                        />
                    )}
                    {showNewSecret && (
                        <div className="flex flex-col items-center mt-8">
                            <NewSecretNumber
                                address={walletAccount}
                                onSuccess={() => setPasswordCount(prev => prev + 1)}
                                index={passwordCount}
                            />
                        </div>
                    )}
                </>
            )}
        </Center>
    )
}