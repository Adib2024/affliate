// Mod Pukal: banyak produk sekaligus.
import { $, el, chips, copyText, downloadText, store, toast } from './util.js';
import { splitBulk, infoFromUrl, infoFromShareText } from '../engine/linkinfo.js';
import {
  generatePosts, guessCategory, detectSource, cleanProductName, smartName, parsePrice, fmtRM,
} from '../engine/generator.js';
import { PLATFORMS, TONES } from '../engine/data.js';

let deps;
let items = [];
let results = [];
let perProduct = store.get('bulkCount', 2);

function readItems(text) {
  return splitBulk(text).map(({ url, chunk }) => {
    const fromUrl = infoFromUrl(url);
    const fromText = infoFromShareText(chunk);
    const nama = cleanProductName(fromUrl.name || fromText.name || '');
    return {
      link: url,
      source: detectSource(url) || 'lain',
      nama,
      namaRingkas: smartName(nama),
      harga: fromText.price ? String(fromText.price) : '',
      hargaAsal: '',
    };
  });
}

function renderRows() {
  const box = $('#bulk-rows');
  $('#bulk-setup').hidden = !items.length;
  if (!items.length) { box.replaceChildren(); return; }
  box.replaceChildren(
    el('div', { class: 'results-head' },
      el('h2', { style: 'margin:0' }, `${items.length} produk dijumpai`),
      el('span', { class: 'stat' }, 'Semak nama & harga — kotak merah = isi nama')),
    ...items.map((it, i) => {
      const row = el('div', { class: `bulk-row${it.namaRingkas ? '' : ' missing'}` });
      const nama = el('input', { class: 'input b-nama', value: it.namaRingkas, placeholder: 'Nama produk (wajib)' });
      const harga = el('input', { class: 'input', value: it.harga, placeholder: 'Harga', inputmode: 'decimal' });
      const asal = el('input', { class: 'input', value: it.hargaAsal, placeholder: 'Harga asal', inputmode: 'decimal' });
      nama.addEventListener('input', () => {
        it.namaRingkas = nama.value;
        it.nama = it.nama || nama.value;
        row.classList.toggle('missing', !nama.value.trim());
      });
      harga.addEventListener('input', () => { it.harga = harga.value; });
      asal.addEventListener('input', () => { it.hargaAsal = asal.value; });
      row.append(nama, harga, asal,
        el('button', { type: 'button', class: 'btn small', title: 'Buang', onClick: () => { items.splice(i, 1); renderRows(); } }, '✕'),
        el('div', { class: 'src' }, `${it.source === 'tiktok' ? '🎵 TikTok' : it.source === 'shopee' ? '🧡 Shopee' : '🔗'} · ${it.link}`));
      return row;
    }));
}

function styleSummary() {
  const o = deps.getOpts();
  const plat = PLATFORMS[o.platform];
  $('#bulk-style').innerHTML = '';
  $('#bulk-style').append('Gaya: ', el('b', {}, `${plat.icon} ${plat.label} · ${TONES[o.tone].label}`),
    ' — ', el('a', { href: '#', onClick: (e) => { e.preventDefault(); deps.showView('jana'); } }, 'tukar di tab Jana'));
}

function exportRows() {
  return results.flatMap(({ product, posts }) => posts.map((p) => ({ product, post: p })));
}

function textExport() {
  return results.map(({ product, posts }) => {
    const head = `########## ${product.namaRingkas}${parsePrice(product.harga) ? ` — ${fmtRM(parsePrice(product.harga))}` : ''} ##########\n${product.link}`;
    const body = posts.map((p, i) => `--- Caption ${i + 1} (${p.angleLabel}, skor ${p.score}) ---\n${p.text}${p.comment ? `\n\n[Komen pertama]\n${p.comment}` : ''}`).join('\n\n');
    return `${head}\n\n${body}`;
  }).join('\n\n\n');
}

function csvExport() {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Produk', 'Harga', 'Link', 'Angle', 'Skor', 'Caption', 'Komen pertama'];
  const rows = exportRows().map(({ product, post }) => [
    product.namaRingkas, parsePrice(product.harga) ? fmtRM(parsePrice(product.harga)) : '', product.link,
    post.angleLabel, post.score, post.text, post.comment,
  ]);
  // BOM supaya Excel baca emoji & huruf dengan betul
  return `﻿${[header, ...rows].map((r) => r.map(esc).join(',')).join('\r\n')}`;
}

function generateAll() {
  const missing = items.filter((it) => !it.namaRingkas.trim());
  if (missing.length) { toast(`Isi nama untuk ${missing.length} produk dulu`); return; }
  const opts = deps.getOpts();
  const seen = deps.getSeen();
  results = items.map((it) => {
    const product = {
      ...deps.defaultProduct(), ...it, kelebihan: ['', '', ''], ringkasManual: true,
      kategori: guessCategory(it.nama || it.namaRingkas),
    };
    const { posts } = generatePosts(product, { ...opts, count: perProduct }, undefined, seen);
    posts.sort((a, b) => b.score - a.score);
    deps.remember(posts);
    deps.addHistory(product, posts, opts.platform);
    return { product, posts };
  });
  const box = $('#bulk-results');
  box.replaceChildren(...results.map(({ product, posts }, gi) => el('section', { class: 'bulk-group' },
    el('h3', {}, `${gi + 1}. ${product.namaRingkas}`,
      parsePrice(product.harga) ? el('span', { class: 'badge' }, fmtRM(parsePrice(product.harga))) : null),
    ...posts.map((p, i) => deps.postCard(p, i, { best: i === 0 })))));
  for (const id of ['bulk-copy', 'bulk-txt', 'bulk-csv']) $(`#${id}`).hidden = false;
  toast(`✓ ${results.length * perProduct} caption dijana`);
  if (window.innerWidth < 980) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function initBulk(d) {
  deps = d;
  const input = $('#bulk-input');
  input.value = store.get('bulkInput', '');
  input.addEventListener('input', () => store.set('bulkInput', input.value));
  $('#bulk-read').addEventListener('click', () => {
    items = readItems(input.value);
    if (!items.length) { toast('Tiada link dijumpai — pastikan ada https://'); return; }
    renderRows();
    styleSummary();
    const noName = items.filter((it) => !it.namaRingkas).length;
    toast(noName ? `${items.length} produk · ${noName} perlu isi nama` : `✓ ${items.length} produk dibaca`);
  });
  chips($('#c-bulk-count'), [1, 2, 3].map((n) => ({ value: n, label: `${n} caption` })), perProduct,
    { onChange: (v) => { perProduct = v; store.set('bulkCount', v); } });
  $('#bulk-generate').addEventListener('click', generateAll);
  $('#bulk-copy').addEventListener('click', (e) => copyText(textExport(), e.currentTarget));
  $('#bulk-txt').addEventListener('click', () => downloadText(`racunpost-${items.length}-produk.txt`, textExport()));
  $('#bulk-csv').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([csvExport()], { type: 'text/csv;charset=utf-8' }));
    const a = el('a', { href: url, download: `racunpost-${items.length}-produk.csv` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

export function bulkVisible() {
  if (items.length) styleSummary();
}
