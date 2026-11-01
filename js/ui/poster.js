// Penjana poster produk — guna <canvas>, 100% dalam browser, percuma.
import { $, chips, el, store, toast } from './util.js';
import { POSTER_HOOKS } from '../engine/data.js';
import { cleanProductName, parsePrice, fmtRM } from '../engine/generator.js';

const SIZES = {
  '1:1': [1080, 1080, '⬛ 1:1 (Feed)'],
  '4:5': [1080, 1350, '▯ 4:5 (IG/FB)'],
  '9:16': [1080, 1920, '📱 9:16 (Story/TikTok)'],
};
const LAYOUTS = { klasik: '🎴 Klasik', bold: '💥 Bold', minimal: '🤍 Minimal' };
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
let getProduct = () => ({});
let ui = {};

function save() {
  const { hook, size, layout, color } = state;
  store.set('poster', { hook, size, layout, color });
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

function drawImage(x, y, w, h, mode = 'contain', radius = 32, bg = '#ffffff') {
  ctx.save();
  roundRect(x, y, w, h, radius);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.clip();
  if (img) {
    const r = mode === 'cover'
      ? Math.max(w / img.width, h / img.height)
      : Math.min(w / img.width, h / img.height) * 0.92;
    const iw = img.width * r;
    const ih = img.height * r;
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
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
  return p.source === 'tiktok' ? 'Tekan beg kuning 🛒' : 'Link di caption 👇';
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
  };

  ui = {
    hook: $('#p-hook'), nama: $('#p-nama'), harga: $('#p-harga'), hargaAsal: $('#p-hargaAsal'), imgStatus: $('#img-status'),
  };
  ui.hook.value = state.hook;
  ui.nama.value = state.nama;
  ui.harga.value = state.harga;
  ui.hargaAsal.value = state.hargaAsal;

  for (const key of ['hook', 'nama', 'harga', 'hargaAsal']) {
    ui[key].addEventListener('input', () => { state[key] = ui[key].value; if (key === 'hook') save(); redraw(); });
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
    state.layout = Object.keys(LAYOUTS)[Math.floor(Math.random() * 3)];
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

  void sizeChips;
  if (document.fonts?.load) {
    document.fonts.load(`800 40px "Plus Jakarta Sans"`).then(redraw, redraw);
  }
  redraw();
}

export function posterVisible() {
  redraw();
}
