import db from '../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success?: boolean;
  downloadCount?: number;
  error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    db.run('INSERT INTO download_count (count) VALUES (1)', function (err: any) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true });
    });
  } else {
    res.status(405).end();
  }
}
