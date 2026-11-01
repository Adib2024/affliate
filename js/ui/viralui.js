// Tab 🔥 Viral: post viral bukan-affiliate untuk bina follower.
import { $, el, chips, copyText, store, toast } from './util.js';
import { NICHES, FORMATS, generateViral, rerollViral } from '../engine/viral.js';
import { PLATFORMS, TONES } from '../engine/data.js';

let deps;
const saved = store.get('viral', {});
const input = {
  niche: NICHES[saved.niche] ? saved.niche : 'duit',
  topik: saved.topik || '',
  poin: saved.poin || ['', '', ''],
  formats: saved.formats || [],
  count: saved.count || 5,
};
let posts = [];

const save = () => store.set('viral', input);

function engineInput() {
  const niche = input.topik.trim() && input.niche === 'umum' ? 'umum' : input.niche;
  return { ...input, niche };
}

function opts() {
  return { ...deps.getOpts(), count: input.count };
}

function styleSummary() {
  const o = deps.getOpts();
  const plat = PLATFORMS[o.platform];
  const box = $('#v-style');
  box.innerHTML = '';
  box.append('Gaya: ', el('b', {}, `${plat.icon} ${plat.label} · ${TONES[o.tone === 'formal' ? 'santai' : o.tone].label}`),
    ' — ', el('a', { href: '#', onClick: (e) => { e.preventDefault(); deps.showView('jana'); } }, 'tukar di tab Jana'));
}

function render() {
  const box = $('#v-posts');
  const has = posts.length > 0;
  $('#btn-vshuffle').hidden = !has;
  $('#btn-vcopy').hidden = !has;
  const plat = PLATFORMS[deps.getOpts().platform];
  $('#v-title').textContent = has ? `${posts.length} post viral ${plat.icon} ${plat.label}` : 'Post viral';
  box.classList.toggle('two', has);
  const reroll = (i) => () => {
    const next = rerollViral(engineInput(), opts(), posts[i].angleId, deps.getSeen());
    if (!next) return;
    posts[i] = next;
    deps.remember([next]);
    box.children[i].replaceWith(deps.postCard(next, i, { onReroll: reroll(i), best: i === 0, noPoster: true }));
  };
  box.replaceChildren(...posts.map((p, i) => deps.postCard(p, i, { onReroll: reroll(i), best: i === 0, noPoster: true })));
  if (has && window.innerWidth < 980) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function run() {
  posts = generateViral(engineInput(), opts(), undefined, deps.getSeen());
  deps.remember(posts);
  render();
}

let emptyHtml = '';

export function initViral(d) {
  deps = d;
  emptyHtml = $('#v-posts').innerHTML;
  const nicheChips = chips($('#c-niche'), Object.entries(NICHES).map(([v, n]) => ({ value: v, label: n.label })), input.niche,
    { onChange: (v) => { input.niche = v; save(); if (v !== 'umum' || input.topik.trim()) run(); else $('#v-topik').closest('details').open = true; } });
  const topik = $('#v-topik');
  topik.value = input.topik;
  topik.addEventListener('input', () => {
    input.topik = topik.value;
    // Taip topik sendiri → automatik pilih "Topik sendiri"
    if (topik.value.trim() && input.niche !== 'umum') { input.niche = 'umum'; nicheChips.set('umum'); }
    save();
  });
  ['v-p1', 'v-p2', 'v-p3'].forEach((id, i) => {
    const inp = $(`#${id}`);
    inp.value = input.poin[i] || '';
    inp.addEventListener('input', () => { input.poin[i] = inp.value; save(); });
  });
  const formatChips = chips($('#c-vformat'), Object.entries(FORMATS).map(([v, f]) => ({ value: v, label: f.label })), input.formats,
    { multi: true, onChange: (v) => { input.formats = v; save(); } });
  chips($('#c-vcount'), [3, 5, 8].map((n) => ({ value: n, label: `${n} post` })), input.count,
    { onChange: (v) => { input.count = v; save(); } });
  $('#btn-viral').addEventListener('click', run);
  $('#v-reset').addEventListener('click', () => {
    input.topik = '';
    input.poin = ['', '', ''];
    input.formats = [];
    topik.value = '';
    ['v-p1', 'v-p2', 'v-p3'].forEach((id) => { $(`#${id}`).value = ''; });
    formatChips.set([]);
    if (input.niche === 'umum') { input.niche = 'duit'; nicheChips.set('duit'); }
    save();
    posts = [];
    render();
    $('#v-posts').classList.remove('two');
    $('#v-posts').innerHTML = emptyHtml;
    toast('🔄 Dah reset');
  });
  $('#btn-vshuffle').addEventListener('click', run);
  $('#btn-vcopy').addEventListener('click', (e) => {
    const texts = [...$('#v-posts').querySelectorAll('.post-body')].map((b, i) => `--- Post ${i + 1} ---\n${b.innerText.trim()}`);
    copyText(texts.join('\n\n'), e.currentTarget);
  });
}

export function viralVisible() {
  styleSummary();
}
