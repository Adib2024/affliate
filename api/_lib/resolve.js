// Tarik maklumat produk daripada link affiliate Shopee / TikTok Shop.
// Tiada API berbayar: kita ikut redirect short link, baca nama daripada URL,
// dan cuba baca tag Open Graph (og:title / og:image) pada halaman produk.

const ALLOWED_HOSTS = [
  /(^|\.)shopee\.com\.my$/, /(^|\.)shopee\.[a-z.]+$/, /(^|\.)shp\.ee$/, /(^|\.)shope\.ee$/,
  /(^|\.)tiktok\.com$/, /(^|\.)tiktokv\.com$/,
];

const IMAGE_HOSTS = [
  /(^|\.)susercontent\.com$/, /(^|\.)shopee\.[a-z.]+$/, /(^|\.)shopeemobile\.com$/,
  /(^|\.)tiktokcdn\.com$/, /(^|\.)tiktokcdn-us\.com$/, /(^|\.)ibyteimg\.com$/, /(^|\.)byteimg\.com$/,
  /(^|\.)tiktokcdn-eu\.com$/,
];

const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36';

export const isAllowedHost = (host) => ALLOWED_HOSTS.some((re) => re.test(host));
export const isImageHost = (host) => IMAGE_HOSTS.some((re) => re.test(host));

function safeUrl(raw) {
  try {
    const u = new URL(String(raw).trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return u;
  } catch {
    return null;
  }
}

export function detectPlatform(host) {
  if (/shopee|shp\.ee|shope\.ee/.test(host)) return 'shopee';
  if (/tiktok/.test(host)) return 'tiktok';
  return 'lain';
}

const decodeEntities = (s) => s
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));

// Cari nama/ID produk daripada URL (tanpa perlu buka halaman).
export function infoFromUrl(urlStr) {
  const u = safeUrl(urlStr);
  if (!u) return {};
  const info = {};

  // Shopee "universal-link" menyimpan URL sebenar dalam parameter.
  for (const key of ['redir', 'redirect', 'url', 'deep_and_deferred', 'af_dp']) {
    const inner = u.searchParams.get(key);
    if (inner && /^https?:/i.test(inner)) {
      const nested = infoFromUrl(inner);
      if (nested.name) return nested;
    }
  }

  // Shopee: /Nama-Produk-Panjang-i.12345.67890
  const m = u.pathname.match(/\/([^/]+)-i\.(\d+)\.(\d+)/);
  if (m) {
    try {
      info.name = decodeURIComponent(m[1]).replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    } catch {
      info.name = m[1].replace(/-/g, ' ');
    }
  }

  // TikTok: parameter og_info = {"title": "...", "image": "..."}
  const og = u.searchParams.get('og_info');
  if (og) {
    try {
      const j = JSON.parse(og);
      if (j.title) info.name = j.title;
      if (j.image) info.image = j.image;
    } catch { /* abaikan */ }
  }
  return info;
}

