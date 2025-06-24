import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";

export default function OldSecretNumber({ address, getAllPasswordCorrect, checkOldSecretNumberExists, AllPasswordCorrect }) {
    const [walletId, setWalletId] = useState(null);
    const [passwords, setPasswords] = useState([]);
    const [inputPasswords, setInputPasswords] = useState([]);
    const [error, setError] = useState('');

    const [password, setPassword] = useState("");
    const [hashing, setHashing] = useState("");
    const [passwordValidationResults, setPasswordValidationResults] = useState([]);


    const onPasswordChange = (e, idx) => {
        const newPassword = e.target.value;
        console.log("e.target.value", e.target.value);
        console.log("newPassword", newPassword);
        console.log("password", password);
        setPassword(newPassword);
        const hash = sha256(newPassword);
        console.log("hash=================", hash);
        setHashing(hash);
        console.log("hashing============", hashing);
        console.log("passwords================", passwords);
        console.log("passwords[idx]================", passwords[idx]);
        // setInputPasswords([...inputPasswords, hash]);

        if (passwords[idx].password === hash.toString()) {
            console.log("hashing+++++++++++++", hashing);
            console.log("hash++++++++++++", hash);
            arrayInputPasswords(hash);
            handleAllPasswordCorrect();
        }

    }
    const arrayInputPasswords = (hashing) => {
        setInputPasswords([...inputPasswords, hashing]);
    }

    const handleAllPasswordCorrect = () => {
        console.log("passwords.length++++++++++++++", passwords.length);
        console.log("inputPasswords.length++++++++++++", inputPasswords.length);
        // inputPasswords.length 다시 확인 필요합니다.
        if (passwords.length === inputPasswords.length + 1) {
            AllPasswordCorrect(true);
        }
    }

    // const handlePasswordChange = (index, e) => {
    //     console.log("index", index);
    //     console.log("e.target.value", e.target.value);
    //     const updatedInputPasswords = [...inputPasswords];
    //     updatedInputPasswords[index] = e.target.value;
    //     setInputPasswords(updatedInputPasswords);

    //     if (password[idx] === inputPasswords[idx]) {
    //         return true;
    //     };

    //     // 입력된 비밀번호를 해시 처리
    //     const hashedInput = sha256(e.target.value);
    //     const updatedValidationResults = [...passwordValidationResults];
    //     updatedValidationResults[index] = passwords[index] === hashedInput;
    //     setPasswordValidationResults(updatedValidationResults);

    //     // 모든 비밀번호가 올바른지 확인
    //     handleAllPasswordCorrect(updatedValidationResults.every(result => result));
    //     // handleAllPasswordCorrect(false);
    // };

    // const verifyPasswords = () => {
    //     const results = passwords.map((storedPassword, index) => storedPassword === inputPasswords[index]);
    //     setPasswordValidationResults(results);
    //     const allCorrect = results.every((result) => result === true);
    //     // getAllPasswordCorrect(allCorrect);
    //     // checkOldSecretNumberExists(passwords.length > 0);
    //     checkOldSecretNumberExists(true);
    // };

    const getWalletId = async () => {
        try {
            if (!address) {
                return;
            }
            const response = await fetch('/api/wallet/findWalletIdByAddress', {
                method: 'POST', // API 요구사항에 따라 변경
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
            console.log("data", data);
        } catch (error) {
            setError('Error fetching passwords: ' + error.message);
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

    // todo : 비밀번호가 모두 일치한다면 getAllPasswordCorrect를 true로 변경

    return (
        <div className="flex flex-col justify-center">
            {passwords.map((item, idx) => {
                return (
                    <div key={idx}>
                        <span>{idx + 1}번째 비밀번호:</span>
                        <input
                            type="password"
                            placeholder="Enter password"
                            onChange={(e) => onPasswordChange(e, idx)}
                        // onBlur={verifyPasswords}
                        />
                        {<p>{item.password}</p>}
                        {console.log("item.password", item.password)}
                        {console.log("hashing", hashing)}
                        {console.log("password", password)}
                        {console.log("passwords", passwords)}
                        {/* {item.password === hashing ? <p>true</p> : <p>false</p>} */}
                        {console.log("inputPasswords", inputPasswords)}
                        {item.password === inputPasswords[idx] ? <p>true</p> : <p>false</p>}
                    </div>
                )
            })}
            {error && <p>{error}</p>}
        </div>
    )
}