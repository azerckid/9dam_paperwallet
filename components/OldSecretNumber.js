import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OldSecretNumber({ address, getAllPasswordCorrect, checkOldSecretNumberExists, AllPasswordCorrect }) {
    if (!address) return null;
    const [walletId, setWalletId] = useState(null);
    const [passwords, setPasswords] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [submitResults, setSubmitResults] = useState([]);
    const [error, setError] = useState('');
    const [response, setResponse] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAllCorrect, setIsAllCorrect] = useState(false);

    const [password, setPassword] = useState("");
    const [hashing, setHashing] = useState("");
    const [passwordValidationResults, setPasswordValidationResults] = useState([]);

    const onPasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const hash = sha256(newPassword);
        setHashing(hash);
    }

    const arrayInputPasswords = (hashing) => {
        setInputValues([...inputValues, hashing]);
    }

    const handleAllPasswordCorrect = () => {
        if (typeof AllPasswordCorrect === 'function') {
            AllPasswordCorrect(true, passwords.length);
        }
    }

    const getWalletId = async () => {
        try {
            if (!address) {
                return;
            }
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
            setError('Error fetching wallet ID: ' + error.message);
        }
    };

    const getPasswords = async () => {
        try {
            const response = await fetch('/api/password/getPasswords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walletAccountId: walletId }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch passwords');
            }
            const data = await response.json();
            setPasswords(data);
        } catch (error) {
            setError('Error fetching passwords: ' + error.message);
        }
    };

    const saveSecret = async (e) => {
        e.preventDefault();
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
                if (getAllPasswordCorrect) getAllPasswordCorrect();
            } else {
                setError('Secret not saved');
            }
        } catch (error) {
            setError(error.message);
        }
    }

    const handleInputChange = (idx, value) => {
        const newValues = [...inputValues];
        newValues[idx] = value;
        setInputValues(newValues);
    };

    const handlePasswordSubmit = (idx, e) => {
        e.preventDefault();
        const input = inputValues[idx] || '';
        const hashedInput = sha256(input);
        const hashed = passwords[idx].password;
        if (hashedInput === hashed) {
            const newResults = [...submitResults];
            newResults[idx] = '올바른 비밀번호입니다.';
            setSubmitResults(newResults);
        } else {
            const newResults = [...submitResults];
            newResults[idx] = '올바른 비번을 입력하세요.';
            setSubmitResults(newResults);
        }
    };

    const handleNextStep = () => {
        if (currentStep < passwords.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsAllCorrect(true);
            handleAllPasswordCorrect();
        }
    };

    useEffect(() => {
        getWalletId();
    }, [address]);

    useEffect(() => {
        if (walletId) {
            getPasswords();
        }
    }, [walletId]);

    // 비밀번호가 없는 주소(최초 등록)일 때 UI
    if (passwords.length === 0) {
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
                            {showPassword ? '🙈' : '👁️'}
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

    // 기존 비밀번호가 있는 경우: 한 번에 하나의 입력창만 보이도록 리팩토링
    if (passwords.length > 0) {
        return (
            <div className="flex flex-col justify-center items-center gap-4 mt-4">
                {!isAllCorrect && (
                    <form className="flex flex-col items-start gap-2" onSubmit={e => handlePasswordSubmit(currentStep, e)}>
                        <label className="mb-1">{currentStep + 1}번째 비밀번호 확인:</label>
                        <div className="flex flex-row items-center gap-2">
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={inputValues[currentStep] || ''}
                                onChange={e => handleInputChange(currentStep, e.target.value)}
                                className="w-72"
                            />
                            <Button
                                type="submit"
                                className=""
                            >
                                제출
                            </Button>
                        </div>
                        {/* 메시지는 input 아래에 위치, 다음 버튼도 그 아래에 위치 */}
                        {submitResults[currentStep] === '올바른 비밀번호입니다.' && (
                            <>
                                <span className="text-green-600 mt-1">올바른 비밀번호입니다.</span>
                                <Button
                                    type="button"
                                    className="mt-2"
                                    onClick={handleNextStep}
                                    variant="success"
                                >
                                    다음
                                </Button>
                            </>
                        )}
                        {submitResults[currentStep] && submitResults[currentStep] !== '올바른 비밀번호입니다.' && (
                            <span className="text-red-500 mt-1">올바른 비밀번호가 아닙니다.</span>
                        )}
                    </form>
                )}
                {isAllCorrect && (
                    <div className="text-green-600 text-lg mt-2">모든 비번을 올바르게 입력하셨습니다</div>
                )}
            </div>
        );
    }
}