import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

// 최초 비밀번호 등록 컴포넌트
// props: address (지갑 주소), onSuccess (등록 성공 시 콜백)
export default function PasswordFirstRegister({ address, onSuccess }) {
    const [password, setPassword] = useState("");
    const [hashing, setHashing] = useState("");
    const [walletId, setWalletId] = useState(null);
    const [error, setError] = useState('');
    const [response, setResponse] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!address) return;
        const getWalletId = async () => {
            try {
                const response = await fetch('/api/wallet/findWalletIdByAddress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ account: address }),
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                if (data) setWalletId(data);
                else setError('Wallet ID not found');
            } catch (error) {
                setError('Error fetching wallet ID: ' + error.message);
            }
        };
        getWalletId();
    }, [address]);

    if (!address) return null;

    const onPasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const hash = sha256(newPassword);
        setHashing(hash);
    }

    const saveSecret = async (e) => {
        e.preventDefault();
        try {
            if (!password) {
                setError('비밀번호를 입력하세요.');
                return;
            }
            const response = await fetch('/api/secrets/setSecret', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: hashing, walletAccountId: walletId }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data) {
                setResponse(data);
                if (onSuccess) onSuccess();
            } else {
                setError('Secret not saved');
            }
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="mb-2 text-base font-semibold text-blue-700">해당 지갑 계정에 등록된 비밀번호가 없습니다. 첫 비밀번호를 등록해 주세요.</div>
            {response ? (
                <div className="text-green-600 mt-2">첫 번째 비밀번호가 등록되었습니다.</div>
            ) : (
                <form className="flex flex-row items-center gap-2" onSubmit={saveSecret}>
                    <Input
                        className="w-72 my-2"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={onPasswordChange}
                        placeholder="첫 비밀번호 입력"
                    />
                    <Button
                        type="button"
                        className="ml-1"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        variant="outline"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                    <Button
                        type="submit"
                        className="w-48 my-2"
                    >
                        첫 비밀번호 등록
                    </Button>
                </form>
            )}
            {error && <span className="text-red-500">{error}</span>}
        </div>
    );
} 