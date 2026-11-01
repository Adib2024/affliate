import { mulberry32, newSeed, pick, shuffle, spin, applyTone, hashText } from './spintax.js';
import { benefitsFromName, problemsFromName } from './keywords.js';
import {
  TONES, CATEGORIES, SEASONS, PLATFORMS, SOURCES, ANGLES, CTA, ENGAGE, DISCLOSURE, PLAN_SLOTS, DAYS_MS,
  HOOKS, COMMENT_POINTER, COMMENT_TEXT, VIRAL_HOOKS, VIRAL_ENGAGE, WATAK, STORY_HOOKS, STORY_ENGAGE,
} from './data.js';

const EMPTY = '\u0000';
const OPEN = '\u0001';
const CLOSE = '\u0002';

// Lindungi {{placeholder}} supaya tak disentuh oleh spintax {a|b}.
const protect = (t) => t.replace(/\{\{(\w+)\}\}/g, `${OPEN}$1${CLOSE}`);
// Spin + nada, kemudian placeholder kembali kepada {{x}}.
const render = (t, rand, tone) => applyTone(spin(protect(t), rand), tone, rand)
  .replace(new RegExp(`${OPEN}(\\w+)${CLOSE}`, 'g'), '{{$1}}');

// Kata ganti diri ([aku], [korang]) mesti konsisten dalam satu post.
function fixTone(tone, rand) {
  const fixed = { ...tone };
  for (const k of ['aku', 'korang']) fixed[k] = [spin(pick(rand, tone[k]), rand)];
  return fixed;
}
const EMOJI_RE = /(?:\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*|[0-9#*]️?⃣|\p{Regional_Indicator}{2})️?/gu;

// ---------- Utiliti produk ----------

export function cleanProductName(raw) {
  if (!raw) return '';
  let s = String(raw)
    .replace(/【[^】]*】|\[[^\]]*\]|\([^)]*\)|（[^）]*）/g, ' ')
    .replace(/[|]+/g, ' ')
    .replace(/\b(ready stock|readystock|hot sale|new arrival|free gift|free shipping|cod|viral|murah|terlaris|original|ori|100%|2023|2024|2025|2026)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = s.split(' ');
  if (words.length > 10) s = words.slice(0, 10).join(' ');
  return s.replace(/[-–,:;\s]+$/, '');
}

// Nama ringkas untuk caption: nama Shopee/TikTok biasanya disumbat keyword SEO.
// "DUBAI CHEWY COOKIE" → "Dubai Chewy Cookie" (huruf besar semua nampak macam menjerit)
function titleIfShouting(s) {
  const letters = s.replace(/[^A-Za-z]/g, '');
  if (letters.length < 6 || letters !== letters.toUpperCase()) return s;
  return s.toLowerCase().replace(/(^|[\s\-/(])([a-z])/g, (m, a, b) => a + b.toUpperCase())
    .replace(/\b(\d+)(ml|g|kg|pcs|cm|mm|w|l)\b/gi, (m, n, u) => n + u.toLowerCase());
}

export function smartName(raw, maxWords = 6, maxChars = 45) {
  let s = titleIfShouting(cleanProductName(raw));
  if (!s) return '';
  // Potong pada pemisah biasa ("Tudung Bawal - Cotton Premium", "Rak X for Y", "Serum, 30ml")
  const cut = s.split(/\s[-–|/]\s|,|\s(?:with|for|untuk|dengan|utk|w\/)\s/i)[0].trim();
  if (cut.split(' ').length >= 2) s = cut;
  s = s.replace(/\s[-–|/]\s/g, ' ');
  const out = [];
  for (const w of s.split(' ')) {
    if (out.length >= maxWords || [...out, w].join(' ').length > maxChars) break;
    out.push(w);
  }
  while (out.length > 1 && /^(for|with|and|&|untuk|dan|dengan|the|of|in|-)$/i.test(out[out.length - 1])) out.pop();
  return out.join(' ');
}

export function shortName(name) {
  const words = cleanProductName(name).split(' ').filter(Boolean);
  return words.slice(0, 4).join(' ');
}

export function parsePrice(v) {
  if (v === undefined || v === null) return null;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const fmtNum = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));
export const fmtRM = (n) => `RM${fmtNum(n)}`;

const kwCache = new Map();
// Padan ikut sempadan perkataan ("car" tak padan "scarf"), sokong jamak ("cookie" = "cookies").
function kwRegex(k) {
  if (!kwCache.has(k)) {
    const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    kwCache.set(k, new RegExp(`(^|[^a-z0-9])${esc}(s|es)?(?=[^a-z0-9]|$)`, 'i'));
  }
  return kwCache.get(k);
}

export function categoryScores(name) {
  const s = String(name || '').toLowerCase();
  const scores = {};
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    let score = 0;
    for (const k of cat.keywords) if (kwRegex(k).test(s)) score += k.length;
    scores[id] = score;
  }
  return scores;
}

