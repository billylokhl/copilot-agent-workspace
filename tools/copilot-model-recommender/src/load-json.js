import fs from 'fs/promises';
import path from 'path';

export async function loadJson(p) {
  const resolved = p.startsWith('~')
    ? path.join(process.env.HOME, p.slice(1))
    : p;
  const raw = await fs.readFile(resolved, 'utf8');
  return JSON.parse(raw);
}

export async function writeJson(p, obj) {
  const resolved = p.startsWith('~')
    ? path.join(process.env.HOME, p.slice(1))
    : p;
  await fs.writeFile(resolved, JSON.stringify(obj, null, 2), 'utf8');
}
