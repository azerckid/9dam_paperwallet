import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function PasswordVerify({ address, onAllCorrect }) {
    const [walletId, setWalletId] = useState(null);
    const [passwords, setPasswords] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [submitResults, setSubmitResults] = useState([]);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isAllCorrect, setIsAllCorrect] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const { toast } = useToast();

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
    useEffect(() => {
        if (!walletId) return;
        const getPasswords = async () => {
            try {
                const response = await fetch('/api/password/getPasswords', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ walletAccountId: walletId }),
                });
                if (!response.ok) throw new Error('Failed to fetch passwords');
                const data = await response.json();
                setPasswords(data);
            } catch (error) {
                setError('Error fetching passwords: ' + error.message);
            }
        };
        getPasswords();
    }, [walletId]);
    if (!address) return null;

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
            setOpenDialog(true);
        } else {
            const newResults = [...submitResults];
            newResults[idx] = '올바른 비번을 입력하세요.';
            setSubmitResults(newResults);
            toast({
                variant: "destructive",
                title: "비밀번호가 일치하지 않습니다.",
                description: "입력하신 비밀번호를 다시 확인해 주세요.",
                duration: 2000, // 3초 동안만 표시
            });
        }
    };

    const handleNextStep = () => {
        if (currentStep < passwords.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsAllCorrect(true);
            if (typeof onAllCorrect === 'function') onAllCorrect(passwords.length);
        }
    };

    if (passwords.length === 0) return null;

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
                    {submitResults[currentStep] === '올바른 비밀번호입니다.' && (
                        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                        <CheckCircle2Icon className="w-5 h-5 text-green-600" />
                                        올바른 비밀번호입니다.
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogAction
                                        onClick={() => {
                                            setOpenDialog(false);
                                            handleNextStep();
                                        }}
                                    >
                                        다음
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </form>
            )}
            {isAllCorrect && (
                <div className="text-green-600 text-lg mt-2">모든 비번을 올바르게 입력하셨습니다</div>
            )}
        </div>
    );
} 