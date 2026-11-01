// Penjana poster produk — guna <canvas>, 100% dalam browser, percuma.
import { $, chips, el, store, toast } from './util.js';
import { POSTER_HOOKS, CATEGORIES } from '../engine/data.js';
import { benefitsFromName } from '../engine/keywords.js';
import { cleanProductName, parsePrice, fmtRM } from '../engine/generator.js';

const SIZES = {
  '1:1': [1080, 1080, '⬛ 1:1 (Feed)'],
  '4:5': [1080, 1350, '▯ 4:5 (IG/FB)'],
  '9:16': [1080, 1920, '📱 9:16 (Story/TikTok)'],
};
const LAYOUTS = {
  klasik: '🎴 Klasik', bold: '💥 Bold', minimal: '🤍 Minimal',
  flash: '⚡ Flash Sale', testimoni: '💬 Testimoni', banding: '↔️ Sebelum/Selepas',
};
const COLORS = [
  { name: 'Oren Shopee', bg: '#ee4d2d', bg2: '#ff8a3d', accent: '#ffe14d', ink: '#ffffff' },
  { name: 'TikTok', bg: '#111111', bg2: '#2a2a2a', accent: '#fe2c55', ink: '#ffffff', glow: '#25f4ee' },
  { name: 'Pink', bg: '#ff4f8b', bg2: '#ff9ac1', accent: '#fff36b', ink: '#ffffff' },
  { name: 'Hijau', bg: '#0f9d58', bg2: '#38c67a', accent: '#ffe14d', ink: '#ffffff' },
  { name: 'Ungu', bg: '#6c3bea', bg2: '#a173ff', accent: '#ffd23f', ink: '#ffffff' },
  { name: 'Biru Gelap', bg: '#0b2545', bg2: '#13406f', accent: '#ffc93c', ink: '#ffffff' },
];
const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';

let state;
let canvas;
let ctx;
let img = null;
let img2 = null; // gambar 'sebelum' untuk susun atur Sebelum/Selepas
let getProduct = () => ({});
let ui = {};

function save() {
  const { hook, size, layout, color, quote, before } = state;
  store.set('poster', { hook, size, layout, color, quote, before });
}

// ---------- Lukisan ----------
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(text, maxWidth, size, weight = 800, maxLines = 2, minSize = 28) {
  let s = size;
  for (; s >= minSize; s -= 2) {
    ctx.font = `${weight} ${s}px ${FONT}`;
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width <= maxWidth) line = test;
      else { if (line) lines.push(line); line = w; }
    }
    if (line) lines.push(line);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxWidth)) return { lines, size: s };
  }
  // Paksa potong
  ctx.font = `${weight} ${minSize}px ${FONT}`;
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width <= maxWidth) line = test;
    else { lines.push(line); line = w; if (lines.length === maxLines) break; }
  }
  if (lines.length < maxLines && line) lines.push(line);
  const last = lines.length - 1;
  while (ctx.measureText(`${lines[last]}…`).width > maxWidth && lines[last].length) lines[last] = lines[last].slice(0, -1);
  if (lines.join(' ').length < String(text).length) lines[last] += '…';
  return { lines, size: minSize };
}

function drawLines({ lines, size }, x, y, color, align = 'left', weight = 800, lh = 1.15) {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * size * lh));
  return y + lines.length * size * lh;
}

