import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (!stats) return <div className="flex justify-center items-center min-h-screen">데이터 없음</div>;

    return (
        <div className="flex flex-col gap-4 max-w-5xl mx-auto py-12 px-2">
            <div className="flex justify-end mb-4">
                <Button asChild variant="secondary">
                    <Link href="/admin/wallet-list">지갑 주소 목록으로 이동</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-3">
                    <CardHeader>
                        <CardTitle>전체 지갑 주소 수</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalWallets}</div>
                    </CardContent>
                </Card>
                <Card className="p-3">
                    <CardHeader>
                        <CardTitle>전체 비밀번호(시크릿 넘버) 수</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPasswords}</div>
                    </CardContent>
                </Card>
            </div>
            {stats.walletDateCounts && stats.walletDateCounts.length > 0 && (
                <Card className="p-3">
                    <CardHeader>
                        <CardTitle>지갑 주소 등록 추이</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ width: "100%", height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.walletDateCounts}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.walletStats.map((row) => (
                                    <TableRow key={row.address}>
                                        <TableCell className="font-mono text-xs p-1">{row.address}</TableCell>
                                        <TableCell className="text-xs p-1">{row.walletCreatedAt ? new Date(row.walletCreatedAt).toLocaleString() : "-"}</TableCell>
                                        <TableCell className="text-xs p-1">{row.passwordCount}</TableCell>
                                        <TableCell className="text-xs p-1">{row.latestPasswordCreatedAt ? new Date(row.latestPasswordCreatedAt).toLocaleString() : "-"}</TableCell>
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