export function guessCategory(name) {
  let best = 'lain';
  let bestScore = 0;
  for (const [id, score] of Object.entries(categoryScores(name))) {
    if (score > bestScore) { bestScore = score; best = id; }
  }
  return best;
}

export function detectSource(link) {
  const s = String(link || '').toLowerCase();
  if (/shopee|shp\.ee|shope\.ee/.test(s)) return 'shopee';
  if (/tiktok/.test(s)) return 'tiktok';
  return null;
}

const strike = (s) => [...s].map((c) => c + '̶').join('');
const lowerFirst = (s) => (s && !/^[A-Z]{2}/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const niceCeil = (n) => {
  const step = n < 100 ? 10 : n < 500 ? 50 : 100;
  return Math.ceil((n + 0.01) / step) * step;
};

// ---------- Pembolehubah template ----------

function buildVars(product, opts, rand, tone) {
  const cat = CATEGORIES[product.kategori] || CATEGORIES.lain;
  const src = SOURCES[product.source] || SOURCES.lain;
  const harga = parsePrice(product.harga);
  let hargaAsal = parsePrice(product.hargaAsal);
  if (hargaAsal && harga && hargaAsal <= harga) hargaAsal = null;

  let ks = (product.kelebihan || []).map((k) => String(k || '').trim()).filter(Boolean);
  // Kelebihan kurang → tambah dari keyword nama produk → kalau masih kurang, ayat kategori.
  if (ks.length < 2) ks = [...new Set([...ks, ...benefitsFromName(product.nama), ...cat.defaultK])].slice(0, 3);

  const noEmoji = opts.emoji === 'tiada';
  const bullet = noEmoji ? '-' : pick(rand, ['✅', '✔️', '👉', '🔹', '✨', '💯', '▪️']);
  const nums = noEmoji ? ['1.', '2.', '3.'] : ['1️⃣', '2️⃣', '3️⃣'];
  const toned = (t) => render(t, rand, tone);

  const nama = String(product.namaRingkas || '').trim() || smartName(product.nama) || 'produk ni';
  const namaWords = nama.split(' ').length;
  const vars = {
    nama,
    namaPendek: namaWords <= 4 ? nama : toned('{barang ni|benda ni|produk ni}'),
    harga: harga ? fmtRM(harga) : '',
    hargaNombor: harga ? fmtNum(harga) : '',
    hargaAsal: hargaAsal ? fmtRM(hargaAsal) : '',
    hargaAsalCoret: hargaAsal
      ? (opts.platform === 'whatsapp' ? `~${fmtRM(hargaAsal)}~` : strike(fmtRM(hargaAsal)))
      : '',
    diskaun: hargaAsal && harga ? `${Math.round((1 - harga / hargaAsal) * 100)}%` : '',
    jimat: hargaAsal && harga ? fmtRM(+(hargaAsal - harga).toFixed(2)) : '',
    hargaBulat: harga ? fmtRM(niceCeil(harga)) : '',
    k1: ks[0] || '', k2: ks[1] || '', k3: ks[2] || '',
    k1i: lowerFirst(ks[0] || ''), k2i: lowerFirst(ks[1] || ''), k3i: lowerFirst(ks[2] || ''),
    senarai: ks.map((k) => `${bullet} ${k}`).join('\n'),
    senaraiNombor: ks.map((k, i) => `${nums[i] || `${i + 1}.`} ${k}`).join('\n'),
    bilKelebihan: String(ks.length),
    untuk: product.untuk?.trim() || toned('{orang tersayang|keluarga|kawan baik|bestie}'),
    kedai: src.kedai,
    emoji: shuffle(rand, cat.emoji).slice(0, 1 + Math.floor(rand() * 2)).join(''),
    masalah: (() => {
      const own = problemsFromName(product.nama);
      return toned(pick(rand, own.length && rand() < 0.85 ? own : cat.masalah));
    })(),
    hasil: toned(pick(rand, cat.hasil || CATEGORIES.lain.hasil)),
    khas: toned(pick(rand, cat.khas || CATEGORIES.lain.khas)),
    musim: SEASONS[product.musim]?.lines.length ? toned(pick(rand, SEASONS[product.musim].lines)) : '',
    link: String(product.link || '').trim(),
  };
  // Versi pernyataan (tanpa tanda soal & emoji) untuk baris "Sebelum: ..."
  vars.masalahP = lowerFirst(vars.masalah.replace(EMOJI_RE, '').replace(/[?？]+/g, '').trim());
  vars.hasilI = lowerFirst(vars.hasil.replace(EMOJI_RE, '').replace(/[.!]+$/g, '').trim());
  return vars;
}

function fill(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ? vars[k] : EMPTY));
}

