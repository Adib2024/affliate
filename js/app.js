import { $, store, toast, copyText, el, chips, shareTo, downloadText } from './ui/util.js';
import { initPoster, syncFromProduct, setHook, posterVisible } from './ui/poster.js';
import { initBulk, bulkVisible } from './ui/bulk.js';
import { initViral, viralVisible } from './ui/viralui.js';
import { infoFromUrl, infoFromShareText, isShortLink, resolveViaProxy } from './engine/linkinfo.js';
import { benefitsFromName } from './engine/keywords.js';
import {
  generatePosts, rerollPost, generatePlan, buildAIPrompt, guessCategory, detectSource, cleanProductName, smartName, parsePrice, fmtRM,
} from './engine/generator.js';
import { TONES, CATEGORIES, SEASONS, PLATFORMS, ANGLES, POSTER_HOOKS } from './engine/data.js';

// =====================================================================
//  Keadaan aplikasi
// =====================================================================
const DEFAULT_PRODUCT = {
  link: '', source: 'shopee', nama: '', harga: '', hargaAsal: '', kelebihan: ['', '', ''],
  kategori: 'lain', kategoriManual: false, untuk: '', musim: 'tiada', image: '',
};
const DEFAULT_OPTS = {
  platform: 'facebook', tone: 'santai', emoji: 'banyak', angles: [], count: 5,
  hashtags: true, engage: true, disclosure: false, useCustom: true, hooks: true, linkComment: true, viral: true,
};

const draft = store.get('draft', {});
const state = {
  product: { ...DEFAULT_PRODUCT, ...(draft.product || {}) },
  opts: { ...DEFAULT_OPTS, ...(draft.opts || {}) },
  posts: [],
  planPlatforms: store.get('planPlatforms', ['facebook', 'tiktok']),
  plan: [],
};
let seen = new Set(store.get('seen', []));
let templates = store.get('templates', []);

const saveDraft = () => store.set('draft', { product: state.product, opts: state.opts });
const rememberSeen = (posts) => {
  posts.forEach((p) => seen.add(p.hash));
  const arr = [...seen].slice(-1500);
  seen = new Set(arr);
  store.set('seen', arr);
};
const optsForEngine = () => ({ ...state.opts, customTemplates: templates });

// =====================================================================
//  Tab
// =====================================================================
function showView(name) {
  document.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.view === name)));
  document.querySelectorAll('.view').forEach((v) => { v.hidden = v.id !== `view-${name}`; });
  if (name === 'poster') { syncFromProduct(state.product); posterVisible(); }
  if (name === 'sejarah') renderHistory();
  if (name === 'planner') renderPlanProduct();
  if (name === 'template') renderTemplates();
  if (name === 'pukal') bulkVisible();
  if (name === 'viral') viralVisible();
  store.set('tab', name);
  window.scrollTo({ top: 0 });
}
document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => showView(t.dataset.view)));

// =====================================================================
//  Borang produk
// =====================================================================
const f = {
  link: $('#f-link'), nama: $('#f-nama'), ringkas: $('#f-ringkas'), harga: $('#f-harga'), hargaAsal: $('#f-hargaAsal'),
  k1: $('#f-k1'), k2: $('#f-k2'), k3: $('#f-k3'), kategori: $('#f-kategori'), untuk: $('#f-untuk'), musim: $('#f-musim'),
};
f.kategori.replaceChildren(...Object.entries(CATEGORIES).map(([v, c]) => el('option', { value: v }, c.label)));
f.musim.replaceChildren(...Object.entries(SEASONS).map(([v, s]) => el('option', { value: v }, s.label)));

const sourceChips = chips($('#c-source'),
  ['shopee', 'tiktok'].map((v) => ({ value: v, label: v === 'shopee' ? '🧡 Shopee' : '🎵 TikTok Shop' })),
  state.product.source, { onChange: (v) => { state.product.source = v; saveDraft(); } });

