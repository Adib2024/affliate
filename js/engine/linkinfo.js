// Baca maklumat produk terus dalam browser (tanpa server — sesuai untuk GitHub Pages).
//  1) Daripada URL penuh Shopee:  /Nama-Produk-i.123.456
//  2) Daripada parameter TikTok:  og_info={"title": "..."}
//  3) Daripada TEKS SHARE yang dicopy dari app Shopee / TikTok
//     (contoh: "Check out Tudung Bawal ... for RM19.90. Get it on Shopee now! https://s.shopee.com.my/xxx")

export function infoFromUrl(urlStr) {
  let u;
  try {
    u = new URL(String(urlStr).trim());
  } catch {
    return {};
  }
  const info = {};

  // Shopee "universal-link" menyimpan URL sebenar dalam parameter.
  for (const key of ['redir', 'redirect', 'url', 'deep_and_deferred', 'af_dp']) {
    const inner = u.searchParams.get(key);
    if (inner && /^https?:/i.test(inner)) {
      const nested = infoFromUrl(inner);
      if (nested.name) return nested;
    }
  }

  const m = u.pathname.match(/\/([^/]+)-i\.(\d+)\.(\d+)/);
  if (m) {
    try {
      info.name = decodeURIComponent(m[1]).replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    } catch {
      info.name = m[1].replace(/-/g, ' ');
    }
  }

  const og = u.searchParams.get('og_info');
  if (og) {
    try {
      const j = JSON.parse(og);
      if (j.title) info.name = j.title;
    } catch { /* abaikan */ }
  }
  return info;
}

// Frasa standard dalam teks share Shopee / TikTok (BM & English) yang perlu dibuang.
const NOISE = [
  /get it (on|at) shopee( now)?!?/gi,
  /dapatkan (di|di|dekat) shopee( sekarang)?!?/gi,
  /beli (di|kat) shopee( sekarang)?!?/gi,
  /(check out|lihat|tengok|jom tengok)( this product| produk ini| produk ni)?:?/gi,
  /\bfor only\b/gi,
  /\bonly\b/gi,
  /\bhanya\b/gi,
  /\bdengan harga\b/gi,
  /\bat tiktok shop\b|\bdi tiktok shop\b|\bon tiktok shop\b/gi,
  /\b(is|are) (now )?available\b/gi,
  /\bshop now\b|\bbeli sekarang\b|\bclick (the )?link\b|\bklik (pautan|link)\b/gi,
  /\bfor\s*$/gi,
  /\bdengan\s*$/gi,
];

export function parsePriceText(text) {
  const m = String(text).match(/RM\s?([\d,]+(?:\.\d{1,2})?)/i);
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function infoFromShareText(text) {
  const raw = String(text || '');
  if (!/https?:\/\//i.test(raw)) return {};
  const price = parsePriceText(raw);
  let rest = raw
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/RM\s?[\d,]+(?:\.\d{1,2})?(\s*-\s*RM\s?[\d,]+(?:\.\d{1,2})?)?/gi, ' ');
  for (const re of NOISE) rest = rest.replace(re, ' ');
  rest = rest
    .replace(/[“”"]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.:;!\-–]+|[\s,.:;!\-–]+$/g, '')
    .trim();
  // Buang kata penghubung yang tertinggal di hujung ("... for", "... dengan harga").
  let prev;
  do {
    prev = rest;
    rest = rest.replace(/\s+(for|at|on|dengan|harga|di|pada|only|hanya)$/i, '').replace(/[\s,.:;!\-–]+$/, '').trim();
  } while (rest !== prev);
  const info = {};
  if (rest.length >= 4 && rest.length <= 220) info.name = rest;
  if (price) info.price = price;
  return info;
}

export function isShortLink(urlStr) {
  return /\/\/(s\.shopee\.|shp\.ee|shope\.ee|vt\.tiktok|vm\.tiktok|www\.tiktok\.com\/t\/)/i.test(urlStr);
}
