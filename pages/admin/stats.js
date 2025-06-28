import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { WalletChartCard } from "@/components/admin/WalletChartCard";
import { WalletStatsTable } from "@/components/admin/WalletStatsTable";

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
                <StatCard title="전체 지갑 주소 수" value={stats.totalWallets} />
                <StatCard title="전체 비밀번호(시크릿 넘버) 수" value={stats.totalPasswords} />
            </div>
            {stats.walletDateCounts && stats.walletDateCounts.length > 0 && (
                <WalletChartCard data={stats.walletDateCounts} />
            )}
            <WalletStatsTable stats={stats.walletStats} />
        </div>
    );
} 