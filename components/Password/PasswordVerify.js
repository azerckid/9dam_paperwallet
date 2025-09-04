import { useState } from "react";
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

export default function PasswordVerify({ walletId, passwordCount, onAllCorrect }) {
    const [inputValues, setInputValues] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAllCorrect, setIsAllCorrect] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const { toast } = useToast();

    const handleInputChange = (idx, value) => {
        const newValues = [...inputValues];
        newValues[idx] = value;
        setInputValues(newValues);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const passwordInput = inputValues[currentStep] || '';

        if (!passwordInput) {
            toast({
                variant: "destructive",
                title: "비밀번호를 입력해주세요.",
                description: "",
                duration: 2000,
            });
            return;
        }

        try {
            const response = await fetch('/api/password/verifyPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAccountId: walletId, passwordIndex: currentStep, passwordInput }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setOpenDialog(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "비밀번호가 일치하지 않습니다.",
                    description: data.message || "입력하신 비밀번호를 다시 확인해 주세요.",
                    duration: 2000,
                });
            }
        } catch (error) {
            console.error("비밀번호 검증 실패:", error);
            toast({
                variant: "destructive",
                title: "오류 발생",
                description: "비밀번호 검증 중 오류가 발생했습니다.",
                duration: 2000,
            });
        }
    };

    const handleNextStep = () => {
        if (currentStep < passwordCount - 1) {
            setCurrentStep(currentStep + 1);
            setInputValues(prev => { // Clear current input after successful verification
                const newValues = [...prev];
                newValues[currentStep] = '';
                return newValues;
            });
        } else {
            setIsAllCorrect(true);
            if (typeof onAllCorrect === 'function') onAllCorrect(passwordCount);
        }
    };

    if (passwordCount === 0) return null;

    return (
        <div className="flex flex-col justify-center items-center gap-4 mt-4">
            {!isAllCorrect && (
                <form className="flex flex-col items-start gap-2" onSubmit={handlePasswordSubmit}>
                    {/* 접근성을 위한 숨겨진 username 필드 */}
                    <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} />
                    <label className="mb-1">{currentStep + 1}/{passwordCount} 비밀번호 확인:</label>
                    <div className="flex flex-row items-center gap-2">
                        <Input
                            type="password"
                            placeholder="Enter password"
                            value={inputValues[currentStep] || ''}
                            onChange={e => handleInputChange(currentStep, e.target.value)}
                            className="w-72"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            className=""
                        >
                            제출
                        </Button>
                    </div>
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
                </form>
            )}
            {isAllCorrect && (
                <div className="text-green-600 text-lg mt-2">모든 비밀번호를 올바르게 입력하셨습니다</div>
            )}
        </div>
    );
} 