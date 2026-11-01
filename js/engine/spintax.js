// Penjana nombor rawak yang boleh diulang (seeded) + pengembang spintax.
//
// Spintax:  {a|b|c}   → pilih satu secara rawak (boleh bersarang, pilihan kosong dibenarkan)
// Token nada: [korang] [aku] [best] ... → diganti ikut nada (lihat TONES dalam data.js).
//            Huruf pertama besar ([Korang]) → hasil juga bermula dengan huruf besar.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function newSeed() {
  if (globalThis.crypto?.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return Math.floor(Math.random() * 2 ** 32);
}

export const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];

export function shuffle(rand, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Kembangkan {a|b|{c|d}} dari dalam ke luar.
export function spin(text, rand) {
  let out = text;
  // Ulang sampai tiada kurungan lagi (yang paling dalam dahulu).
  const inner = /\{([^{}]*)\}/;
  let guard = 0;
  while (inner.test(out) && guard++ < 500) {
    out = out.replace(inner, (_, body) => pick(rand, body.split('|')));
  }
  return out;
}

const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function applyTone(text, tone, rand) {
  return text.replace(/\[([A-Za-z]+)\]/g, (m, key) => {
    const lower = key.toLowerCase();
    const options = tone[lower];
    if (!options) return m;
    const value = spin(pick(rand, options), rand);
    return key.charAt(0) === key.charAt(0).toUpperCase() ? capFirst(value) : value;
  });
}

// Anggaran bilangan kombinasi sesuatu teks spintax (untuk paparan sahaja).
export function countVariants(text) {
  let total = 1;
  const inner = /\{([^{}]*)\}/;
  let t = text;
  let guard = 0;
  while (inner.test(t) && guard++ < 500) {
    t = t.replace(inner, (_, body) => {
      total *= body.split('|').length;
      return 'x';
    });
  }
  return total;
}

export function hashText(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
