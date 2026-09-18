// Node 22+; no third-party dependencies. Only public data is requested.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const username = process.env.PROFILE_USERNAME || 'ErwinB23';
if (!/^[a-zA-Z0-9-]+$/.test(username)) throw new Error('Invalid GitHub username');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetDir = path.join(root, 'assets');
const headers = { 'User-Agent': `${username}-profile`, Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
async function api(endpoint) {
  const r = await fetch(`https://api.github.com${endpoint}`, { headers, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`GitHub ${endpoint}: HTTP ${r.status}`);
  return r.json();
}

// Fetch all owned public repositories; don't count forks as original work.
const user = await api(`/users/${username}`);
const repos = [];
for (let page = 1; ; page++) {
  const batch = await api(`/users/${username}/repos?type=owner&per_page=100&page=${page}`);
  repos.push(...batch.filter(r => !r.fork && !r.private));
  if (batch.length < 100) break;
}
const languages = {};
for (const repo of repos) {
  const data = await api(`/repos/${username}/${encodeURIComponent(repo.name)}/languages`);
  for (const [name, bytes] of Object.entries(data)) languages[name] = (languages[name] || 0) + bytes;
}

// GitHub's public contribution calendar provides public counts without a PAT.
// Parse by element ids (not tooltip order), validate before replacing the assets.
const calendarResponse = await fetch(`https://github.com/users/${username}/contributions`, {
  headers: { 'User-Agent': `${username}-profile`, 'Accept-Language': 'en-US' }, signal: AbortSignal.timeout(30000)
});
if (!calendarResponse.ok) throw new Error(`Calendar: HTTP ${calendarResponse.status}`);
const calendarHtml = await calendarResponse.text();
const tooltips = new Map();
for (const match of calendarHtml.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
  const id = match[1].match(/\bfor="([^"]+)"/)?.[1];
  const content = match[2].replace(/<[^>]+>/g, '').trim();
  const countText = content.match(/^([\d,]+|No) contributions?\b/i)?.[1];
  if (id && countText !== undefined) tooltips.set(id, countText.toLowerCase() === 'no' ? 0 : Number(countText.replaceAll(',', '')));
}
const days = [];
for (const match of calendarHtml.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)) {
  const attributes = match[1];
  const date = attributes.match(/\bdata-date="([^"]+)"/)?.[1];
  const id = attributes.match(/\bid="([^"]+)"/)?.[1];
  const level = Number(attributes.match(/\bdata-level="(\d)"/)?.[1]);
  const count = tooltips.get(id);
  if (date && count !== undefined && Number.isInteger(level)) days.push({ date, count, level });
}
days.sort((a,b) => a.date.localeCompare(b.date));
if (days.length < 350 || new Set(days.map(d => d.date)).size !== days.length) {
  throw new Error('Calendar format changed or is incomplete. Existing cards have not been overwritten.');
}
const totalContributions = days.reduce((n,d) => n+d.count,0);
let longestStreak = 0, current = 0;
for (const day of days) { current = day.count ? current + 1 : 0; longestStreak = Math.max(longestStreak, current); }
const stats = { username, updated: new Date().toISOString(), publicRepos: user.public_repos,
  originalRepos: repos.length, followers: user.followers, totalContributions, longestStreak,
  from: days[0].date, to: days.at(-1).date, languages, days };

