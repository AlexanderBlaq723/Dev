import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase Environment Variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { fileName, fileType } = req.body;

        // Create a signed URL for uploading to the 'uploads' bucket
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .createSignedUploadUrl(fileName);

        if (error) throw error;

        return res.status(200).json({
            signedUrl: data.signedUrl,
            token: data.token,
            path: data.path
        });

    } catch (error) {
        console.error('API Error:', error.message);
        return res.status(500).json({
            error: error.message || 'Internal Server Error',
            details: 'Check Vercel logs for more info'
        });
    }
}