function metaContent(html, prop) {
  const re1 = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`, 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? decodeEntities(m[1]).trim() : '';
}

async function fetchWithTimeout(url, init = {}, ms = 6000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, headers: { 'user-agent': UA, 'accept-language': 'ms-MY,ms;q=0.9,en;q=0.8', ...(init.headers || {}) } });
  } finally {
    clearTimeout(t);
  }
}

async function readLimited(res, maxBytes = 600_000) {
  const reader = res.body?.getReader();
  if (!reader) return '';
  const chunks = [];
  let total = 0;
  while (total < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  reader.cancel().catch(() => {});
  return new TextDecoder().decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
}

export async function resolveLink(raw) {
  const start = safeUrl(raw);
  if (!start) return { ok: false, error: 'Link tak sah.' };
  if (!isAllowedHost(start.hostname)) {
    return { ok: false, error: 'Buat masa ni hanya link Shopee & TikTok Shop disokong.' };
  }

  // 1) Ikut redirect secara manual (hanya domain yang dibenarkan).
  let current = start;
  const chain = [start.href];
  let html = '';
  for (let hop = 0; hop < 8; hop++) {
    let res;
    try {
      res = await fetchWithTimeout(current.href, { redirect: 'manual' });
    } catch {
      break;
    }
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) {
      const next = safeUrl(new URL(loc, current).href);
      if (!next) break;
      chain.push(next.href);
      if (!isAllowedHost(next.hostname)) { current = next; break; }
      current = next;
      continue;
    }
    if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) {
      html = await readLimited(res);
      // Sesetengah short link guna redirect JavaScript / meta refresh.
      const js = html.match(/(?:window\.location(?:\.href)?|location\.replace)\s*\(?\s*=?\s*["'](https?:[^"']+)["']/i)
        || html.match(/http-equiv=["']refresh["'][^>]*url=([^"'>]+)/i);
      if (js && hop < 7) {
        const next = safeUrl(decodeEntities(js[1]));
        if (next && isAllowedHost(next.hostname) && next.href !== current.href) {
          chain.push(next.href);
          current = next;
          html = '';
          continue;
        }
      }
    }
    break;
  }

  // 2) Maklumat daripada URL akhir (dan semua URL dalam rantaian).
  let info = {};
  for (const href of chain.slice().reverse()) {
    info = { ...infoFromUrl(href), ...info };
    if (info.name) break;
  }

  // 3) Maklumat daripada tag Open Graph.
  if (html) {
    const ogTitle = metaContent(html, 'og:title');
    const ogImage = metaContent(html, 'og:image');
    const ogDesc = metaContent(html, 'og:description');
    const price = metaContent(html, 'product:price:amount') || metaContent(html, 'og:price:amount');
    const badTitle = /^(shopee|tiktok|tiktok shop|log in|login|.*verify.*|.*captcha.*)$/i;
    if (!info.name && ogTitle && !badTitle.test(ogTitle)) {
      info.name = ogTitle.replace(/\s*\|\s*(Shopee|TikTok).*$/i, '').trim();
    }
    if (!info.image && ogImage) info.image = ogImage;
    if (ogDesc) info.description = ogDesc.slice(0, 300);
    if (price) info.price = price;
  }

  return {
    ok: Boolean(info.name || info.image),
    platform: detectPlatform(start.hostname),
    finalUrl: current.href,
    name: info.name || '',
    image: info.image || '',
    price: info.price || '',
    description: info.description || '',
    error: info.name ? undefined : 'Tak dapat baca nama produk dari link ni — sila isi sendiri.',
  };
}

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 's-maxage=86400' },
});

export async function handleResolve(request) {
  const url = new URL(request.url).searchParams.get('url');
  if (!url) return json({ ok: false, error: 'Parameter url diperlukan.' }, 400);
  try {
    return json(await resolveLink(url));
  } catch (e) {
    return json({ ok: false, error: 'Ralat semasa membaca link.' }, 500);
  }
}

// Proksi gambar supaya gambar produk boleh dilukis dalam poster (elak isu CORS).
export async function handleImage(request) {
  const raw = new URL(request.url).searchParams.get('url');
  const u = safeUrl(raw);
  if (!u || !isImageHost(u.hostname)) return new Response('Hos gambar tak dibenarkan', { status: 400 });
  try {
    const res = await fetchWithTimeout(u.href, {}, 8000);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.startsWith('image/')) return new Response('Gambar tak dijumpai', { status: 404 });
    const len = Number(res.headers.get('content-length') || 0);
    if (len > 8_000_000) return new Response('Gambar terlalu besar', { status: 413 });
    const buf = await res.arrayBuffer();
    return new Response(buf, {
      headers: { 'content-type': type, 'cache-control': 'public, max-age=86400', 'access-control-allow-origin': '*' },
    });
  } catch {
    return new Response('Ralat memuat gambar', { status: 502 });
  }
}
