import { sql } from '@vercel/postgres';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success?: boolean;
  downloadCount?: number;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      await sql`INSERT INTO download_count (count) VALUES (1)`;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  } else {
    res.status(405).end();
  }
}
