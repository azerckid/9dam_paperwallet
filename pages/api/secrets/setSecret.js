import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
    try {
        const { password, walletAccountId } = req.body;
        if (!password || !walletAccountId) {
            return res.status(400).json({ error: 'Missing password or walletAccountId' });
        }
        const { data, error } = await supabase
            .from('passwords')
            .insert([{ password, wallet_account_id: walletAccountId }]);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ ok: true, data });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}