function fillForm() {
  const p = state.product;
  f.link.value = p.link;
  f.nama.value = p.nama;
  if (!p.ringkasManual) p.namaRingkas = smartName(p.nama);
  f.ringkas.value = p.namaRingkas || '';
  f.harga.value = p.harga;
  f.hargaAsal.value = p.hargaAsal;
  [f.k1, f.k2, f.k3].forEach((inp, i) => { inp.value = p.kelebihan[i] || ''; });
  f.kategori.value = p.kategori;
  f.untuk.value = p.untuk;
  f.musim.value = p.musim;
  sourceChips.set(p.source);
  updateBenefitHints();
  updateCategoryHint();
}

// Tunjuk kelebihan yang web akan guna secara automatik bila ruang kosong.
const K_PLACEHOLDERS = ['1. Contoh: Kain lembut & tak panas', '2. Contoh: Tak perlu gosok', '3. Contoh: Banyak pilihan warna'];
function updateBenefitHints() {
  const p = state.product;
  const filled = [f.k1, f.k2, f.k3].map((i) => i.value.trim()).filter(Boolean);
  const cat = CATEGORIES[p.kategori] || CATEGORIES.lain;
  const auto = p.nama.trim() && filled.length < 2
    ? [...new Set([...benefitsFromName(p.nama), ...cat.defaultK])].filter((k) => !filled.includes(k))
    : [];
  let n = 0;
  [f.k1, f.k2, f.k3].forEach((inp, i) => {
    inp.placeholder = !inp.value.trim() && auto[n] ? `💡 Auto: ${auto[n++]}` : K_PLACEHOLDERS[i];
  });
}

// Bila web tak pasti kategori, minta pengguna pilih (ayat caption bergantung pada kategori).
function updateCategoryHint() {
  const p = state.product;
  const hint = $('#kategori-hint');
  if (!hint) return;
  if (!p.nama.trim()) { hint.textContent = ''; hint.className = 'status'; return; }
  if (p.kategori === 'lain' && !p.kategoriManual) {
    hint.textContent = '⚠️ Web tak pasti kategori produk ni — pilih yang paling dekat supaya ayat caption tepat.';
    hint.className = 'status err';
  } else {
    hint.textContent = p.kategoriManual ? '✓ Kategori dipilih sendiri' : '✓ Kategori diteka dari nama produk';
    hint.className = 'status ok';
  }
}

function readForm() {
  const p = state.product;
  p.link = f.link.value.trim();
  p.nama = f.nama.value;
  if (!p.ringkasManual) {
    p.namaRingkas = smartName(p.nama);
    f.ringkas.value = p.namaRingkas;
  }
  p.harga = f.harga.value;
  p.hargaAsal = f.hargaAsal.value;
  p.kelebihan = [f.k1.value, f.k2.value, f.k3.value];
  p.untuk = f.untuk.value;
  p.musim = f.musim.value;
  p.kategori = f.kategori.value;
  saveDraft();
  updateBenefitHints();
  updateCategoryHint();
}

for (const key of ['nama', 'harga', 'hargaAsal', 'k1', 'k2', 'k3', 'untuk']) {
  f[key].addEventListener('input', () => {
    readForm();
    if (key === 'nama' && !state.product.kategoriManual) {
      state.product.kategori = guessCategory(state.product.nama);
      f.kategori.value = state.product.kategori;
      saveDraft();
      updateBenefitHints();
      updateCategoryHint();
    }
  });
}
f.ringkas.addEventListener('input', () => {
  const v = f.ringkas.value.trim();
  state.product.ringkasManual = Boolean(v);
  state.product.namaRingkas = v;
  if (!v) readForm();
  saveDraft();
});
f.kategori.addEventListener('change', () => { state.product.kategoriManual = true; readForm(); });
f.musim.addEventListener('change', readForm);

// ---------- Link: kesan platform & tarik nama ----------
const linkStatus = $('#link-status');
const setStatus = (msg, cls = '') => { linkStatus.textContent = msg; linkStatus.className = `status ${cls}`; };

