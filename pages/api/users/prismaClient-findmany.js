import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .ilike('username', '%a%');
        if (error) {
            console.error('Supabase select error:', error);
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}