import { supabase } from '@/lib/supabaseClient';
import { sha256 } from 'js-sha256';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { walletAccountId, passwordIndex, passwordInput } = req.body;

        if (!walletAccountId || typeof passwordIndex === 'undefined' || !passwordInput) {
            return res.status(400).json({ error: 'Missing required fields: walletAccountId, passwordIndex, passwordInput' });
        }

        const { data, error } = await supabase
            .from('passwords')
            .select('password')
            .eq('wallet_account_id', walletAccountId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Supabase select error:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No passwords found for this wallet account.' });
        }

        if (passwordIndex >= data.length) {
            return res.status(400).json({ error: 'Password index out of bounds.' });
        }

        const storedHashedPassword = data[passwordIndex].password;
        const hashedInput = sha256(passwordInput); // Hash the input received from the client

        if (hashedInput === storedHashedPassword) {
            return res.status(200).json({ success: true, message: 'Password verified successfully.' });
        } else {
            return res.status(401).json({ success: false, message: 'Incorrect password.' });
        }

    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
