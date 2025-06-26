import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import isValidWalletAddress from '../../utils/CheckAddress';

// QrScanner를 클라이언트에서만 렌더링하도록 동적 import
const QrScanner = dynamic(() => import('@yudiel/react-qr-scanner').then(mod => mod.QrScanner), { ssr: false });

export default function Scanner({ getWalletAccount, getNewAccount }) {
    const [data, setData] = useState('');
    const [validationMsg, setValidationMsg] = useState('');

    const checkAddressInDB = async () => {
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
    }
    useEffect(() => {
        if (data) {
            if (isValidWalletAddress(data)) {
                setValidationMsg('형식에 맞는 주소입니다.');
                checkAddressInDB();
                getWalletAccount(data);
            } else {
                setValidationMsg('형식에 맞지 않는 주소입니다.');
                // 주소가 올바르지 않으면 DB 저장/진행 안 함
            }
        } else {
            setValidationMsg('');
        }
    }, [data]);

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
            {/* address는 MainVerification에서만 필요할 때 보여주도록, 여기서는 숨김 */}
            {/* <p>address : {data}</p> */}
        </>
    );
}