function looksLikeUrl(s) {
  return /^https?:\/\/\S+\.\S+/i.test(s);
}

// Semua dibaca terus dalam browser — tiada server diperlukan (GitHub Pages).
function applyFoundName(name, price) {
  const clean = cleanProductName(name);
  if (!f.nama.value.trim() || f.nama.dataset.auto === '1') {
    f.nama.value = clean;
    f.nama.dataset.auto = '1';
  }
  if (price && !f.harga.value.trim()) f.harga.value = price;
  readForm();
  if (!state.product.kategoriManual) {
    state.product.kategori = guessCategory(clean);
    f.kategori.value = state.product.kategori;
    readForm();
  }
  saveDraft();
  return clean;
}

let linkSeq = 0;
async function onLinkChanged() {
  const pasted = f.link.value.trim();
  // Orang selalu paste teks share penuh dari app Shopee/TikTok — ambil URL, guna baki teks sebagai nama.
  const m = pasted.match(/https?:\/\/[^\s]+/i);
  if (m && m[0] !== pasted) f.link.value = m[0];
  readForm();
  const url = state.product.link;
  if (!url) { setStatus(''); return; }
  if (!looksLikeUrl(url)) { setStatus('Link nampak tak lengkap — pastikan bermula dengan https://', 'err'); return; }

  const src = detectSource(url);
  if (src) {
    state.product.source = src;
    sourceChips.set(src);
    saveDraft();
  }

  const fromText = infoFromShareText(pasted);
  const fromUrl = infoFromUrl(url);
  const name = fromUrl.name || fromText.name;
  if (name) {
    const clean = applyFoundName(name, fromText.price);
    setStatus(`✓ Jumpa: ${clean}${fromText.price ? ` · ${fmtRM(fromText.price)}` : ''}. Semak & lengkapkan.`, 'ok');
    return;
  }
  if (!src) { setStatus('Link bukan Shopee/TikTok — isi maklumat produk sendiri.'); return; }

  // Link pendek: cuba buka melalui proksi percuma untuk dapatkan nama produk.
  const seq = ++linkSeq;
  setStatus('⏳ Sedang cuba baca nama produk dari link… (5–15 saat)');
  const info = await resolveViaProxy(url);
  if (seq !== linkSeq || f.link.value.trim() !== url) return;
  if (info.name) {
    if (f.nama.value.trim() && f.nama.dataset.auto !== '1') {
      setStatus(`✓ Link dibaca: ${cleanProductName(info.name)} (nama anda dikekalkan)`, 'ok');
      return;
    }
    const clean = applyFoundName(info.name, info.price);
    setStatus(`✓ Jumpa: ${clean}. Semak & isi harga.`, 'ok');
  } else {
    setStatus('Tak dapat baca nama dari link pendek ni (Shopee/TikTok sekat). Isi nama sendiri — atau dalam app tekan Share → Copy & paste SEMUA teks, nama & harga terus terisi.', 'err');
    if (!f.nama.value.trim()) f.nama.focus();
  }
}
f.nama.addEventListener('input', () => { f.nama.dataset.auto = '0'; });
f.link.addEventListener('change', onLinkChanged);
f.link.addEventListener('paste', () => setTimeout(onLinkChanged, 0));

$('#btn-paste').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (!text) return toast('Clipboard kosong');
    f.link.value = text.trim();
    onLinkChanged();
  } catch {
    f.link.focus();
    toast('Tekan lama pada kotak link dan pilih "Paste"');
  }
});

// Reset: kosongkan produk, caption & poster — tetapan gaya (platform, nada…) kekal.
function resetProduct() {
  state.product = { ...DEFAULT_PRODUCT, kelebihan: ['', '', ''], source: state.product.source };
  f.nama.dataset.auto = '0';
  fillForm();
  saveDraft();
  setStatus('');
  state.posts = [];
  renderPosts();
  syncFromProduct(state.product, { force: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  f.link.focus();
  toast('🔄 Dah reset — paste link baru');
}
$('#btn-reset').addEventListener('click', resetProduct);
$('#btn-reset-all').addEventListener('click', () => {
  if (!confirm('Padam SEMUA data (sejarah, template, draf & tetapan) dalam browser ni?')) return;
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('rp.')).forEach((k) => localStorage.removeItem(k));
  } catch { /* abaikan */ }
  location.reload();
});

