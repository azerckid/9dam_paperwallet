import { useState } from "react";

// fix camera input
export default function WalletAccount() {
    const [account, setAccount] = useState("");
    const onAccountChange = (e) => {
        setAccount(e.target.value);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        fetch('/api/wallet/setWalletAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(account)
        })
        setAccount("");
    }
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <form onSubmit={onSubmit} className="flex flex-col items-center gap-4">
                <input
                    className="w-72 my-2 p-2 border border-gray-300 rounded"
                    type="text"
                    value={account}
                    onChange={onAccountChange}
                    placeholder="Enter Account"
                />
                <input
                    className="w-72 my-2 p-2 bg-gray-300 border-none rounded cursor-pointer"
                    type="submit"
                    value="Account Confirm"
                />
            </form>
        </div>
    )
}