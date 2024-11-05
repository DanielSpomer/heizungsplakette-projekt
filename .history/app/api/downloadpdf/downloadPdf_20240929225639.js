import { join } from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const filePath = join(process.cwd(), 'php/Heizungsplakette_Ausgefuellt.pdf');
  const pdfData = await fs.readFile(filePath);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Heizungsplakette_Ausgefuellt.pdf"');
  res.send(pdfData);
}
