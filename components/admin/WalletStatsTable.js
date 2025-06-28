import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function WalletStatsTable({ stats }) {
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((row) => (
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
    );
} 