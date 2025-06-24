import { useEffect, useState } from "react";

import Center from "./Center";
import OldSecretNumber from "./OldSecretNumber";
import NewSecretNumber from "./NewSecretNumber";
import TitleDescription from "./TitleDescription";
import Scanner from "./QRcodeReader";

export default function Verification() {
    const [walletAccount, setWalletAccount] = useState('');
    const [oldSecretNumberExists, setOldSecretNumberExists] = useState(false); // null로 초기화하여 아직 확인되지 않음을 나타냅니다.
    const [handleAllPassword, setHandleAllPassword] = useState(false);
    const [newAccount, setNewAccount] = useState(false);

    const getWalletAccount = (data) => {
        setWalletAccount(data);
        // console.log("walletAccount-from-QRscanner", data);
        // console.log("walletAccount-from-QRscanner", typeof data)
    }
    const checkOldSecretNumberExists = (exists) => {
        setOldSecretNumberExists(exists);
    }
    const AllPasswordCorrect = (isCorrect) => {
        setHandleAllPassword(isCorrect);
        // 여기서 isCorrect가 true일 경우, 즉 모든 비밀번호가 올바를 때 원하는 로직을 실행합니다.
        // 예: 사용자에게 성공 메시지를 표시하거나, 다음 폼으로 네비게이션 하는 등
        if (isCorrect) {
            // 모든 비밀번호가 정확하다는 메시지 표시 또는 다른 액션 실행
            console.log("모든 비밀번호가 정확합니다. 다음 단계로 진행하세요.");
        }
    };
    const getNewAccount = (data) => {
        setNewAccount(data);
        // console.log("newAccount", data);
        // console.log("newAccount", typeof data)
    }
    useEffect(() => {

    }, [handleAllPassword]);

    return (
        <Center>
            <TitleDescription />
            {/* Todo : 버튼으로 카메라를 열고,어카운트 입력이 완료되면, 카메라 창 닫아야함. */}
            <Scanner
                getWalletAccount={getWalletAccount}
                getNewAccount={getNewAccount}>
            </Scanner>

            <div>OldSecretNumber를 차례대로 입력하셔야 새로운 비밀번호를 만들 수 있습니다.</div>
            <OldSecretNumber
                address={walletAccount}
                checkOldSecretNumberExists={checkOldSecretNumberExists} // 이 함수를 OldSecretNumber 컴포넌트에 전달합니다.
                AllPasswordCorrect={AllPasswordCorrect}
            />

            {/* <StyledSecretNumberBox>
                <div>The address already exists in the database.</div>
                <NewSecretNumber
                    address={walletAccount}
                ></NewSecretNumber>
            </StyledSecretNumberBox> */}
            {/* 처음 등록하는 주소면 새로운 비번 등록창 보이도록 */}
            {/* 기존비번을 다 맞게 입력했으면 새로운 비번 등록창 보이도록 */}
            {handleAllPassword && (
                <div>
                    <NewSecretNumber
                        address={walletAccount}
                    />
                </div>
            )}
        </Center >
    )
}