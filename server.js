import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials missing in .env file!');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Wishes API
app.post('/api/wishes', async (req, res) => {
  try {
    const { id, data } = req.body;
    const { error } = await supabase
      .from('wishes')
      .insert([{ id, data }]);

    if (error) throw error;
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error saving wish:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/wishes', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const { data, error } = await supabase
      .from('wishes')
      .select('data')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ success: true, data: data.data });
  } catch (error) {
    res.status(404).json({ error: 'Wish not found' });
  }
});

// Upload API
app.post('/api/upload', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    const { data, error } = await supabase
      .storage
      .from('uploads')
      .createSignedUploadUrl(fileName);

    if (error) throw error;

    res.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path
    });
  } catch (error) {
    console.error('Error creating upload URL:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Proxying /api requests from Vite`);
});
