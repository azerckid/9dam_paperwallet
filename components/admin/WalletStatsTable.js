import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

export function WalletStatsTable({ stats }) {
    // 잔액 상태: { [address]: { value, loading, error } }
    const [balances, setBalances] = useState({});

    useEffect(() => {
        if (!stats || !stats.length) return;
        stats.forEach(row => {
            if (!row.address) return;
            console.log("[WalletStatsTable] 지갑 주소 원본:", row.address, "| 길이:", row.address.length, "| 인코딩:", encodeURIComponent(row.address));
            if (balances[row.address]) return;
            setBalances(prev => ({ ...prev, [row.address]: { value: null, loading: true, error: null } }));
            fetch(`/api/proxy-balance?address=${encodeURIComponent(row.address.trim())}`)
                .then(res => {
                    console.log("[WalletStatsTable] API 응답 status:", res.status, "주소:", row.address.trim());
                    if (!res.ok) throw new Error('잔액 조회 실패');
                    return res.json();
                })
                .then(json => {
                    console.log("[WalletStatsTable] API 응답 데이터:", json);
                    const sat = json?.txHistory?.balanceSat;
                    const btc = typeof sat === 'number' ? (sat / 1e8) : null;
                    setBalances(prev => ({ ...prev, [row.address]: { value: btc, loading: false, error: null } }));
                })
                .catch(() => {
                    setBalances(prev => ({ ...prev, [row.address]: { value: null, loading: false, error: '잔액 조회 실패' } }));
                });
        });
    }, [stats, balances]);

    return (
        <Card className="p-3">
            <CardHeader>
                <CardTitle>지갑별 비밀번호 통계</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs p-1">지갑 주소</TableHead>
                                <TableHead className="text-xs p-1">지갑 등록일</TableHead>
                                <TableHead className="text-xs p-1">비밀번호 개수</TableHead>
                                <TableHead className="text-xs p-1">최근 비밀번호 등록일</TableHead>
                                <TableHead className="text-xs p-1">잔액(BTC)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((row) => (
                                <TableRow key={row.address}>
                                    <TableCell className="font-mono text-xs p-1">{row.address}</TableCell>
                                    <TableCell className="text-xs p-1">{row.walletCreatedAt ? new Date(row.walletCreatedAt).toLocaleString() : "-"}</TableCell>
                                    <TableCell className="text-xs p-1">{row.passwordCount}</TableCell>
                                    <TableCell className="text-xs p-1">{row.latestPasswordCreatedAt ? new Date(row.latestPasswordCreatedAt).toLocaleString() : "-"}</TableCell>
                                    <TableCell className="text-xs p-1">
                                        {balances[row.address] && balances[row.address].loading && <span>조회 중...</span>}
                                        {balances[row.address] && !balances[row.address].loading && balances[row.address].value !== null && (
                                            <span>{balances[row.address].value.toFixed(8)}</span>
                                        )}
                                        {balances[row.address] && !balances[row.address].loading && balances[row.address].error && (
                                            <span className="text-red-500">{balances[row.address].error}</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
} 