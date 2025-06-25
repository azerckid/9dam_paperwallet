import { supabase } from '@/libs/supabaseClient';

export default async function handler(req, res) {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, password, email }]);
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