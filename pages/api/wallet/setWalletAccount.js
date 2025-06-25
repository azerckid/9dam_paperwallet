import { supabase } from '@/libs/supabaseClient';

export default async function handler(req, res) {
    try {
        const account = req.body.data;
        if (!account) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        // 1. 이미 등록된 주소인지 확인
        const { data: existing, error: selectError } = await supabase
            .from('wallet_accounts')
            .select('id')
            .eq('account', account)
            .single();
        if (selectError && selectError.code !== 'PGRST116') { // PGRST116: No rows found
            console.error('Supabase select error:', selectError);
            return res.status(500).json({ error: selectError.message });
        }
        if (existing) {
            return res.status(200).json({ ok: false, message: '이미 등록된 주소입니다.' });
        }
        // 2. 없으면 insert
        const { data, error } = await supabase
            .from('wallet_accounts')
            .insert([{ account }]);
        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ ok: true, data });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}