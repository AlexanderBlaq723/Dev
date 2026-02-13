const wishes = new Map();

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { id, data } = req.body;
    wishes.set(id, data);
    return res.json({ success: true, id });
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    const data = wishes.get(id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true, data });
  }

  res.status(405).json({ error: 'Method not allowed' });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};
