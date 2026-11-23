import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('./', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
await build({ entryPoints: [fileURLToPath(new URL('src/index.jsx', root))], outfile: fileURLToPath(new URL('dist/index.js', root)), bundle: true, format: 'esm', jsx: 'automatic', external: ['react', 'react/*'], target: ['es2020'], sourcemap: true });
await copyFile(new URL('src/styles.css', root), new URL('dist/styles.css', root));
