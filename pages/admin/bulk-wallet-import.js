import { useState } from "react";
import Papa from "papaparse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BulkWalletImport() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [pw, setPw] = useState("");
    const [authed, setAuthed] = useState(false);
    const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_UPLOAD_PW || "devpw";

    const handleAuth = () => {
        if (pw === ADMIN_PW) setAuthed(true);
        else alert("비밀번호가 틀렸습니다.");
    };

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = () => {
        if (!file) return;
        Papa.parse(file, {
            complete: async (results) => {
                // 주소 유효성 검증 함수로 대체 필요 (예: isValidBitcoinAddress)
                const addresses = results.data.flat().filter(addr => addr && addr.length > 10);
                const res = await fetch("/api/wallet/bulkImport", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ addresses }),
                });
                setResult(await res.json());
            },
        });
    };

    if (!authed) {
        return (
            <div className="flex justify-center items-center min-h-screen px-2">
                <Card className="w-full max-w-xs p-2">
                    <CardHeader>
                        <CardTitle>관리자 업로드 인증</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="password"
                            value={pw}
                            onChange={e => setPw(e.target.value)}
                            placeholder="비밀번호"
                            className="mb-4 py-3 text-base"
                            autoComplete="current-password"
                        />
                        <Button className="w-full py-3 text-base" onClick={handleAuth}>
                            확인
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen px-2">
            <Card className="w-full max-w-xs p-2">
                <CardHeader>
                    <CardTitle>지갑 주소 대량 업로드 (CSV)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <Input type="file" accept=".csv" onChange={handleFileChange} className="py-3 text-base" />
                        <Button onClick={handleUpload} disabled={!file} className="w-full py-3 text-base">
                            업로드
                        </Button>
                        {result && (
                            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mt-4">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 