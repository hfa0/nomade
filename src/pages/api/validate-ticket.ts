import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';
const API_KEY = process.env.API_KEY || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ticketNumber = req.query.ticketNumber as string;
  if (!ticketNumber) {
    return res.status(400).json({ valid: false, error: 'Missing ticketNumber' });
  }

  try {
    const url = `${API_URL}/tickets/validate?ticketNumber=${encodeURIComponent(ticketNumber)}&key=${encodeURIComponent(API_KEY)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Ticket validation error:', err);
    return res.status(500).json({ valid: false, error: err.message });
  }
}
