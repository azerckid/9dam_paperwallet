import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WalletList() {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    // 잔액 상태: { [address]: { value, loading, error } }
    const [balances, setBalances] = useState({});

    useEffect(() => {
        fetch("/api/wallet/getAllWalletAccounts")
            .then(res => res.json())
            .then(data => {
                setWallets(data);
                setLoading(false);
            });
    }, []);

    // 주소별 잔액 fetch
    useEffect(() => {
        if (!wallets.length) return;
        wallets.forEach(w => {
            if (!w.account) return;
            console.log("[wallet-list] 지갑 주소 원본:", w.account, "| 길이:", w.account.length, "| 인코딩:", encodeURIComponent(w.account));
            // 이미 조회했으면 skip
            if (balances[w.account]) return;
            setBalances(prev => ({ ...prev, [w.account]: { value: null, loading: true, error: null } }));
            fetch(`/api/proxy-balance?address=${encodeURIComponent(w.account.trim())}`)
                .then(res => {
                    console.log("[wallet-list] API 응답 status:", res.status, "주소:", w.account.trim());
                    if (!res.ok) throw new Error('잔액 조회 실패');
                    return res.json();
                })
                .then(json => {
                    console.log("[wallet-list] API 응답 데이터:", json);
                    const sat = json?.txHistory?.balanceSat;
                    const btc = typeof sat === 'number' ? (sat / 1e8) : null;
                    setBalances(prev => ({ ...prev, [w.account]: { value: btc, loading: false, error: null } }));
                })
                .catch(() => {
                    setBalances(prev => ({ ...prev, [w.account]: { value: null, loading: false, error: '잔액 조회 실패' } }));
                });
        });
    }, [wallets, balances]);

    // CSV Export 기능 (잔액은 미포함)
    const handleExportCSV = () => {
        if (!wallets.length) return;
        const header = "id,account,created_at";
        const rows = wallets.map(w => `${w.id},${w.account},${w.created_at}`);
        const csvContent = [header, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "wallet_accounts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto py-12 px-2">
            <div className="flex justify-end mb-4">
                <Button asChild variant="secondary" className="py-2 px-3 text-sm">
                    <Link href="/admin/stats">통계 대시보드로 이동</Link>
                </Button>
            </div>
            <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>등록된 지갑 주소 목록</CardTitle>
                    <Button onClick={handleExportCSV} variant="outline" className="py-2 px-3 text-sm">
                        CSV로 내보내기
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs p-1">ID</TableHead>
                                    <TableHead className="text-xs p-1">지갑 주소</TableHead>
                                    <TableHead className="text-xs p-1">등록일</TableHead>
                                    <TableHead className="text-xs p-1">잔액(BTC)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {wallets.map(w => (
                                    <TableRow key={w.id}>
                                        <TableCell className="text-xs p-1">{w.id}</TableCell>
                                        <TableCell className="font-mono text-xs p-1">{w.account}</TableCell>
                                        <TableCell className="text-xs p-1">{w.created_at ? new Date(w.created_at).toLocaleString() : "-"}</TableCell>
                                        <TableCell className="text-xs p-1">
                                            {balances[w.account] && balances[w.account].loading && <span>조회 중...</span>}
                                            {balances[w.account] && !balances[w.account].loading && balances[w.account].value !== null && (
                                                <span>{balances[w.account].value.toFixed(8)}</span>
                                            )}
                                            {balances[w.account] && !balances[w.account].loading && balances[w.account].error && (
                                                <span className="text-red-500">{balances[w.account].error}</span>
                                            )}
                                            {!balances[w.account] && <span>-</span>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 