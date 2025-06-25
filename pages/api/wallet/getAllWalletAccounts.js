import { supabase } from '@/libs/supabaseClient';

export default async function getAllWalletAccounts(req, res) {
    try {
        const { data, error } = await supabase
            .from('wallet_accounts')
            .select('*');
        if (error) {
            console.error('Supabase select error:', error);
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error retrieving wallet accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


