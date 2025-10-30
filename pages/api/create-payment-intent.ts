// pages/api/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(501).json({ error: "Not implemented" })
}