function drawImage(x, y, w, h, mode = 'contain', radius = 32, bg = '#ffffff', image = img) {
  ctx.save();
  roundRect(x, y, w, h, radius);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.clip();
  if (image) {
    const r = mode === 'cover'
      ? Math.max(w / image.width, h / image.height)
      : Math.min(w / image.width, h / image.height) * 0.92;
    const iw = image.width * r;
    const ih = image.height * r;
    ctx.drawImage(image, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  } else {
    ctx.fillStyle = '#f3ece8';
    ctx.fillRect(x, y, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${Math.round(Math.min(w, h) * 0.28)}px ${FONT}`;
    ctx.fillText('🛍️', x + w / 2, y + h / 2 - 30);
    ctx.font = `600 34px ${FONT}`;
    ctx.fillStyle = '#9b8d85';
    ctx.fillText('Tambah gambar produk', x + w / 2, y + h / 2 + Math.min(w, h) * 0.2);
  }
  ctx.restore();
}

function pill(text, x, y, bg, color, size = 40, align = 'left') {
  ctx.font = `800 ${size}px ${FONT}`;
  const w = ctx.measureText(text).width + size * 1.2;
  const h = size * 1.6;
  const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  roundRect(left, y, w, h, h / 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left + w / 2, y + h / 2 + 2);
  return { w, h };
}

function discountBadge(cx, cy, r, c, pct) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.18);
  ctx.beginPath();
  const spikes = 16;
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.86;
    const a = (Math.PI * i) / spikes;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = c.accent;
  ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${r * 0.5}px ${FONT}`;
  ctx.fillText(`-${pct}%`, 0, -r * 0.08);
  ctx.font = `700 ${r * 0.2}px ${FONT}`;
  ctx.fillText('DISKAUN', 0, r * 0.36);
  ctx.restore();
}

function priceBlock(x, y, c, align, big = 120, colorPrice = c.accent, colorOld = c.ink) {
  const harga = parsePrice(state.harga);
  const asal = parsePrice(state.hargaAsal);
  if (!harga) return y;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.font = `800 ${big}px ${FONT}`;
  ctx.fillStyle = colorPrice;
  const priceText = fmtRM(harga);
  ctx.fillText(priceText, x, y);
  const pw = ctx.measureText(priceText).width;
  if (asal && asal > harga) {
    const old = fmtRM(asal);
    ctx.font = `600 ${big * 0.38}px ${FONT}`;
    const ow = ctx.measureText(old).width;
    let ox;
    if (align === 'center') {
      ox = x;
      const oy = y + big * 1.08;
      ctx.fillStyle = colorOld;
      ctx.globalAlpha = 0.8;
      ctx.fillText(old, ox, oy);
      ctx.fillRect(ox - ow / 2, oy + big * 0.2, ow, 4);
      ctx.globalAlpha = 1;
      return oy + big * 0.5;
    }
    ox = align === 'left' ? x + pw + 24 : x - pw - 24 - ow;
    const oy = y + big * 0.5;
    ctx.textAlign = 'left';
    ctx.fillStyle = colorOld;
    ctx.globalAlpha = 0.8;
    ctx.fillText(old, ox, oy);
    ctx.fillRect(ox, oy + big * 0.2, ow, 4);
    ctx.globalAlpha = 1;
  }
  return y + big * 1.1;
}

function sourceLabel() {
  const p = getProduct();
  return p.source === 'tiktok' ? 'TikTok Shop' : p.source === 'shopee' ? 'Shopee' : '';
}

function ctaLabel() {
  const p = getProduct();
  return p.source === 'tiktok' ? 'Tekan beg kuning 🛒' : 'Link di bawah 👇';
}

function discountPct() {
  const h = parsePrice(state.harga);
  const a = parsePrice(state.hargaAsal);
  return h && a && a > h ? Math.round((1 - h / a) * 100) : 0;
}

function draw() {
  const [W, H] = SIZES[state.size];
  canvas.width = W;
  canvas.height = H;
  const c = COLORS[state.color] || COLORS[0];
  const pad = 64;
  const nama = cleanProductName(state.nama) || 'Nama produk';
  const pct = discountPct();
  const tall = H / W;

  if (state.layout === 'minimal') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    const footerY = H - pad * 0.8;
    const hasPrice = Boolean(parsePrice(state.harga));
    const priceTop = footerY - 34 - 28 - (hasPrice ? 112 * 1.05 : 0);
    const nameWrap = wrap(nama, W - pad * 2, 64, 800, 2);
    const nameTop = priceTop - 10 - nameWrap.lines.length * nameWrap.size * 1.15;
    const imgH = Math.max(240, nameTop - 40);
    drawImage(0, 0, W, imgH, img ? 'cover' : 'contain', 0, '#f6f1ee');
    if (state.hook) pill(state.hook, pad, pad, c.bg, '#fff', 44);
    if (pct) discountBadge(W - pad - 90, imgH - 40, 100, c, pct);
    drawLines(nameWrap, pad, nameTop, '#1f1a17');
    if (hasPrice) priceBlock(pad, priceTop, c, 'left', 112, c.bg, '#8b7d75');
    const src = sourceLabel();
    ctx.font = `700 34px ${FONT}`;
    ctx.fillStyle = '#8b7d75';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText([src, ctaLabel()].filter(Boolean).join('  •  '), pad, footerY);
    return;
  }

  if (state.layout === 'flash') return drawFlash(W, H, c, pad, nama, pct, tall);
  if (state.layout === 'testimoni') return drawTestimoni(W, H, c, pad, nama, pct, tall);
  if (state.layout === 'banding') return drawBanding(W, H, c, pad, nama, pct, tall);

  // Latar gradient
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c.bg);
  g.addColorStop(1, c.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // Corak bulatan halus
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc((i * 337) % W, (i * 521) % H, 120 + i * 40, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (state.layout === 'bold') {
    let y = pad;
    if (state.hook) {
      y = drawLines(wrap(state.hook.toUpperCase(), W - pad * 2, tall > 1.5 ? 132 : 96, 800, tall > 1.5 ? 2 : 1, 56), W / 2, y, c.accent, 'center', 800, 1.05) + 28;
    }
    // Ruang bawah dikira dahulu: nama + harga + pil CTA
    const hasPrice = Boolean(parsePrice(state.harga));
    const hasOld = discountPct() > 0;
    const priceSize = tall > 1.5 ? 116 : 96;
    const nameWrap = wrap(nama, W - pad * 2, tall > 1.5 ? 56 : 48, 700, 2);
    const pillH = 34 * 1.6;
    const pillY = H - pad * 0.8 - pillH;
    const priceH = hasPrice ? priceSize * 1.08 + (hasOld ? priceSize * 0.5 : 0) : 0;
    const priceTop = pillY - 20 - priceH;
    const nameTop = priceTop - 8 - nameWrap.lines.length * nameWrap.size * 1.15;
    const box = Math.max(220, Math.min(W - pad * 2, nameTop - 28 - y));
    const bx = (W - box) / 2;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.25)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    roundRect(bx, y, box, box, 40);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
    drawImage(bx, y, box, box, 'contain', 40);
    if (pct) discountBadge(bx + box - 30, y + 30, tall > 1.5 ? 96 : 80, c, pct);
    drawLines(nameWrap, W / 2, nameTop, c.ink, 'center', 700);
    if (hasPrice) priceBlock(W / 2, priceTop, c, 'center', priceSize);
    const src = sourceLabel();
    pill([src, ctaLabel()].filter(Boolean).join(' • '), W / 2, pillY, '#ffffff', '#1f1a17', 34, 'center');
    return;
  }

  // klasik — kira dari bawah ke atas supaya teks tak bertindih
  let y = pad;
  if (state.hook) {
    const { h } = pill(state.hook, pad, y, c.accent, '#1a1a1a', 46);
    y += h + 32;
  }
  const footerY = H - pad * 0.7;
  const hasPrice = Boolean(parsePrice(state.harga));
  const priceSize = 112;
  const priceTop = footerY - 34 - 28 - (hasPrice ? priceSize * 1.05 : 0);
  const nameWrap = wrap(nama, W - pad * 2, 60, 800, 2);
  const nameTop = priceTop - 10 - nameWrap.lines.length * nameWrap.size * 1.15;
  const imgH = Math.max(200, nameTop - 32 - y);
  drawImage(pad, y, W - pad * 2, imgH, 'contain', 40);
  if (pct) discountBadge(W - pad - 70, y + 70, 104, c, pct);
  drawLines(nameWrap, pad, nameTop, c.ink);
  if (hasPrice) priceBlock(pad, priceTop, c, 'left', priceSize);
  const src = sourceLabel();
  ctx.font = `700 34px ${FONT}`;
  ctx.fillStyle = c.ink;
  ctx.globalAlpha = 0.9;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText([src, ctaLabel()].filter(Boolean).join('  •  '), pad, footerY);
  ctx.globalAlpha = 1;
}

// ---------- Susun atur tambahan ----------
function bottomBlock(W, H, pad, nama, { priceSize, nameSize, align = 'center', pillCta = true }) {
  const hasPrice = Boolean(parsePrice(state.harga));
  const hasOld = discountPct() > 0;
  const pillH = 34 * 1.6;
  const pillY = H - pad * 0.8 - pillH;
  const base = pillCta ? pillY : H - pad * 0.8 - 34;
  const priceH = hasPrice ? priceSize * 1.08 + (hasOld && align === 'center' ? priceSize * 0.5 : 0) : 0;
  const priceTop = base - 24 - priceH;
  const nameWrap = wrap(nama, W - pad * 2, nameSize, 800, 2);
  const nameTop = priceTop - 10 - nameWrap.lines.length * nameWrap.size * 1.15;
  return { hasPrice, pillY, priceTop, nameWrap, nameTop };
}

function ctaPill(W, y, bg, color) {
  const src = sourceLabel();
  pill([src, ctaLabel()].filter(Boolean).join(' • '), W / 2, y, bg, color, 34, 'center');
}

function drawFlash(W, H, c, pad, nama, pct, tall) {
  const hot = c.bg === '#111111' ? '#fe2c55' : c.bg;
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, W, H);
  // Jalur amaran di atas
  const bandH = tall > 1.5 ? 230 : 170;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, bandH);
  ctx.clip();
  ctx.fillStyle = '#ffe14d';
  ctx.fillRect(0, 0, W, bandH);
  ctx.fillStyle = 'rgba(0,0,0,.09)';
  for (let x = -bandH; x < W + bandH; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 35, 0);
    ctx.lineTo(x + 35 - bandH, bandH);
    ctx.lineTo(x - bandH, bandH);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  const t = wrap('⚡ FLASH SALE ⚡', W - pad * 2, tall > 1.5 ? 124 : 104, 800, 1, 60);
  drawLines(t, W / 2, (bandH - t.size * 1.05) / 2 + 4, '#121212', 'center', 800, 1.05);
  let y = bandH + 36;
  if (state.hook) {
    const { h } = pill(state.hook.toUpperCase(), W / 2, y, hot, '#fff', 40, 'center');
    y += h + 28;
  }
  const b = bottomBlock(W, H, pad, nama, { priceSize: tall > 1.5 ? 150 : 124, nameSize: tall > 1.5 ? 54 : 46 });
  const box = Math.max(200, Math.min(W - pad * 2, b.nameTop - 28 - y));
  const bx = (W - box) / 2;
  drawImage(bx, y, box, box, 'contain', 36);
  if (pct) discountBadge(bx + box - 20, y + box - 30, tall > 1.5 ? 104 : 86, { ...c, accent: '#ffe14d' }, pct);
  drawLines(b.nameWrap, W / 2, b.nameTop, '#ffffff', 'center', 800);
  if (b.hasPrice) priceBlock(W / 2, b.priceTop, c, 'center', tall > 1.5 ? 150 : 124, '#ffe14d', '#bdbdbd');
  ctaPill(W, b.pillY, hot, '#ffffff');
}

