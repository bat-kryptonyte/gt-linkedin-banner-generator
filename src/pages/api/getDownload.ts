import db from '../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success?: boolean;
  downloadCount?: number;
  error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    db.get('SELECT SUM(count) as total FROM download_count', [], (err: any, row: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, downloadCount: row.total });
    });
  } else {
    res.status(405).end();
  }
}