// =====================================================================
//  Tetapan gaya
// =====================================================================
const setOpt = (k) => (v) => { state.opts[k] = v; saveDraft(); };
chips($('#c-platform'), Object.entries(PLATFORMS).map(([v, p]) => ({ value: v, label: `${p.icon} ${p.label}` })),
  state.opts.platform, { onChange: (v) => { setOpt('platform')(v); if (state.posts.length) runGenerate(); } });
chips($('#c-tone'), Object.entries(TONES).map(([v, t]) => ({ value: v, label: t.label })),
  state.opts.tone, { onChange: (v) => { setOpt('tone')(v); if (state.posts.length) runGenerate(); } });
chips($('#c-emoji'), [
  { value: 'banyak', label: '🤩 Banyak' }, { value: 'sikit', label: '🙂 Sikit' }, { value: 'tiada', label: '🚫 Tiada' },
], state.opts.emoji, { onChange: (v) => { setOpt('emoji')(v); if (state.posts.length) runGenerate(); } });
chips($('#c-angles'), ANGLES.map((a) => ({ value: a.id, label: a.label })), state.opts.angles,
  { multi: true, onChange: setOpt('angles') });
chips($('#c-count'), [3, 5, 8].map((n) => ({ value: n, label: `${n} caption` })), state.opts.count,
  { onChange: setOpt('count') });

for (const [id, key] of [['t-hashtags', 'hashtags'], ['t-engage', 'engage'], ['t-disclosure', 'disclosure'], ['t-custom', 'useCustom'], ['t-hooks', 'hooks'], ['t-linkcomment', 'linkComment'], ['t-viral', 'viral']]) {
  const box = $(`#${id}`);
  box.checked = Boolean(state.opts[key]);
  box.addEventListener('change', () => { state.opts[key] = box.checked; saveDraft(); });
}

// =====================================================================
//  Jana post
// =====================================================================
const postsBox = $('#posts');

function validate() {
  readForm();
  if (!state.product.nama.trim()) {
    toast('Isi nama produk dulu 🙏');
    f.nama.focus();
    return false;
  }
  if (!state.product.harga.trim()) toast('Tip: isi harga — caption jadi lebih meyakinkan');
  return true;
}

function runGenerate() {
  if (!validate()) return;
  const { posts } = generatePosts(state.product, optsForEngine(), undefined, seen);
  // Skor tertinggi di atas.
  state.posts = posts.sort((x, y) => y.score - x.score);
  rememberSeen(posts);
  renderPosts();
  addHistory();
}

function shareButtons(getText) {
  const pop = el('div', { class: 'share-pop', hidden: true });
  const targets = [
    ['whatsapp', '💬 WhatsApp'], ['telegram', '✈️ Telegram'], ['facebook', '📘 Facebook'],
    ['threads', '🧵 Threads'], ['x', '✖️ X (Twitter)'], ['native', '📤 Lain-lain…'],
  ];
  pop.append(...targets.map(([t, label]) => el('button', {
    type: 'button',
    onClick: () => { pop.hidden = true; shareTo(t, getText(), state.product.link); },
  }, label)));
  const btn = el('button', {
    type: 'button', class: 'btn small',
    onClick: (e) => {
      e.stopPropagation();
      document.querySelectorAll('.share-pop').forEach((p) => { if (p !== pop) p.hidden = true; });
      pop.hidden = !pop.hidden;
    },
  }, '📤 Share');
  return el('div', { class: 'share-menu' }, btn, pop);
}
document.addEventListener('click', () => document.querySelectorAll('.share-pop').forEach((p) => { p.hidden = true; }));

