import { sql } from '@vercel/postgres';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success?: boolean;
  downloadCount?: number;
  error?: string;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse<Data>) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS download_count (count INT);`;

    const results = await sql`SELECT SUM(count) as total FROM download_count;`;

    if (results.rows && results.rows.length > 0) {
      response.json({ success: true, downloadCount: results.rows[0].total || 0 });
    } else {
      response.status(404).json({ success: false, error: 'No data found in the table.' });
    }
  } catch (error) {
    response.status(500).json({ success: false, error: 'Internal server error.' });
  }
}
