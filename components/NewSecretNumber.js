import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";

export default function OldSecretNumber({ address }) {
    const [password, setPassword] = useState("");
    const [hashing, setHashing] = useState("");
    const [walletId, setWalletId] = useState(null);
    const [error, setError] = useState('');
    const [response, setResponse] = useState(null);

    const onPasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const hash = sha256(newPassword);
        setHashing(hash);
    }

    const getWalletId = async () => {
        try {
            if (!address) return;
            const response = await fetch('/api/wallet/findWalletIdByAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ account: address }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data) {
                setWalletId(data);
            } else {
                setError('Wallet ID not found');
            }
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        getWalletId();
    }, [address]);

    const saveSecret = async () => {
        try {
            const response = await fetch('/api/secrets/setSecret', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: hashing, walletAccountId: walletId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data) {
                setResponse(data);
            } else {
                setError('Secret not saved');
            }
        } catch (error) {
            setError(error.message);
        }
    }
    const onSubmit = (e) => {
        e.preventDefault();
        saveSecret();
        setPassword("");
    }
    // Todo : 새로운 비밀번호가 성공적으로 저장되면, 새비밀번호 입력창 숨겨야 함.
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <form className="flex flex-col items-center justify-center gap-4" onSubmit={onSubmit}>
                <input
                    className="w-72 my-2 p-2 border border-gray-300 rounded"
                    type="text"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="Enter New password"
                />
                <input
                    className="w-72 my-2 p-2 bg-gray-300 border-none rounded cursor-pointer"
                    type="submit"
                    value="Create New password"
                />
                <div className="text-xs mt-2">
                    <div>walletAddress : {address}</div>
                    <div>walletAccountID : {walletId}</div>
                    <div>Hashing : {hashing}</div>
                </div>
                {response && <div className="text-green-600 mt-5">비밀번호가 성공적으로 저장되었습니다.</div>}
                {error && <span className="text-red-500">{error}</span>}
            </form>
        </div>
    )
}