function charMeta(text, platform) {
  const limit = PLATFORMS[platform]?.limit;
  const n = [...text].length;
  return { label: limit ? `${n}/${limit}` : `${n} aksara`, over: limit && n > limit };
}

function firstHookLine(text) {
  const line = text.split('\n').find((l) => l.trim()) || '';
  return line.replace(/[*_~]/g, '').trim();
}

function scoreBadge(post, best) {
  if (typeof post.score !== 'number') return null;
  const tier = post.score >= 80 ? 'hi' : post.score >= 60 ? 'mid' : 'lo';
  return el('span', {
    class: `score s-${tier}`,
    title: post.tips?.length ? `Boleh baiki:\n• ${post.tips.join('\n• ')}` : 'Semua ciri engagement lengkap!',
  }, `${best ? '⭐ ' : ''}🔥 ${post.score}`);
}

function commentBox(post) {
  if (!post.comment) return null;
  const box = el('div', { class: 'comment-text', contenteditable: 'true', spellcheck: 'false' }, post.comment);
  return el('div', { class: 'comment-box' },
    el('div', { class: 'comment-head' },
      el('span', {}, '💬 Komen pertama ', el('small', {}, '(post dulu, kemudian komen link ni)')),
      el('button', { type: 'button', class: 'btn small', onClick: (e) => copyText(box.innerText.trim(), e.currentTarget) }, '📋 Copy komen')),
    box);
}

function postCard(post, index, { platform = state.opts.platform, onReroll, best = false, noPoster = false } = {}) {
  const body = el('div', { class: 'post-body', contenteditable: 'true', spellcheck: 'false' }, post.text);
  const meta = el('span', { class: 'meta' });
  const updateMeta = () => {
    const m = charMeta(body.innerText, platform);
    meta.textContent = m.label;
    meta.className = `meta${m.over ? ' over' : ''}`;
  };
  updateMeta();
  body.addEventListener('input', updateMeta);
  const getText = () => body.innerText.trim();

  const actions = [
    el('button', { type: 'button', class: 'btn small primary', onClick: (e) => copyText(getText(), e.currentTarget) }, '📋 Copy'),
    shareButtons(getText),
  ];
  if (onReroll) actions.push(el('button', { type: 'button', class: 'btn small', title: 'Tukar ayat, kekal angle', onClick: onReroll }, '🔀 Tukar'));
  if (!noPoster) actions.push(el('button', {
    type: 'button', class: 'btn small', title: 'Guna baris pertama sebagai hook poster',
    onClick: () => {
      const hook = firstHookLine(getText());
      setHook(hook.length > 40 ? POSTER_HOOKS[Math.floor(Math.random() * POSTER_HOOKS.length)] : hook);
      showView('poster');
    },
  }, '🖼️ Poster'));

  const tips = post.tips?.length && post.score < 80
    ? el('div', { class: 'post-tips' }, `💡 ${post.tips.slice(0, 2).join(' · ')}`) : null;
  return el('article', { class: `post${best ? ' best' : ''}` },
    el('div', { class: 'post-head' },
      el('span', { class: 'badge' }, post.angleLabel),
      el('span', { class: 'head-right' }, scoreBadge(post, best), meta)),
    body,
    tips,
    commentBox(post),
    el('div', { class: 'post-actions' }, actions));
}

const EMPTY_POSTS_HTML = postsBox.innerHTML;

