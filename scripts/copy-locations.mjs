import { cpSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'static', 'locations');
const dest = join(root, 'public', 'locations');

if (existsSync(src)) {
  cpSync(src, dest, { recursive: true });
  console.log('Copied static/locations → public/locations');
}
