// Inlines fonts, three.js and modules into one self-contained dist/index.html.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const strip = f => readFileSync(f, 'utf8').replace(/^import .*$/gm, '').replace(/^export \{[^}]*\};?$/gm, '').replace(/^export /gm, '');
const font = (fam, file, w) => `@font-face{font-family:${fam};src:url(data:font/woff2;base64,${readFileSync('assets/' + file).toString('base64')}) format('woff2');font-weight:${w};font-display:swap}`;
const fonts = [font('Plex', 'ibm-plex-sans-latin-300-normal.woff2', 300), font('Plex', 'ibm-plex-sans-latin-400-normal.woff2', 400), font('Plex', 'ibm-plex-sans-latin-500-normal.woff2', 500),
  font('PlexAr', 'ibm-plex-sans-arabic-arabic-400-normal.woff2', 300), font('PlexAr', 'ibm-plex-sans-arabic-arabic-400-normal.woff2', 400), font('PlexAr', 'ibm-plex-sans-arabic-arabic-500-normal.woff2', 500)].join('\n');
const app = ['src/catalog.js', 'src/concierge.js', 'src/stage.js', 'src/app.js'].map(strip).join('\n');
const html = readFileSync('index.html', 'utf8').replace('/*FONTS*/', () => fonts).replace('/*THREE*/', () => readFileSync('vendor/three.min.js', 'utf8')).replace('/*APP*/', () => app);
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html);
// Public build (GitHub Pages): locked down with a Content Security Policy. No network access, no remote code.
const CSP = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; font-src data:; img-src data: blob:; connect-src 'none'; form-action 'none'; base-uri 'none'";
mkdirSync('docs', { recursive: true });
writeFileSync('docs/index.html', html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="${CSP}">\n<meta name="referrer" content="no-referrer">`));
console.log('dist/index.html', (html.length / 1024).toFixed(0) + ' KB');