function dropEmptyLines(text) {
  return text.split('\n').filter((l) => !l.includes(EMPTY)).join('\n');
}

function tidy(text) {
  return text
    .split('\n')
    .map((l) => l.replace(/\b(ni|ini)\s+\1\b/gi, '$1').replace(/^(?!https?:)([a-z])/, (c) => c.toUpperCase()).replace(/[ \t]{2,}/g, ' ').replace(/ +([,.!?…)])/g, '$1').replace(/(\p{Extended_Pictographic}\uFE0F?)\./gu, '$1').replace(/\( +/g, '(').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function limitEmoji(text, level) {
  if (level === 'tiada') return tidy(text.replace(EMOJI_RE, ''));
  if (level === 'sikit') {
    return tidy(text.split('\n').map((line) => {
      let seen = 0;
      return line.replace(EMOJI_RE, (m) => (seen++ === 0 ? m : ''));
    }).join('\n'));
  }
  return text;
}

// Untuk X (280 aksara): hook + nama produk + kelebihan utama + harga.
function compactBody(body, vars) {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 2) return lines.join('\n');
  const out = [lines[0]];
  if (!lines[0].includes(vars.nama) && !lines[0].includes(vars.namaPendek)) out.push(`👉 ${vars.nama}`);
  if (vars.k1 && !out.join(' ').includes(vars.k1)) out.push(`✅ ${vars.k1}`);
  if (vars.hargaAsal) out.push(`${vars.harga} (asal ${vars.hargaAsal}) 🔥`);
  else if (vars.harga) out.push(`${vars.harga} je!`);
  return out.join('\n');
}

function pickHashtags(product, opts, rand) {
  const [min, max] = PLATFORMS[opts.platform].tags;
  if (!opts.hashtags || max === 0) return [];
  const n = min + Math.floor(rand() * (max - min + 1));
  if (!n) return [];
  const cat = CATEGORIES[product.kategori] || CATEGORIES.lain;
  const src = SOURCES[product.source] || SOURCES.lain;
  const pool = shuffle(rand, [...src.tags, ...cat.hashtags]);
  // Pastikan sekurang-kurangnya satu tag sumber (Shopee / TikTok).
  const first = pick(rand, src.tags);
  return [first, ...pool.filter((t) => t !== first)].slice(0, n);
}

const linkInComment = (opts) => Boolean(opts.linkComment) && ['facebook', 'threads'].includes(opts.platform);

function ctaLines(product, opts, rand, tone, vars) {
  const toned = (t) => render(t, rand, tone);
  const lines = [];
  if (opts.platform === 'tiktok') {
    lines.push(toned(pick(rand, CTA.tiktok[product.source === 'tiktok' ? 'tiktok' : 'shopee'])));
  } else if (opts.platform === 'instagram') {
    lines.push(toned(pick(rand, CTA.instagram)));
  } else if (vars.link && linkInComment(opts)) {
    lines.push(toned(pick(rand, COMMENT_POINTER)));
  } else if (vars.link) {
    const bank = CTA.link[opts.tone] || CTA.link.default;
    lines.push(fill(toned(pick(rand, bank)), vars));
  }
  return lines;
}

// ---------- Jana satu post ----------

// Mod Viral: satu ayat satu baris — senang dibaca masa scroll laju.
function punchy(text) {
  return text.split('\n').map((line) => {
    if (line.length < 60 || /^\s*(#|https?:)/.test(line)) return line;
    return line.split(/(?<=[.!?…])\s+(?=[A-Z0-9"“(])/).join('\n');
  }).join('\n');
}

function buildPost(product, rawOpts, angle, templateIndex, seed) {
  const opts = { ...rawOpts, viral: postStyle(rawOpts) !== 'jual' };
  const rand = mulberry32(seed);
  const tone = fixTone(TONES[opts.tone] || TONES.santai, rand);
  const vars = buildVars(product, opts, rand, tone);
  const platform = PLATFORMS[opts.platform] || PLATFORMS.facebook;

  // Watak cerita (Mod Storyline)
  const cap = (x) => (x ? x.charAt(0).toUpperCase() + x.slice(1) : x);
  const catWatak = (CATEGORIES[product.kategori] || {}).watak || {};
  vars.watak = pick(rand, catWatak[angle.watak] || WATAK[angle.watak] || WATAK.kawan);
  vars.watakCap = cap(vars.watak);
  vars.k1Cap = cap(vars.k1); vars.k2Cap = cap(vars.k2); vars.k3Cap = cap(vars.k3);

  // Threads / X: guna versi cerita pendek supaya muat had aksara
  const useShort = angle.short?.length && platform.limit && platform.limit <= 500;
  const tpl = useShort ? angle.short[templateIndex % angle.short.length] : angle.templates[templateIndex];
  let body = render(tpl, rand, tone);
  body = tidy(dropEmptyLines(fill(body, vars)));
  if (platform.compact && !angle.story) body = compactBody(body, vars);
  // Ayat khas kategori (contoh "Sesuai untuk rumah sewa") selepas senarai kelebihan.
  else if (vars.khas && rand() < 0.6) {
    const lastBullet = vars.senarai.split('\n').pop() || vars.senaraiNombor.split('\n').pop();
    const lines = body.split('\n');
    const idx = lines.findIndex((l) => l === lastBullet || l === vars.senaraiNombor.split('\n').pop());
    if (idx >= 0 && !body.includes(vars.khas)) {
      lines.splice(idx + 1, 0, `${vars.senarai.startsWith('-') ? '-' : '👉'} ${vars.khas}`);
      body = lines.join('\n');
    }
  }

  const blocks = [];
  // Hook "stop scroll" tambahan di baris pertama (bukan untuk X / angle yang ada format sendiri).
  const hookChance = angle.story ? 0.3 : opts.viral ? 0.8 : 0.45;
  if (opts.hooks !== false && !platform.compact && !useShort && !angle.noHook && rand() < hookChance) {
    const bank = angle.story ? STORY_HOOKS : opts.viral && rand() < 0.7 ? VIRAL_HOOKS : HOOKS;
    const hook = fill(render(pick(rand, bank), rand, tone), vars);
    if (!hook.includes(EMPTY)) blocks.push(hook);
  }
  if (vars.musim && rand() < 0.75) blocks.push(vars.musim);
  if (opts.viral && !platform.compact) body = punchy(body);
  blocks.push(body);

  const cta = ctaLines(product, opts, rand, tone, vars);
  // Elak dua ajakan "Komen" berturut-turut bila CTA sendiri dah minta komen.
  const askedComment = cta.some((l) => /komen|drop/i.test(l));
  const baseEngage = angle.story ? STORY_ENGAGE : opts.viral ? VIRAL_ENGAGE : ENGAGE;
  const engageBank = askedComment ? baseEngage.filter((e) => !/^\{?(Komen|Drop)/.test(e)) : baseEngage;
  // Template dah ada ajakan sendiri (tag/komen/save)? Jangan ulang.
  const bodyHasAsk = /\b(tag|komen|drop|save|simpan|share|kongsi)\b/i.test(body);
  const engage = opts.engage && opts.platform !== 'whatsapp' && !platform.compact && !bodyHasAsk
    ? render(pick(rand, engageBank), rand, tone) : '';
  const tail = [...cta, engage].filter(Boolean);
  if (tail.length) blocks.push(tail.join('\n'));
  if (opts.disclosure) blocks.push(pick(rand, DISCLOSURE));

  const tags = pickHashtags(product, opts, rand);
  let text = tidy(blocks.join('\n\n'));
  if (opts.platform === 'whatsapp') {
    const [first, ...rest] = text.split('\n');
    text = [`*${first.replace(/\*/g, '')}*`, ...rest].join('\n');
  }
  text = limitEmoji(text, opts.emoji);

  const withTags = (t) => (tags.length ? `${t}\n\n${tags.join(' ')}` : t);
  let full = withTags(text);
  // Hadkan panjang untuk Threads / X
  if (platform.limit && full.length > platform.limit) {
    while (tags.length && withTags(text).length > platform.limit) tags.pop();
    full = withTags(text);
    if (full.length > platform.limit) {
      // Buang baris badan (dari bawah) tapi kekalkan hook, CTA & penafian.
      const lines = text.split('\n');
      const tailCount = tail.length + (opts.disclosure ? 1 : 0);
      while (lines.length > tailCount + 1 && lines.join('\n').length > platform.limit) {
        lines.splice(lines.length - tailCount - 1, 1);
      }
      full = tidy(lines.join('\n'));
      if ([...full].length > platform.limit) full = `${[...full].slice(0, platform.limit - 1).join('')}…`;
    }
  }

  let comment = '';
  if (vars.link && linkInComment(opts)) {
    comment = limitEmoji(tidy(dropEmptyLines(fill(render(pick(rand, COMMENT_TEXT), rand, tone), vars))), opts.emoji);
  }

  const { score, tips } = scorePost(full, opts.platform, vars);
  return {
    id: `${angle.id}-${templateIndex}-${seed}`,
    comment,
    score,
    tips,
    angleId: angle.id,
    angleLabel: angle.label,
    templateIndex,
    seed,
    text: full,
    hash: hashText(full),
    chars: [...full].length,
  };
}

// ---------- Skor engagement (anggaran, berdasarkan amalan copywriting) ----------
const SWEET = {
  facebook: [150, 700], instagram: [150, 1200], tiktok: [80, 400], threads: [100, 500], x: [80, 280], whatsapp: [100, 600],
};

export function scorePost(text, platform, vars = {}) {
  const lines = text.split('\n');
  const first = (lines.find((l) => l.trim()) || '').trim();
  const body = lines.filter((l) => l.trim() && !l.trim().startsWith('#'));
  const avg = body.reduce((s, l) => s + l.length, 0) / Math.max(1, body.length);
  const emojis = (text.match(EMOJI_RE) || []).length;
  const n = [...text].length;
  const [lo, hi] = SWEET[platform] || SWEET.facebook;
  const checks = [
    [first.length <= 90, 15, 'Hook (baris pertama) lebih pendek & padu'],
    [/[?!]|\d|‼️|🚨|✋|👀|🤯|😳|😭|🥲/u.test(first), 10, 'Mulakan dengan soalan, nombor atau emosi'],
    [/RM\d/.test(text), 10, vars.harga ? 'Caption ni tak sebut harga — tekan 🔀 Tukar' : 'Isi harga — orang nak tahu harga dulu'],
    [/jimat|diskaun|%|asal/i.test(text), 10, vars.hargaAsal ? 'Caption ni tak tonjol jimat — cuba angle Jimat/FOMO' : 'Isi harga asal supaya nampak jimat'],
    [/https?:|beg kuning|keranjang|bio\b|link[^\n]*komen|komen[^\n]*link/i.test(text), 15, 'Tambah ajakan beli / link'],
    [/komen|tag |save|simpan|share|kongsi|❤️|drop/i.test(text), 15, 'Tambah ajakan komen, tag atau save'],
    [/\n\s*\n/.test(text) && avg <= 80, 10, 'Pecahkan perenggan supaya senang dibaca'],
    [emojis >= 2 && emojis <= 14, 5, 'Guna emoji secukupnya (2–14)'],
    [n >= lo && n <= hi, 10, `Panjang ideal untuk platform ni: ${lo}–${hi} aksara`],
  ];
  let score = 0;
  const tips = [];
  for (const [ok, pts, tip] of checks) {
    if (ok) score += pts;
    else tips.push(tip);
  }
  return { score, tips };
}

// Angle yang paling kerap viral (dipakai dalam Mod Viral bersama angle viral baru).
const VIRAL_FRIENDLY = ['lawak', 'soalan', 'rahsia', 'cerita', 'banding', 'fomo', 'tips'];

// Jenis post: 'story' (cerita penuh), 'viral' (pendek & punchy), 'jual' (jualan biasa).
export function postStyle(opts) {
  if (opts.style) return opts.style;
  return opts.viral === false ? 'jual' : 'viral';
}

export function anglePool(opts) {
  let pool = ANGLES.filter((a) => !(opts.tone === 'formal' && a.noFormal));
  if (opts.angles?.length) {
    const chosen = pool.filter((a) => opts.angles.includes(a.id));
    if (chosen.length) return chosen;
  }
  const style = postStyle(opts);
  if (style === 'story') {
    const stories = pool.filter((a) => a.story);
    // Cerita + sedikit angle bercerita sedia ada supaya 5 caption tetap berbeza
    return stories.length ? [...stories, ...pool.filter((a) => ['cerita', 'menyesal', 'testimoni'].includes(a.id))] : pool;
  }
  if (style === 'viral') return pool.filter((a) => a.viral || VIRAL_FRIENDLY.includes(a.id));
  return pool.filter((a) => !a.story && !a.viral);
}

function customAngle(opts) {
  const texts = (opts.customTemplates || []).map((t) => t.text).filter((t) => t && t.trim());
  return texts.length ? { id: 'saya', label: '✍️ Gaya Saya', templates: texts } : null;
}

/**
 * Jana beberapa post berbeza angle.
 * @returns {{posts: Array, seed: number}}
 */
export function generatePosts(product, opts, seed = newSeed(), seen = new Set()) {
  const rand = mulberry32(seed);
  const count = opts.count || 5;
  let pool = shuffle(rand, anglePool(opts));
  const mine = opts.useCustom !== false ? customAngle(opts) : null;
  if (mine) pool = [mine, ...pool];

  const posts = [];
  const usedCombos = new Set();
  let i = 0;
  let guard = 0;
  while (posts.length < count && guard++ < count * 20) {
    const angle = pool[i % pool.length];
    i++;
    const tIndex = Math.floor(rand() * angle.templates.length);
    const combo = `${angle.id}:${tIndex}`;
    if (usedCombos.has(combo) && usedCombos.size < pool.reduce((s, a) => s + a.templates.length, 0)) continue;
    usedCombos.add(combo);
    let post = buildPost(product, opts, angle, tIndex, Math.floor(rand() * 2 ** 32));
    // Anti-ulang: cuba lagi kalau teks sama pernah keluar sebelum ni.
    for (let r = 0; r < 8 && seen.has(post.hash); r++) {
      post = buildPost(product, opts, angle, Math.floor(rand() * angle.templates.length), Math.floor(rand() * 2 ** 32));
    }
    posts.push(post);
  }
  return { posts, seed };
}

/** Jana semula satu post dengan angle yang sama (butang 🔀 pada kad). */
export function rerollPost(product, opts, angleId, seen = new Set()) {
  const angle = angleId === 'saya' ? customAngle(opts) : ANGLES.find((a) => a.id === angleId);
  if (!angle) return null;
  let post;
  for (let r = 0; r < 10; r++) {
    const seed = newSeed();
    post = buildPost(product, opts, angle, seed % angle.templates.length, seed);
    if (!seen.has(post.hash)) break;
  }
  return post;
}

// ---------- Planner 7 hari ----------

export function generatePlan(product, opts, platforms, startDate = new Date(), seed = newSeed()) {
  const rand = mulberry32(seed);
  const pool = shuffle(rand, anglePool({ ...opts, angles: [] }));
  const slots = shuffle(rand, PLAN_SLOTS);
  const plats = platforms.length ? platforms : [opts.platform];
  const plan = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d + 1);
    const angle = pool[d % pool.length];
    const platform = plats[d % plats.length];
    const post = buildPost(product, { ...opts, platform }, angle,
      Math.floor(rand() * angle.templates.length), Math.floor(rand() * 2 ** 32));
    plan.push({
      day: DAYS_MS[date.getDay()],
      date: date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' }),
      slot: slots[d % slots.length],
      platform,
      post,
    });
  }
  return plan;
}

// ---------- Prompt untuk AI percuma (ChatGPT / Claude / Gemini) ----------

export function buildAIPrompt(product, opts) {
  const cat = CATEGORIES[product.kategori] || CATEGORIES.lain;
  const src = SOURCES[product.source] || SOURCES.lain;
  const plat = PLATFORMS[opts.platform] || PLATFORMS.facebook;
  const tone = TONES[opts.tone] || TONES.santai;
  const harga = parsePrice(product.harga);
  const hargaAsal = parsePrice(product.hargaAsal);
  const ks = (product.kelebihan || []).filter((k) => k && k.trim());
  const season = SEASONS[product.musim];

  const lines = [
    `Kau seorang copywriter affiliate Malaysia yang pakar buat post viral dengan engagement tinggi.`,
    ``,
    `Tulis 5 caption ${plat.label} yang BERBEZA untuk produk affiliate ${src.label} ni:`,
    `- Nama produk: ${cleanProductName(product.nama) || '(isi sendiri)'}`,
    `- Panggil produk ni dalam caption sebagai: "${String(product.namaRingkas || '').trim() || smartName(product.nama)}" (jangan tulis nama penuh)`,
    harga ? `- Harga: ${fmtRM(harga)}` : null,
    hargaAsal && harga && hargaAsal > harga ? `- Harga asal: ${fmtRM(hargaAsal)} (diskaun ${Math.round((1 - harga / hargaAsal) * 100)}%)` : null,
    ks.length ? `- Kelebihan: ${ks.join('; ')}` : null,
    `- Kategori: ${cat.label.replace(/^\S+\s/, '')}`,
    product.untuk ? `- Sasaran: ${product.untuk}` : null,
    season && product.musim !== 'tiada' ? `- Kempen: ${season.label}` : null,
    product.link && !['tiktok', 'instagram'].includes(opts.platform) ? `- Link affiliate: ${product.link}` : null,
    ``,
    `Syarat:`,
    `- Bahasa: ${opts.tone === 'rojak' ? 'campur BM + English (rojak) gaya urban Malaysia' : 'Bahasa Melayu Malaysia'}, nada ${tone.label.replace(/^\S+\s/, '').toLowerCase()}.`,
    `- Setiap caption guna angle berbeza: masalah→penyelesaian, testimoni, FOMO/stok terhad, fokus jimat, dan soalan yang ajak komen.`,
    `- Baris pertama mesti hook yang kuat untuk berhenti scroll.`,
    opts.emoji === 'tiada' ? `- Jangan guna emoji.` : `- Guna emoji secukupnya.`,
    opts.platform === 'tiktok'
      ? `- Akhiri dengan ajakan tekan ${product.source === 'tiktok' ? 'beg kuning' : 'link di bio'}.`
      : opts.platform === 'instagram' ? `- Akhiri dengan "link di bio" atau ajakan komen untuk dapat link.`
        : `- Letak link affiliate di hujung dengan ajakan bertindak (CTA).`,
    plat.limit ? `- Setiap caption maksimum ${plat.limit} aksara.` : null,
    opts.hashtags && plat.tags[1] ? `- Tambah ${plat.tags[0]}-${plat.tags[1]} hashtag yang relevan di hujung.` : `- Tanpa hashtag.`,
    `- Jangan buat dakwaan palsu (contoh: "100% berkesan", "diluluskan doktor").`,
    `- Nomborkan setiap caption (1-5), terus bagi caption tanpa penerangan tambahan.`,
  ];
  return lines.filter((l) => l !== null).join('\n');
}

// Utiliti dikongsi dengan enjin post viral bukan-affiliate (viral.js).
export const helpers = {
  EMPTY, EMOJI_RE, render, fixTone, fill, dropEmptyLines, tidy, limitEmoji, punchy,
};
