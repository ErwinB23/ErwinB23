// Rebuild the local, dependency-free SVG artwork: node scripts/build-assets.mjs
// The portrait stays unmodified; SVG clipping only controls its placement.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'assets');
await mkdir(path.join(assets, 'badges'), { recursive: true });
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const photo = (await readFile(path.join(assets, 'portrait.jpeg'))).toString('base64');
const svg = (w, h, title, content) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${esc(title)}</title>${content}</svg>`;
const save = (name, body) => writeFile(path.join(assets, name), body, 'utf8');

for (const lang of ['es', 'en']) {
  const es = lang === 'es';
  await save(`header-${lang}.svg`, svg(1200, 470, 'Erwin Brayam Inca Pauccara | Web · Mobile · AI', `
    <defs>
      <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b1225"/><stop offset="1" stop-color="#181135"/></linearGradient>
      <linearGradient id="accent"><stop stop-color="#67e8f9"/><stop offset=".5" stop-color="#7c9cff"/><stop offset="1" stop-color="#c084fc"/></linearGradient>
      <radialGradient id="glow"><stop stop-color="#7c3aed" stop-opacity=".35"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
      <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#8491c4" stroke-opacity=".07"/></pattern>
      <clipPath id="frame"><rect x="852" y="70" width="278" height="330" rx="28"/></clipPath>
    </defs>
    <style>
      .orbit {transform-origin:985px 236px;animation:turn 45s linear infinite}
      .blink {animation:pulse 4s ease-in-out infinite}
      @keyframes turn {to {transform:rotate(360deg)}}
      @keyframes pulse {50% {opacity:.45}}
      @media(prefers-reduced-motion:reduce){.orbit,.blink{animation:none}}
      text{font-family:Segoe UI,Arial,sans-serif}
    </style>
    <rect width="1200" height="470" rx="24" fill="url(#bg)"/>
    <rect width="1200" height="470" rx="24" fill="url(#grid)"/>
    <ellipse cx="955" cy="235" rx="355" ry="295" fill="url(#glow)"/>
    <rect x="1" y="1" width="1198" height="468" rx="23" fill="none" stroke="#30314b"/>
    <path d="M24 1H1176" stroke="url(#accent)" stroke-width="2"/>
    <g class="orbit" fill="none" stroke="#a78bfa" stroke-opacity=".27">
      <circle cx="985" cy="236" r="201" stroke-dasharray="3 12"/>
      <circle cx="985" cy="35" r="5" fill="#67e8f9" stroke="none"/>
    </g>
    <text x="56" y="61" font-size="17" font-weight="700" fill="#67e8f9" letter-spacing="2">&lt; EB / &gt;</text>
    <text x="175" y="60" font-size="12" fill="#a4abc5" letter-spacing="2.8">ERWINB23 · DEVELOPER PROFILE</text>
    <text x="56" y="125" font-size="22" fill="#cbd5e1">${es ? 'Hola, soy' : "Hi, I'm"}</text>
    <text x="52" y="203" font-size="67" font-weight="750" fill="#f8fafc" letter-spacing="-2">Erwin Brayam</text>
    <text x="52" y="279" font-size="67" font-weight="750" fill="url(#accent)" letter-spacing="-2">Inca Pauccara</text>
    <text x="56" y="329" font-size="21" fill="#d2d9ed">${es ? 'Desarrollo web · Aplicaciones móviles · IA' : 'Web development · Mobile applications · AI'}</text>
    <circle class="blink" cx="62" cy="367" r="4" fill="#67e8f9"/>
    <text x="77" y="373" font-size="15" fill="#9ba8c9">${es ? 'Estudiante de Ingeniería de Sistemas' : 'Systems Engineering student'}</text>
    <path d="M56 411H723" stroke="#31344e"/>
    <text x="56" y="440" font-size="11" letter-spacing="2.4" fill="#929ebf">WEB / MOBILE / AI-ASSISTED DEVELOPMENT</text>
    <rect x="844" y="62" width="294" height="346" rx="34" fill="#13172c" stroke="url(#accent)" stroke-width="1.5"/>
    <g clip-path="url(#frame)">
      <image x="801" y="-15" width="373" height="497.333" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/jpeg;base64,${photo}"/>
    </g>
    <rect x="878" y="378" width="226" height="39" rx="19.5" fill="#11182b" stroke="#575082"/>
    <circle cx="899" cy="398" r="4" fill="#67e8f9"/>
    <text x="915" y="403" font-size="12" fill="#e6eaff" letter-spacing="1">${es ? 'SIEMPRE APRENDIENDO' : 'ALWAYS LEARNING'}</text>
  `));

  await save(`header-mobile-${lang}.svg`, svg(640, 650, 'Erwin Brayam Inca Pauccara | Web · Mobile · AI', `
    <defs>
      <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b1225"/><stop offset="1" stop-color="#21113c"/></linearGradient>
      <linearGradient id="accent"><stop stop-color="#67e8f9"/><stop offset="1" stop-color="#c084fc"/></linearGradient>
      <clipPath id="portrait"><rect x="384" y="50" width="205" height="236" rx="26"/></clipPath>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#8491c4" stroke-opacity=".07"/></pattern>
    </defs>
    <style>text{font-family:Segoe UI,Arial,sans-serif}.dot{animation:pulse 4s infinite}@keyframes pulse{50%{opacity:.4}}@media(prefers-reduced-motion:reduce){.dot{animation:none}}</style>
    <rect width="640" height="650" rx="25" fill="url(#bg)"/>
    <rect width="640" height="650" rx="25" fill="url(#grid)"/>
    <rect x="1" y="1" width="638" height="648" rx="24" fill="none" stroke="#373052"/>
    <text x="40" y="79" font-size="25" font-weight="700" fill="#67e8f9">&lt; EB / &gt;</text>
    <text x="40" y="120" font-size="17" letter-spacing="2" fill="#abb7d7">ERWINB23</text>
    <text x="40" y="229" font-size="29" fill="#cbd5e1">${es?'Hola, soy':"Hi, I'm"}</text>
    <rect x="379" y="45" width="215" height="246" rx="31" fill="none" stroke="url(#accent)" stroke-width="2"/>
    <g clip-path="url(#portrait)"><image x="340" y="-12" width="285" height="380" xlink:href="data:image/jpeg;base64,${photo}"/></g>
    <text x="36" y="362" font-size="59" font-weight="750" fill="#f8fafc" letter-spacing="-1.5">Erwin Brayam</text>
    <text x="36" y="433" font-size="59" font-weight="750" fill="url(#accent)" letter-spacing="-1.5">Inca Pauccara</text>
    <text x="40" y="489" font-size="23" fill="#d8def1">${es?'Desarrollo web · Aplicaciones móviles':'Web development · Mobile applications'}</text>
    <text x="40" y="529" font-size="22" fill="#b4a9db">${es?'Estudiante de Ingeniería de Sistemas':'Systems Engineering student'}</text>
    <path d="M40 567H599" stroke="#3b3659"/>
    <circle class="dot" cx="46" cy="604" r="5" fill="#67e8f9"/>
    <text x="65" y="611" font-size="17" letter-spacing="1.5" fill="#adbad5">${es?'SIEMPRE APRENDIENDO · WEB / MOBILE / IA':'ALWAYS LEARNING · WEB / MOBILE / AI'}</text>
  `));

  await save(`peru-app-${lang}.svg`, svg(1200, 340, 'Peru App | React · JavaScript · HTML5 · CSS3', `
    <defs>
      <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#151d39"/><stop offset="1" stop-color="#201544"/></linearGradient>
      <linearGradient id="ridge" x2="1" y2="1"><stop stop-color="#536dc0"/><stop offset="1" stop-color="#31234f"/></linearGradient>
      <linearGradient id="near"><stop stop-color="#294667"/><stop offset="1" stop-color="#6853a4"/></linearGradient>
      <clipPath id="clip"><rect width="1200" height="340" rx="20"/></clipPath>
    </defs>
    <g clip-path="url(#clip)">
      <rect width="1200" height="340" fill="url(#bg)"/>
      <g fill="none" stroke="#848ac7" stroke-opacity=".12"><circle cx="975" cy="136" r="180"/><circle cx="975" cy="136" r="150"/><circle cx="975" cy="136" r="120"/></g>
      <circle cx="987" cy="105" r="42" fill="#9bb8ff"/>
      <path d="M567 340L803 88L927 246L1030 148L1200 340Z" fill="url(#ridge)"/>
      <path d="M757 139L803 88L850 148L817 135L801 148L785 132Z" fill="#b2c8ec"/>
      <path d="M650 340L894 204L990 286L1102 217L1240 340Z" fill="url(#near)"/>
      <path d="M670 330Q785 275 867 286T1045 285" stroke="#7dd3fc" stroke-width="2" fill="none" stroke-dasharray="5 7"/>
      <circle cx="867" cy="286" r="5" fill="#a5f3fc"/>
      <text x="48" y="52" fill="#a5b4fc" font-family="Segoe UI,Arial,sans-serif" font-size="13" letter-spacing="3">${es ? 'PROYECTO DESTACADO / 01' : 'FEATURED PROJECT / 01'}</text>
      <text x="43" y="134" fill="#f1f5ff" font-family="Segoe UI,Arial,sans-serif" font-size="74" font-weight="750" letter-spacing="-2">PERÚ APP</text>
      <text x="48" y="181" fill="#a5f3fc" font-family="Segoe UI,Arial,sans-serif" font-size="27">${es ? 'Un país. Miles de historias.' : 'One country. A thousand stories.'}</text>
      <text x="48" y="225" fill="#bdc6df" font-family="Segoe UI,Arial,sans-serif" font-size="16">${es ? 'Explora su cultura, diversidad y riqueza.' : 'Explore its culture, diversity and richness.'}</text>
      <rect x="48" y="273" width="308" height="30" rx="15" fill="#0c1427" stroke="#414369"/>
      <text x="65" y="293" fill="#d7d9f5" font-family="Segoe UI,Arial,sans-serif" font-size="13">REACT · JAVASCRIPT · HTML5 · CSS3</text>
    </g>
  `));
  await save(`footer-${lang}.svg`, svg(1200, 150, es ? 'Aprender. Construir. Compartir.' : 'Learn. Build. Share.', `
    <defs><linearGradient id="a"><stop stop-color="#67e8f9"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>
    <rect width="1200" height="150" rx="20" fill="#101629"/>
    <path d="M48 1H1152" stroke="url(#a)"/>
    <text x="600" y="68" fill="url(#a)" font-family="Segoe UI,Arial,sans-serif" font-size="30" font-weight="650" text-anchor="middle">${es ? 'Aprender. Construir. Compartir.' : 'Learn. Build. Share.'}</text>
    <text x="600" y="105" fill="#a6b1ce" font-family="Segoe UI,Arial,sans-serif" font-size="17" text-anchor="middle">${es ? 'Gracias por visitar mi perfil — ErwinB23' : 'Thanks for visiting my profile — ErwinB23'}</text>
  `));
}

// Original textual badges: no external logo dependency and no implied certifications.
const badges = [
  ['javascript','JavaScript','JS','#f7df1e'], ['typescript','TypeScript','TS','#60a5fa'], ['python','Python','Py','#a5c8f5'],
  ['html5','HTML5','5','#fb923c'], ['css3','CSS3','3','#7dd3fc'], ['react','React','R','#67e8f9'], ['tailwind','Tailwind CSS','~','#67e8f9'],
  ['react-native','React Native','R','#67e8f9'], ['expo','Expo','E','#ddd6fe'], ['flutter','Flutter','F','#7dd3fc'],
  ['sqlserver','SQL Server','DB','#fda4af'], ['postgresql','PostgreSQL','PG','#93c5fd'], ['supabase','Supabase','S','#6ee7b7'], ['api','REST API','{}','#c4b5fd'],
  ['git','Git','G','#fdba74'], ['github','GitHub','GH','#cbd5e1'],
  ['chatgpt','ChatGPT','AI','#6ee7b7'], ['codex','Codex','>_','#c4b5fd'], ['copilot','GitHub Copilot','Co','#a5b4fc'], ['gemini','Gemini','✦','#93c5fd'],
  ['claude','Claude','C','#fdba74'], ['claude-code','Claude Code','>_','#fdba74'], ['perplexity','Perplexity','P','#67e8f9'], ['kimi','Kimi','K','#a5b4fc'],
  ['projects-es','Mi proyecto','↗','#67e8f9'], ['projects-en','My project','↗','#67e8f9'], ['contact-es','Hablemos','@','#c4b5fd'], ['contact-en',"Let's talk",'@','#c4b5fd'],
  ['demo-es','Ver aplicación','↗','#67e8f9'], ['demo-en','Live application','↗','#67e8f9'], ['source-es','Ver código','<>','#c4b5fd'], ['source-en','View source','<>','#c4b5fd'],
  ['linkedin','LinkedIn','in','#93c5fd'], ['facebook','Facebook','f','#93c5fd'], ['instagram','Instagram','◎','#d8b4fe'], ['gmail','Gmail','@','#fda4af'],
  ['tiktok-es','TikTok · pronto','♪','#94a3b8'], ['tiktok-en','TikTok · soon','♪','#94a3b8'], ['tiktok','TikTok','♪','#67e8f9']
];
for (const [file,label,glyph,color] of badges) {
  const width = Math.ceil(54 + label.length * 7.5);
  await save(`badges/${file}.svg`, svg(width, 36, label, `
    <rect x=".5" y=".5" width="${width-1}" height="35" rx="8" fill="#151c30" stroke="#36415b"/>
    <rect x="7" y="6" width="25" height="24" rx="6" fill="${color}" fill-opacity=".12"/>
    <text x="19.5" y="22.5" text-anchor="middle" fill="${color}" font-family="Segoe UI,Arial,sans-serif" font-size="12" font-weight="700">${esc(glyph)}</text>
    <text x="40" y="23" fill="#e9eefc" font-family="Segoe UI,Arial,sans-serif" font-size="13" font-weight="600">${esc(label)}</text>
  `));
}

try { await readFile(path.join(assets, 'snake.svg')); }
catch {
  await save('snake.svg', svg(900, 130, 'Snake: pending first GitHub Actions run', `
    <rect width="900" height="130" rx="16" fill="#11182b"/>
    <path d="M42 64h44v-20h38v38h38" fill="none" stroke="#a78bfa" stroke-width="10" stroke-linejoin="round"/>
    <text x="202" y="57" fill="#e8edff" font-family="Segoe UI,Arial,sans-serif" font-size="20">Tu snake se activará con GitHub Actions.</text>
    <text x="202" y="89" fill="#a4aecb" font-family="Segoe UI,Arial,sans-serif" font-size="17">Your contribution snake activates after the first workflow run.</text>
  `));
}
console.log('SVG artwork and bilingual badges generated.');