function renderPosts() {
  const has = state.posts.length > 0;
  if (!has) {
    postsBox.classList.remove('two');
    postsBox.innerHTML = EMPTY_POSTS_HTML;
    $('#btn-shuffle').hidden = true;
    $('#btn-copyall').hidden = true;
    $('#results-title').textContent = 'Caption anda';
    return;
  }
  $('#btn-shuffle').hidden = !has;
  $('#btn-copyall').hidden = !has;
  const plat = PLATFORMS[state.opts.platform];
  $('#results-title').textContent = has ? `${state.posts.length} caption ${plat.icon} ${plat.label}` : 'Caption anda';
  postsBox.classList.toggle('two', has);
  const makeReroll = (i) => () => {
    const next = rerollPost(state.product, optsForEngine(), state.posts[i].angleId, seen);
    if (!next) return;
    state.posts[i] = next;
    rememberSeen([next]);
    postsBox.children[i].replaceWith(postCard(next, i, { onReroll: makeReroll(i), best: i === 0 }));
  };
  postsBox.replaceChildren(...state.posts.map((post, i) => postCard(post, i, { onReroll: makeReroll(i), best: i === 0 })));
  if (has && window.innerWidth < 980) postsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('#btn-generate').addEventListener('click', runGenerate);
$('#btn-shuffle').addEventListener('click', runGenerate);
$('#btn-copyall').addEventListener('click', (e) => {
  const texts = [...postsBox.querySelectorAll('.post')].map((card, i) => {
    const body = card.querySelector('.post-body').innerText.trim();
    const comment = card.querySelector('.comment-text')?.innerText.trim();
    return `--- Caption ${i + 1} ---\n${body}${comment ? `\n\n[Komen pertama]\n${comment}` : ''}`;
  });
  copyText(texts.join('\n\n'), e.currentTarget);
});

// ---------- Prompt AI percuma ----------
function copyPrompt(btn) {
  if (!validate()) return null;
  const prompt = buildAIPrompt(state.product, state.opts);
  copyText(prompt, btn);
  return prompt;
}
$('#btn-prompt').addEventListener('click', (e) => copyPrompt(e.currentTarget));
document.querySelectorAll('[data-ai]').forEach((btn) => btn.addEventListener('click', () => {
  const prompt = copyPrompt();
  if (!prompt) return;
  const q = encodeURIComponent(prompt);
  const urls = {
    chatgpt: `https://chatgpt.com/?q=${q}`,
    claude: `https://claude.ai/new?q=${q}`,
    gemini: 'https://gemini.google.com/app',
  };
  toast(btn.dataset.ai === 'gemini' ? '✓ Prompt dah copy — paste dalam Gemini' : '✓ Prompt dah copy & dibuka');
  window.open(urls[btn.dataset.ai], '_blank', 'noopener');
}));

// =====================================================================
//  Sejarah
// =====================================================================
function addHistory(p = state.product, posts = state.posts, platform = state.opts.platform) {
  const history = store.get('history', []);
  const key = `${p.link}|${cleanProductName(p.nama)}`;
  const entry = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    key,
    product: { ...p, kelebihan: [...(p.kelebihan || ['', '', ''])] },
    platform,
    posts: posts.map((x) => ({ angleLabel: x.angleLabel, text: x.comment ? `${x.text}\n\n[Komen pertama]\n${x.comment}` : x.text })),
  };
  const rest = history.filter((h) => h.key !== key);
  store.set('history', [entry, ...rest].slice(0, 100));
}

