import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).end();

    // 1. 전체 지갑 주소 수
    const { count: totalWallets } = await supabase
        .from("wallet_accounts")
        .select("id", { count: "exact", head: true });

    // 2. 전체 비밀번호(시크릿 넘버) 수
    const { count: totalPasswords } = await supabase
        .from("passwords")
        .select("id", { count: "exact", head: true });

    // 3. 지갑별 통계
    // (지갑별: 주소, 등록일, 비밀번호 개수, 최근 비밀번호 등록일)
    const { data: wallets, error: walletsError } = await supabase
        .from("wallet_accounts")
        .select("id, account, created_at")
        .order("created_at", { ascending: false });

    if (walletsError) {
        return res.status(500).json({ error: walletsError.message });
    }

    // 각 지갑별로 비밀번호 개수/최신 등록일 조회
    const walletStats = [];
    for (const wallet of wallets) {
        // 비밀번호 개수 및 최신 등록일
        const { data: pwData, error: pwError } = await supabase
            .from("passwords")
            .select("created_at")
            .eq("wallet_account_id", wallet.id)
            .order("created_at", { ascending: false });

        if (pwError) {
            return res.status(500).json({ error: pwError.message });
        }

        walletStats.push({
            address: wallet.account,
            walletCreatedAt: wallet.created_at,
            passwordCount: pwData.length,
            latestPasswordCreatedAt: pwData[0]?.created_at || null,
        });
    }

    // 날짜별 지갑 등록 수 집계
    const { data: walletDates, error: walletDatesError } = await supabase
        .from("wallet_accounts")
        .select("created_at");
    if (walletDatesError) {
        return res.status(500).json({ error: walletDatesError.message });
    }
    const dateCountMap = {};
    walletDates.forEach(w => {
        const date = w.created_at?.slice(0, 10); // YYYY-MM-DD
        if (date) dateCountMap[date] = (dateCountMap[date] || 0) + 1;
    });
    const walletDateCounts = Object.entries(dateCountMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
        totalWallets,
        totalPasswords,
        walletStats,
        walletDateCounts,
    });
} 