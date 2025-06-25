import { supabase } from '@/libs/supabaseClient';

export default async function handler(req, res) {
    try {
        // 요청에서 walletAccountId 추출
        console.log(req.body)
        const { walletAccountId } = req.body;
        console.log("walletAccountId", walletAccountId);

        // 유효성 검사
        if (!walletAccountId) {
            return res.status(400).json({ error: 'WalletAccountId is required' });
        }

        // 해당 walletAccountId에 대한 모든 비밀번호를 생성순(오래된 순)으로 조회
        const { data, error } = await supabase
            .from('passwords')
            .select('password, created_at, updated_at')
            .eq('wallet_account_id', walletAccountId)
            .order('created_at', { ascending: true });
        if (error) {
            console.error('Supabase select error:', error);
            return res.status(500).json({ error: error.message });
        }

        // 결과 반환
        res.status(200).json(data);
        console.log("passwords", data);
    } catch (error) {
        console.error('Error retrieving passwords:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}