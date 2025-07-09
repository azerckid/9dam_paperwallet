// Next.js API route to proxy balance requests and bypass CORS
export default async function handler(req, res) {
    const { address } = req.query;
    if (!address) return res.status(400).json({ error: 'No address provided' });

    const apiUrl = `https://blockchain.mobick.info/api/address/${encodeURIComponent(address)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Upstream fetch failed' });
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Proxy fetch failed' });
    }
} 