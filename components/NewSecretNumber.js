import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function NewSecretNumber({ address, onSuccess, index }) {
    if (!address) return null;
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [hashing, setHashing] = useState("");
    const [walletId, setWalletId] = useState(null);
    const [error, setError] = useState('');
    const [response, setResponse] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const onPasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const hash = sha256(newPassword);
        setHashing(hash);
    }
    const onPasswordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
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

    const saveSecret = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다');
            return;
        }
        try {
            if (!password) {
                setError('비밀번호를 입력하세요.');
                return;
            }
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
                if (onSuccess) onSuccess();
            } else {
                setError('Secret not saved');
            }
        } catch (error) {
            setError(error.message);
        }
    }

    const onSubmit = (e) => {
        setError("");
        saveSecret(e);
        setPassword("");
        setPasswordConfirm("");
    }

    const isPasswordMatch = password && passwordConfirm && password === passwordConfirm;

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            {response ? (
                <div className="text-green-600 mt-5">
                    {index ? `${index}번째 비밀번호가 성공적으로 생성, 저장되었습니다.` : '비밀번호가 성공적으로 저장되었습니다.'}
                </div>
            ) : (
                <form className="flex flex-col items-center gap-2" onSubmit={onSubmit}>
                    <div className="flex flex-row items-center gap-2">
                        <Input
                            className="w-72 my-2"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={onPasswordChange}
                            placeholder="새 비밀번호 입력"
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
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <Input
                            className="w-72 my-2"
                            type={showPasswordConfirm ? "text" : "password"}
                            value={passwordConfirm}
                            onChange={onPasswordConfirmChange}
                            placeholder="비밀번호 확인 입력"
                        />
                        <Button
                            type="button"
                            className="ml-1"
                            onClick={() => setShowPasswordConfirm((prev) => !prev)}
                            tabIndex={-1}
                            variant="outline"
                        >
                            {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                    </div>
                    {password && passwordConfirm && !isPasswordMatch && (
                        <span className="text-red-500">비밀번호가 일치하지 않습니다</span>
                    )}
                    <Button
                        type="submit"
                        className={`w-48 my-2 ${!isPasswordMatch ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isPasswordMatch}
                    >
                        새 비밀번호 등록
                    </Button>
                    {error && <span className="text-red-500">{error}</span>}
                </form>
            )}
        </div>
    )
}