function renderHistory() {
  const box = $('#history-list');
  const history = store.get('history', []);
  if (!history.length) {
    box.replaceChildren(el('div', { class: 'empty' }, el('div', { class: 'big-emoji' }, '🗂️'), el('p', {}, 'Belum ada sejarah. Jana post pertama anda!')));
    return;
  }
  box.replaceChildren(...history.map((h) => {
    const p = h.product;
    const when = new Date(h.at).toLocaleString('ms-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const price = parsePrice(p.harga);
    return el('div', { class: 'list-item' },
      el('div', {},
        el('div', { class: 'title' }, `${p.source === 'tiktok' ? '🎵' : '🧡'} ${cleanProductName(p.nama) || '(tiada nama)'}`),
        el('div', { class: 'sub' }, [price ? fmtRM(price) : null, `${h.posts.length} caption`, PLATFORMS[h.platform]?.label, when].filter(Boolean).join(' · '))),
      el('div', { class: 'btn-row', style: 'flex-wrap:nowrap' },
        el('button', {
          type: 'button', class: 'btn small primary',
          onClick: () => {
            state.product = { ...DEFAULT_PRODUCT, ...p, kelebihan: [...(p.kelebihan || ['', '', ''])] };
            fillForm();
            saveDraft();
            state.posts = [];
            renderPosts();
            showView('jana');
            toast('✓ Produk dimuatkan — tekan Jana Post');
          },
        }, '↩️ Guna'),
        el('button', {
          type: 'button', class: 'btn small', title: 'Copy semua caption',
          onClick: (e) => copyText(h.posts.map((x, i) => `--- Caption ${i + 1} ---\n${x.text}`).join('\n\n'), e.currentTarget),
        }, '📋'),
        el('button', {
          type: 'button', class: 'btn small', title: 'Padam',
          onClick: () => { store.set('history', store.get('history', []).filter((x) => x.id !== h.id)); renderHistory(); },
        }, '🗑️')));
  }));
}
$('#btn-history-clear').addEventListener('click', () => {
  if (!confirm('Padam semua sejarah?')) return;
  store.set('history', []);
  renderHistory();
});

// =====================================================================
//  Planner 7 hari
// =====================================================================
chips($('#c-plan-platforms'), Object.entries(PLATFORMS).map(([v, p]) => ({ value: v, label: `${p.icon} ${p.label}` })),
  state.planPlatforms, { multi: true, onChange: (v) => { state.planPlatforms = v; store.set('planPlatforms', v); } });

function renderPlanProduct() {
  const p = state.product;
  $('#plan-product').innerHTML = '';
  $('#plan-product').append(p.nama.trim()
    ? el('span', {}, 'Produk: ', el('b', {}, cleanProductName(p.nama)), parsePrice(p.harga) ? ` · ${fmtRM(parsePrice(p.harga))}` : '')
    : el('span', {}, '⚠️ Isi maklumat produk di tab Jana dahulu.'));
}

function planText() {
  return state.plan.map((d, i) => {
    const card = $('#plan-list').querySelectorAll('.post')[i];
    const body = card?.querySelector('.post-body').innerText.trim() || d.post.text;
    const comment = card?.querySelector('.comment-text')?.innerText.trim() || d.post.comment;
    return `=== ${d.day}, ${d.date} · ${d.slot.time} · ${PLATFORMS[d.platform].label} ===\n${body}${comment ? `\n\n[Komen pertama]\n${comment}` : ''}`;
  }).join('\n\n');
}

$('#btn-plan').addEventListener('click', () => {
  readForm();
  if (!state.product.nama.trim()) { toast('Isi nama produk di tab Jana dahulu'); showView('jana'); f.nama.focus(); return; }
  state.plan = generatePlan(state.product, optsForEngine(), state.planPlatforms);
  rememberSeen(state.plan.map((d) => d.post));
  const list = $('#plan-list');
  list.replaceChildren(...state.plan.map((d, i) => {
    const card = postCard(d.post, i, { platform: d.platform });
    const plat = PLATFORMS[d.platform];
    card.querySelector('.post-head').replaceWith(el('div', { class: 'post-head' },
      el('div', { class: 'plan-when' },
        el('span', { class: 'plan-day' }, `${d.day}, ${d.date}`),
        el('span', { class: 'badge' }, `⏰ ${d.slot.time}`),
        el('span', { class: 'meta' }, `${plat.icon} ${plat.label} · ${d.post.angleLabel}`)),
      el('span', { class: 'meta', title: d.slot.note }, d.slot.note)));
    return card;
  }));
  $('#btn-plan-copy').hidden = false;
  $('#btn-plan-dl').hidden = false;
  if (window.innerWidth < 980) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('#btn-plan-copy').addEventListener('click', (e) => copyText(planText(), e.currentTarget));
$('#btn-plan-dl').addEventListener('click', () => {
  const name = cleanProductName(state.product.nama).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'produk';
  downloadText(`plan-7-hari-${name}.txt`, planText());
});

// =====================================================================
//  Template saya
// =====================================================================
const tplName = $('#tpl-name');
const tplText = $('#tpl-text');
const tplOut = $('#tpl-out');
let editingId = null;

function sampleProduct() {
  const p = state.product;
  return p.nama.trim() ? p : {
    ...DEFAULT_PRODUCT, nama: 'Tudung Bawal Cotton Premium', harga: '19.90', hargaAsal: '35',
    kelebihan: ['Kain lembut & tak panas', 'Tak perlu gosok', 'Banyak pilihan warna'], kategori: 'fesyen',
  };
}

$('#tpl-preview').addEventListener('click', () => {
  const text = tplText.value.trim();
  if (!text) return toast('Tulis template dulu');
  const { posts } = generatePosts(sampleProduct(), {
    ...state.opts, count: 1, useCustom: true, customTemplates: [{ text }], angles: ['__none__'],
  });
  tplOut.hidden = false;
  tplOut.textContent = posts[0]?.text || '(kosong)';
});

$('#tpl-save').addEventListener('click', () => {
  const text = tplText.value.trim();
  if (!text) return toast('Tulis template dulu');
  const name = tplName.value.trim() || `Template ${templates.length + 1}`;
  if (editingId) {
    templates = templates.map((t) => (t.id === editingId ? { ...t, name, text } : t));
  } else {
    templates = [...templates, { id: Date.now().toString(36), name, text }];
  }
  store.set('templates', templates);
  editingId = null;
  tplName.value = '';
  tplText.value = '';
  tplOut.hidden = true;
  $('#tpl-save').textContent = '💾 Simpan';
  renderTemplates();
  toast('✓ Template disimpan — akan dicampur bila Jana Post');
});

function renderTemplates() {
  const box = $('#tpl-list');
  if (!templates.length) {
    box.replaceChildren(el('p', { class: 'hint' }, 'Belum ada. Template yang anda simpan akan muncul sebagai angle "✍️ Gaya Saya" bila jana post.'));
    return;
  }
  box.replaceChildren(...templates.map((t) => el('div', { class: 'list-item' },
    el('div', {}, el('div', { class: 'title' }, t.name), el('div', { class: 'sub' }, t.text.replace(/\n/g, ' ⏎ '))),
    el('div', { class: 'btn-row', style: 'flex-wrap:nowrap' },
      el('button', {
        type: 'button', class: 'btn small',
        onClick: () => {
          editingId = t.id;
          tplName.value = t.name;
          tplText.value = t.text;
          $('#tpl-save').textContent = '💾 Simpan perubahan';
          tplName.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
      }, '✏️'),
      el('button', {
        type: 'button', class: 'btn small',
        onClick: () => {
          if (!confirm(`Padam template "${t.name}"?`)) return;
          templates = templates.filter((x) => x.id !== t.id);
          store.set('templates', templates);
          renderTemplates();
        },
      }, '🗑️')))));
}

// =====================================================================
//  Mula
// =====================================================================
fillForm();
initPoster(() => state.product);
initViral({
  postCard,
  showView,
  getOpts: optsForEngine,
  getSeen: () => seen,
  remember: rememberSeen,
});
initBulk({
  postCard,
  showView,
  getOpts: optsForEngine,
  getSeen: () => seen,
  remember: rememberSeen,
  addHistory,
  defaultProduct: () => ({ ...DEFAULT_PRODUCT, kelebihan: ['', '', ''] }),
});
showView(store.get('tab', 'jana'));

// Kongsi terus dari app Shopee/TikTok ke web ni (PWA share target).
const params = new URLSearchParams(location.search);
const shared = params.get('url') || params.get('text') || params.get('link');
if (shared) {
  const m = shared.match(/https?:\/\/[^\s]+/i);
  if (m) {
    f.link.value = m[0];
    showView('jana');
    onLinkChanged();
  }
  history.replaceState(null, '', location.pathname);
}

if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