function drawTestimoni(W, H, c, pad, nama, pct, tall) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#fff8f3');
  g.addColorStop(1, '#ffe6da');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const quote = (state.quote || '').trim() || 'Serius best! Tak menyesal langsung beli 😍';
  const qWrap = wrap(`“${quote}”`, W - pad * 2 - 80, tall > 1.5 ? 62 : 50, 700, 4, 34);
  const bubbleH = 36 + 56 + 20 + qWrap.lines.length * qWrap.size * 1.25 + 36;
  const b = bottomBlock(W, H, pad, nama, { priceSize: 100, nameSize: 50, align: 'left', pillCta: false });
  const bubbleTop = b.nameTop - 36 - bubbleH;
  const y = pad;
  const imgH = Math.max(200, bubbleTop - 44 - y);
  drawImage(pad, y, W - pad * 2, imgH, 'contain', 36);
  if (state.hook) pill(state.hook, pad + 20, y + 20, c.bg, '#fff', 36);
  if (pct) discountBadge(W - pad - 60, y + 60, 86, c, pct);
  ctx.save();
  ctx.shadowColor = 'rgba(80,40,20,.15)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  roundRect(pad, bubbleTop, W - pad * 2, bubbleH, 36);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(pad + 90, bubbleTop + 1);
  ctx.lineTo(pad + 130, bubbleTop - 30);
  ctx.lineTo(pad + 170, bubbleTop + 1);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.font = `800 50px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f5a623';
  ctx.fillText('★★★★★', pad + 40, bubbleTop + 36);
  drawLines(qWrap, pad + 40, bubbleTop + 36 + 76, '#1f1a17', 'left', 700, 1.25);
  drawLines(b.nameWrap, pad, b.nameTop, '#1f1a17');
  if (b.hasPrice) priceBlock(pad, b.priceTop, c, 'left', 100, c.bg, '#8b7d75');
  ctx.font = `700 34px ${FONT}`;
  ctx.fillStyle = '#8b7d75';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText([sourceLabel(), ctaLabel()].filter(Boolean).join('  •  '), pad, H - pad * 0.8);
}

function drawBanding(W, H, c, pad, nama, pct, tall) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c.bg);
  g.addColorStop(1, c.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  let y = pad;
  const title = wrap((state.hook || 'SEBELUM vs SELEPAS').toUpperCase(), W - pad * 2, tall > 1.5 ? 100 : 80, 800, 2, 48);
  y = drawLines(title, W / 2, y, c.accent, 'center', 800, 1.05) + 28;
  const b = bottomBlock(W, H, pad, nama, { priceSize: tall > 1.5 ? 116 : 92, nameSize: tall > 1.5 ? 54 : 44 });
  const gap = 24;
  const pw = (W - pad * 2 - gap) / 2;
  const ph = Math.max(220, b.nameTop - 28 - y);
  // Kiri: SEBELUM
  if (img2) {
    drawImage(pad, y, pw, ph, 'cover', 32, '#ddd', img2);
  } else {
    ctx.save();
    roundRect(pad, y, pw, ph, 32);
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.fill();
    ctx.restore();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${Math.round(pw * 0.32)}px ${FONT}`;
    ctx.fillText('😩', pad + pw / 2, y + ph / 2 - 40);
    const bt = wrap((state.before || '').trim() || 'Serabut & leceh', pw - 40, 40, 700, 3, 26);
    drawLines(bt, pad + pw / 2, y + ph / 2 + pw * 0.12, '#ffffff', 'center', 700, 1.2);
  }
  // Kanan: SELEPAS
  drawImage(pad + pw + gap, y, pw, ph, img ? 'cover' : 'contain', 32);
  pill('❌ SEBELUM', pad + 18, y + 18, '#1f1a17', '#fff', 30);
  pill('✅ SELEPAS', pad + pw + gap + 18, y + 18, c.accent, '#1a1a1a', 30);
  if (pct) discountBadge(W - pad - 40, y + ph - 40, 80, c, pct);
  drawLines(b.nameWrap, W / 2, b.nameTop, c.ink, 'center', 800);
  if (b.hasPrice) priceBlock(W / 2, b.priceTop, c, 'center', tall > 1.5 ? 116 : 92);
  ctaPill(W, b.pillY, '#ffffff', '#1f1a17');
}