const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const t = (x,y,text,size=18,color='#a6b1cc',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(text)}</text>`;
const svg = (h,title,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${h}" viewBox="0 0 1000 ${h}" role="img"><title>${esc(title)}</title><style>text{font-family:Segoe UI,Arial,sans-serif}</style><rect x="1" y="1" width="998" height="${h-2}" rx="18" fill="#11182b" stroke="#303c59"/>${body}</svg>`;
const save = (name,data) => writeFile(path.join(assetDir,name),data,'utf8');
await mkdir(assetDir, { recursive: true });
for (const lang of ['es','en']) {
  const es = lang === 'es';
  const period = `${stats.from} — ${stats.to}`;
  const metrics = [
    [stats.publicRepos, es?'Repositorios públicos':'Public repositories'],
    [stats.totalContributions, es?'Contribuciones':'Contributions'],
    [stats.longestStreak, es?'Mejor racha · días':'Longest streak · days']
  ];
  await save(`stats-${lang}.svg`, svg(225, `${username}: ${stats.publicRepos} repositories, ${stats.totalContributions} contributions, ${stats.longestStreak} day longest streak`,
    t(32,39,es?'EN GITHUB / ERWINB23':'ON GITHUB / ERWINB23',13,'#a5b4fc','letter-spacing="2"') +
    metrics.map(([value,label],i) => t(32+i*325,113,value,52,['#67e8f9','#a5b4fc','#c4b5fd'][i],'font-weight="700"')+t(32+i*325,147,label,18,'#e0e5f2')).join('')+
    '<path d="M32 171H968" stroke="#2c3550"/>' +
    t(32,203,`${es?'Contribuciones y racha dentro del periodo':'Contributions and streak within'}: ${period}`,14)));

  const palette = ['#202b43','#334b86','#5c65c0','#9382e6','#bdebf5'];
  const first = Date.parse(`${days[0].date}T00:00:00Z`);
  const offset = new Date(first).getUTCDay();
  const cells = days.map(day => {
    const index = Math.round((Date.parse(`${day.date}T00:00:00Z`)-first)/86400000)+offset;
    return `<rect x="${32+Math.floor(index/7)*17.4}" y="${82+(index%7)*17.4}" width="13.5" height="13.5" rx="3" fill="${palette[day.level]}"><title>${day.date}: ${day.count}</title></rect>`;
  }).join('');
  await save(`activity-${lang}.svg`, svg(259, `${username} contribution calendar ${period}`,
    t(32,39,es?'CADA PASO CUENTA':'EVERY STEP COUNTS',14,'#a5b4fc','letter-spacing="2"')+
    t(32,64,period,13) + cells +
    t(32,236,es?'Contribuciones diarias · calendario público de GitHub':'Daily contributions · public GitHub calendar',14)+
    palette.map((c,i)=>`<rect x="${858+i*20}" y="222" width="14" height="14" rx="3" fill="${c}"/>`).join('')));

  const sorted = Object.entries(languages).sort((a,b)=>b[1]-a[1]);
  const total = sorted.reduce((n,[,bytes])=>n+bytes,0);
  const rows = sorted.slice(0,6);
  if (sorted.length > 6) rows.push([es?'Otros':'Other',sorted.slice(6).reduce((n,[,b])=>n+b,0)]);
  const colors = ['#67e8f9','#818cf8','#c084fc','#60a5fa','#f0abfc','#a7f3d0','#94a3b8'];
  let x=32;
  const bar = rows.map(([,bytes],i)=>{ const width=936*bytes/total;const result=`<rect x="${x}" y="70" width="${width}" height="12" fill="${colors[i]}"/>`;x+=width;return result;}).join('');
  const rowMarkup = rows.map(([name,bytes],i)=>`<circle cx="40" cy="${116+i*29}" r="5" fill="${colors[i]}"/>`+
    t(57,122+i*29,name,17,'#dfe6f8')+t(960,122+i*29,`${(bytes/total*100).toFixed(1)}%`,17,'#dfe6f8','text-anchor="end"')).join('');
  const h = 166+rows.length*29;
  await save(`languages-${lang}.svg`, svg(h,es?'Lenguajes por bytes en repositorios públicos propios':'Languages by bytes in owned public repositories',
    t(32,39,es?'LENGUAJES EN MIS REPOSITORIOS':'LANGUAGES IN MY REPOSITORIES',14,'#a5b4fc','letter-spacing="2"')+bar+rowMarkup+
    (total?'':t(32,119,es?'Todavía no hay datos de lenguajes.':'No language data yet.',17))+
    t(32,h-26,es?'Por bytes de código · sin forks · no representa nivel de dominio':'By code bytes · excludes forks · does not indicate proficiency',14)));
}
await save('stats-data.json',JSON.stringify(stats,null,2)+'\n');
console.log(JSON.stringify({repos:stats.publicRepos,contributions:stats.totalContributions,longestStreak,period:[stats.from,stats.to],languages}));
