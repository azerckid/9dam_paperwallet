import { supabase } from '@/libs/supabaseClient';

export default async function findWalletIdByAddress(req, res) {
    try {
        const { account } = req.body;
        if (!account) {
            return res.status(400).json({ error: 'Account is required' });
        }
        const { data, error } = await supabase
            .from('wallet_accounts')
            .select('id')
            .eq('account', account)
            .single();
        if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
            return res.status(500).json({ error: error.message });
        }
        if (!data) {
            return res.status(404).json({ message: 'Wallet account not found' });
        }
        res.status(200).json(data.id);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}