// ---------- Carousel ----------
function slideBenefits() {
  const p = getProduct();
  const own = (p.kelebihan || []).map((k) => String(k || '').trim()).filter(Boolean);
  const cat = CATEGORIES[p.kategori] || CATEGORIES.lain;
  return [...new Set([...own, ...benefitsFromName(p.nama), ...cat.defaultK])].slice(0, 3);
}

function gradientBg(W, H, c) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c.bg);
  g.addColorStop(1, c.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function slideCounter(W, n, total) {
  pill(`${n}/${total}`, W - 40, 40, 'rgba(0,0,0,.35)', '#fff', 28, 'right');
}

function drawSlideBenefits(W, H, c, pad, nama) {
  gradientBg(W, H, c);
  let y = pad + 20;
  const title = wrap(`Kenapa ${nama} best? 👇`, W - pad * 2, 76, 800, 2, 44);
  y = drawLines(title, pad, y, c.ink) + 36;
  const list = slideBenefits();
  const footer = 120;
  const rowH = Math.min(260, (H - y - footer - pad) / list.length - 20);
  list.forEach((k, i) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.15)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    roundRect(pad, y, W - pad * 2, rowH, 28);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
    ctx.font = `800 ${Math.min(64, rowH * 0.45)}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = c.bg === '#111111' ? '#fe2c55' : c.bg;
    ctx.fillText(String(i + 1), pad + 70, y + rowH / 2);
    const t = wrap(k, W - pad * 2 - 170, Math.min(48, rowH * 0.32), 700, 2, 28);
    const th = t.lines.length * t.size * 1.2;
    drawLines(t, pad + 140, y + (rowH - th) / 2, '#1f1a17', 'left', 700, 1.2);
    y += rowH + 20;
  });
  ctx.font = `700 34px ${FONT}`;
  ctx.fillStyle = c.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Swipe untuk harga ➡️', W / 2, H - pad * 0.8);
}

function drawSlidePrice(W, H, c, pad, nama, pct, tall) {
  gradientBg(W, H, c);
  const box = Math.min(W * 0.62, H * 0.38);
  const bx = (W - box) / 2;
  const y = pad + 20;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.25)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 14;
  roundRect(bx, y, box, box, 36);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.restore();
  drawImage(bx, y, box, box, 'contain', 36);
  if (pct) discountBadge(bx + box - 10, y + 20, 90, c, pct);
  let ty = y + box + 40;
  ty = drawLines(wrap(nama, W - pad * 2, 52, 700, 2), W / 2, ty, c.ink, 'center', 700) + 10;
  if (parsePrice(state.harga)) ty = priceBlock(W / 2, ty, c, 'center', tall > 1.5 ? 170 : 140) + 10;
  const big = wrap(ctaLabel().toUpperCase(), W - pad * 2, 60, 800, 2, 36);
  const bh = big.lines.length * big.size * 1.15 + 50;
  const by = Math.min(ty + 20, H - pad - bh - 70);
  roundRect(pad, by, W - pad * 2, bh, 28);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  drawLines(big, W / 2, by + 25, '#1f1a17', 'center', 800);
  ctx.font = `700 34px ${FONT}`;
  ctx.fillStyle = c.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('📌 Save & share pada kawan!', W / 2, H - pad * 0.8);
}

function withCanvas(target, fn) {
  const prevCanvas = canvas;
  const prevCtx = ctx;
  canvas = target;
  ctx = target.getContext('2d');
  try { fn(); } finally { canvas = prevCanvas; ctx = prevCtx; }
}

function renderCarousel() {
  const [W, H] = SIZES[state.size === '9:16' ? '4:5' : state.size];
  const c = COLORS[state.color] || COLORS[0];
  const pad = 64;
  const nama = cleanProductName(state.nama) || 'Produk ni';
  const pct = discountPct();
  const tall = H / W;
  const slides = [0, 1, 2].map(() => {
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    return cv;
  });
  const prevSize = state.size;
  if (state.size === '9:16') state.size = '4:5';
  withCanvas(slides[0], () => { draw(); slideCounter(W, 1, 3); pill('Swipe ➡️', W - 40, H - 120, '#ffffff', '#1f1a17', 32, 'right'); });
  state.size = prevSize;
  withCanvas(slides[1], () => { drawSlideBenefits(W, H, c, pad, nama); slideCounter(W, 2, 3); });
  withCanvas(slides[2], () => { drawSlidePrice(W, H, c, pad, nama, pct, tall); slideCounter(W, 3, 3); });
  return slides;
}

let raf;
function redraw() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(draw);
}

// ---------- Gambar ----------
function loadImage(src, { crossOrigin = false } = {}) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    if (crossOrigin) im.crossOrigin = 'anonymous';
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

async function setFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const url = URL.createObjectURL(file);
  try {
    img = await loadImage(url);
    ui.imgStatus.textContent = `✓ ${file.name}`;
    ui.imgStatus.className = 'status ok';
    redraw();
  } catch {
    ui.imgStatus.textContent = 'Gambar tak dapat dibuka.';
    ui.imgStatus.className = 'status err';
  }
}

// ---------- Sync dengan produk ----------
export function syncFromProduct(product, { force = false } = {}) {
  if (!state) return;
  if (force || !state.nama) state.nama = product.namaRingkas || product.nama || '';
  if (force || !state.harga) state.harga = product.harga || '';
  if (force || !state.hargaAsal) state.hargaAsal = product.hargaAsal || '';
  ui.nama.value = state.nama;
  ui.harga.value = state.harga;
  ui.hargaAsal.value = state.hargaAsal;
  if (product.source === 'tiktok' && state.color === 0 && !state.colorTouched) state.color = 1;
  if (product.source === 'shopee' && state.color === 1 && !state.colorTouched) state.color = 0;
  ui.colorChips?.();
  redraw();
}

export function setHook(text) {
  if (!state) return;
  state.hook = text.slice(0, 40);
  ui.hook.value = state.hook;
  save();
  redraw();
}

function randomHook() {
  const opts = POSTER_HOOKS.filter((h) => h !== state.hook);
  return opts[Math.floor(Math.random() * opts.length)];
}

export function initPoster(productGetter) {
  getProduct = productGetter;
  canvas = $('#poster-canvas');
  ctx = canvas.getContext('2d');
  const saved = store.get('poster', {});
  const p = getProduct();
  state = {
    hook: saved.hook ?? POSTER_HOOKS[0],
    size: SIZES[saved.size] ? saved.size : '1:1',
    layout: LAYOUTS[saved.layout] ? saved.layout : 'klasik',
    color: Number.isInteger(saved.color) ? saved.color : (p.source === 'tiktok' ? 1 : 0),
    colorTouched: Number.isInteger(saved.color),
    nama: p.namaRingkas || p.nama || '', harga: p.harga || '', hargaAsal: p.hargaAsal || '',
    quote: saved.quote || '', before: saved.before || '',
  };

  ui = {
    hook: $('#p-hook'), nama: $('#p-nama'), harga: $('#p-harga'), hargaAsal: $('#p-hargaAsal'), imgStatus: $('#img-status'),
    quote: $('#p-quote'), before: $('#p-before'),
  };
  ui.hook.value = state.hook;
  ui.nama.value = state.nama;
  ui.harga.value = state.harga;
  ui.hargaAsal.value = state.hargaAsal;
  ui.quote.value = state.quote;
  ui.before.value = state.before;

  for (const key of ['hook', 'nama', 'harga', 'hargaAsal', 'quote', 'before']) {
    ui[key].addEventListener('input', () => { state[key] = ui[key].value; if (['hook', 'quote', 'before'].includes(key)) save(); redraw(); });
  }
  $('#p-hook-rand').addEventListener('click', () => setHook(randomHook()));

  const sizeChips = chips($('#c-size'), Object.entries(SIZES).map(([v, s]) => ({ value: v, label: s[2] })), state.size,
    { onChange: (v) => { state.size = v; save(); redraw(); } });
  const layoutChips = chips($('#c-layout'), Object.entries(LAYOUTS).map(([v, l]) => ({ value: v, label: l })), state.layout,
    { onChange: (v) => { state.layout = v; save(); redraw(); } });

  const colorBox = $('#c-color');
  ui.colorChips = () => colorBox.replaceChildren(...COLORS.map((c, i) => el('button', {
    type: 'button', class: 'swatch', title: c.name, 'aria-label': c.name, 'aria-pressed': String(state.color === i),
    style: `background: linear-gradient(135deg, ${c.bg}, ${c.bg2})`,
    onClick: () => { state.color = i; state.colorTouched = true; save(); ui.colorChips(); redraw(); },
  })));
  ui.colorChips();

  // Upload / seret gambar
  const drop = $('#drop');
  $('#f-image').addEventListener('change', (e) => setFile(e.target.files[0]));
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); setFile(e.dataTransfer.files[0]); });
  window.addEventListener('paste', (e) => {
    if ($('#view-poster').hidden) return;
    const file = [...(e.clipboardData?.files || [])].find((f) => f.type.startsWith('image/'));
    if (file) setFile(file);
  });

  $('#p-random').addEventListener('click', () => {
    state.layout = Object.keys(LAYOUTS)[Math.floor(Math.random() * Object.keys(LAYOUTS).length)];
    state.color = Math.floor(Math.random() * COLORS.length);
    state.colorTouched = true;
    state.hook = randomHook();
    ui.hook.value = state.hook;
    layoutChips.set(state.layout);
    ui.colorChips();
    save();
    redraw();
  });

  const fileName = () => `poster-${(cleanProductName(state.nama) || 'produk').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}.png`;
  const toBlob = () => new Promise((r) => canvas.toBlob(r, 'image/png'));

  $('#p-download').addEventListener('click', async () => {
    draw();
    const blob = await toBlob();
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: fileName() });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('⬇️ Poster dimuat turun');
  });

  $('#p-share').addEventListener('click', async () => {
    draw();
    const blob = await toBlob();
    const file = new File([blob], fileName(), { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      navigator.share({ files: [file] }).catch(() => {});
    } else {
      toast('Share gambar tak disokong di sini — guna Muat turun');
    }
  });

  // Gambar "sebelum" (pilihan) untuk susun atur Sebelum/Selepas
  $('#f-image2').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      img2 = await loadImage(URL.createObjectURL(file));
      $('#img2-status').textContent = `✓ ${file.name}`;
      $('#img2-status').className = 'status ok';
      redraw();
    } catch { /* abaikan */ }
  });

  // Carousel 3 slide
  let slides = [];
  const strip = $('#carousel-strip');
  $('#p-carousel').addEventListener('click', () => {
    slides = renderCarousel();
    strip.replaceChildren(...slides.map((cv) => cv));
    strip.hidden = false;
    $('#carousel-actions').hidden = false;
    toast('🎠 3 slide siap — muat turun & post sebagai carousel');
  });
  const slideFile = async (cv, i) => {
    const blob = await new Promise((r) => cv.toBlob(r, 'image/png'));
    return new File([blob], fileName().replace('.png', `-slide${i + 1}.png`), { type: 'image/png' });
  };
  $('#p-carousel-dl').addEventListener('click', async () => {
    for (let i = 0; i < slides.length; i++) {
      const f = await slideFile(slides[i], i);
      const url = URL.createObjectURL(f);
      const a = el('a', { href: url, download: f.name });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      await new Promise((r) => setTimeout(r, 400));
    }
  });
  $('#p-carousel-share').addEventListener('click', async () => {
    const files = await Promise.all(slides.map(slideFile));
    if (navigator.canShare?.({ files })) navigator.share({ files }).catch(() => {});
    else toast('Share banyak gambar tak disokong di sini — guna Muat turun');
  });

  void sizeChips;
  if (document.fonts?.load) {
    document.fonts.load(`800 40px "Plus Jakarta Sans"`).then(redraw, redraw);
  }
  redraw();
}

export function posterVisible() {
  redraw();
}
