import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// QrScanner를 클라이언트에서만 렌더링하도록 동적 import
const QrScanner = dynamic(() => import('@yudiel/react-qr-scanner').then(mod => mod.QrScanner), { ssr: false });

export default function Scanner({ getWalletAccount, getNewAccount }) {
    const [data, setData] = useState('');
    const checkAddressInDB = async () => {
        try {
            const response = await fetch('/api/wallet/getAllWalletAccounts');
            if (!response) {
                console.log('response', response);
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
            } else {
                console.log('The address already exists in the database.');
            }
        } catch (error) {
            console.error('Error fetching wallet accounts:', error);
        }
    }
    useEffect(() => {
        checkAddressInDB();
        getWalletAccount(data);
    }, [data]);

    return (
        <>
            <h1>QR Code Scanner</h1>
            <QrScanner
                onDecode={(result) => { result && setData(result) }}
                onError={(error) => console.log(error?.message)}
            />
            <p>address : {data}</p>
        </>
    );
}