import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import isValidWalletAddress from '../../utils/CheckAddress';

// QrScanner를 클라이언트에서만 렌더링하도록 동적 import
const QrScanner = dynamic(() => import('@yudiel/react-qr-scanner').then(mod => mod.QrScanner), { ssr: false });

export default function Scanner({ getWalletAccount, getNewAccount }) {
    const [data, setData] = useState('');
    const [validationMsg, setValidationMsg] = useState('');
    // 잔액 관련 상태 추가
    const [balance, setBalance] = useState(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [balanceError, setBalanceError] = useState('');

    const checkAddressInDB = useCallback(async () => {
        try {
            const response = await fetch('/api/wallet/getAllWalletAccounts');
            if (!response) {
                throw new Error('Network response was not ok');
            }
            const accounts = await response.json();
            if (data === '') return;
            let foundData = accounts.find(account => account.account === data);
            if (foundData === undefined) {
                const response = await fetch('/api/wallet/setWalletAccount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data })
                });
                getNewAccount(true);
            }
        } catch (error) {
            console.error('Error fetching wallet accounts:', error);
        }
    }, [data, getNewAccount]);

    const handleWalletAccount = useCallback((walletData) => {
        getWalletAccount(walletData);
    }, [getWalletAccount]);

    useEffect(() => {
        if (data) {
            if (isValidWalletAddress(data)) {
                setValidationMsg('형식에 맞는 주소입니다.');
                checkAddressInDB();
                handleWalletAccount(data);
                // 잔액 조회 (프록시 API 사용)
                setIsLoadingBalance(true);
                setBalanceError('');
                fetch(`/api/proxy-balance?address=${encodeURIComponent(data.trim())}`)
                    .then(res => {
                        if (!res.ok) throw new Error('잔액 조회 실패');
                        return res.json();
                    })
                    .then(json => {
                        if (json && typeof json.txHistory?.balanceSat === 'number') {
                            setBalance(json.txHistory.balanceSat);
                        } else {
                            setBalance(null);
                            setBalanceError('잔액 정보 없음');
                        }
                    })
                    .catch(() => {
                        setBalance(null);
                        setBalanceError('잔액 조회 실패');
                    })
                    .finally(() => setIsLoadingBalance(false));
            } else {
                setValidationMsg('형식에 맞지 않는 주소입니다.');
                setBalance(null);
                setBalanceError('');
                // 주소가 올바르지 않으면 DB 저장/진행 안 함
            }
        } else {
            setValidationMsg('');
            setBalance(null);
            setBalanceError('');
        }
    }, [data, checkAddressInDB, handleWalletAccount]);

    return (
        <>
            <h1>QR Code Scanner</h1>
            <div className="w-full flex justify-center">
                <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2">
                    <QrScanner
                        onDecode={(result) => { result && setData(result) }}
                        className="w-full h-auto"
                    />
                </div>
            </div>
            {validationMsg && (
                <div className={validationMsg.includes('맞는') ? 'text-green-600 mt-2' : 'text-red-500 mt-2'}>
                    {validationMsg}
                </div>
            )}
            {/* 잔액 표시 */}
            {isValidWalletAddress(data) && (
                <div className="mt-2 text-sm">
                    {isLoadingBalance && <span>잔액 조회 중...</span>}
                    {!isLoadingBalance && balance !== null && (
                        <span>잔액: {balance} Satoshi ({(balance / 1e8).toFixed(8)} BTC)</span>
                    )}
                    {!isLoadingBalance && balanceError && (
                        <span className="text-red-500">{balanceError}</span>
                    )}
                </div>
            )}
            {/* address는 MainVerification에서만 필요할 때 보여주도록, 여기서는 숨김 */}
            {/* <p>address : {data}</p> */}
        </>
    );
}