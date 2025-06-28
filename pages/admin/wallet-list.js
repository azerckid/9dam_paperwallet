import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WalletList() {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/wallet/getAllWalletAccounts")
            .then(res => res.json())
            .then(data => {
                setWallets(data);
                setLoading(false);
            });
    }, []);

    // CSV Export 기능
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {wallets.map(w => (
                                    <TableRow key={w.id}>
                                        <TableCell className="text-xs p-1">{w.id}</TableCell>
                                        <TableCell className="font-mono text-xs p-1">{w.account}</TableCell>
                                        <TableCell className="text-xs p-1">{w.created_at ? new Date(w.created_at).toLocaleString() : "-"}</TableCell>
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