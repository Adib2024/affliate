// =====================================================================
//  PERSONA AKAUN — supaya semua caption bunyi macam akaun anda sendiri.
//  Post yang lari dari gaya akaun biasanya tak ditolak algoritma (follower
//  tak berinteraksi), jadi angle & suara dipilih ikut persona.
// =====================================================================

export const PERSONA_NICHES = {
  lesson: {
    label: '🌷 Life lessons & renungan',
    angles: ['lesson', 'kisahDiri', 'cerita', 'menyesal', 'kisahKeluarga'],
    style: 'story',
  },
  beauty: {
    label: '💄 Beauty & skincare',
    angles: ['testimoni', 'lesson', 'kisahKawan', 'expect', 'kisahDiri', 'rating'],
    style: 'story',
  },
  lawak: {
    label: '😂 Lawak & relatable',
    angles: ['lawak', 'pov', 'kisahKawan', 'expect', 'kisahPasangan', 'menyesal'],
    style: 'viral',
  },
  family: {
    label: '👩‍👧 Mak-mak & keluarga',
    angles: ['kisahKeluarga', 'tips', 'kisahPasangan', 'lesson', 'cerita'],
    style: 'story',
  },
  duit: {
    label: '💸 Kerja, duit & produktiviti',
    angles: ['kisahDiri', 'lesson', 'rating', 'tips', 'menyesal'],
    style: 'story',
  },
  review: {
    label: '⭐ Review barang (umum)',
    angles: ['testimoni', 'rating', 'unboxing', 'expect', 'banding', 'fomo'],
    style: 'jual',
  },
};

export const DEFAULT_PERSONA = {
  set: false,
  niche: 'lesson',
  gender: 'f',
  aku: 'aku',
  korang: 'korang',
  emoji: 'natural',
};

// Watak pasangan ikut jantina pemilik akaun
export const PARTNER_BY_GENDER = {
  f: ['suami aku', 'husband aku', 'tunang aku'],
  m: ['isteri aku', 'wife aku', 'tunang aku'],
};

// Tukar kata ganti diri dalam teks akhir (template cerita guna "aku"/"korang" secara literal)
export function applyVoice(text, persona) {
  if (!persona) return text;
  let out = text;
  if (persona.aku && persona.aku !== 'aku') {
    const a = persona.aku;
    const cap = a === 'I' ? 'I' : a.charAt(0).toUpperCase() + a.slice(1);
    out = out.replace(/\baku\b/g, a).replace(/\bAku\b/g, cap);
  }
  if (persona.korang && persona.korang !== 'korang') {
    const k = persona.korang;
    const cap = k.charAt(0).toUpperCase() + k.slice(1);
    out = out.replace(/\bkorang semua\b/g, k).replace(/\bkorang\b/g, k).replace(/\bKorang\b/g, cap);
  }
  return out;
}

export function personaSummary(p) {
  const n = PERSONA_NICHES[p.niche] || PERSONA_NICHES.lesson;
  return `${n.label} · ${p.gender === 'm' ? 'Lelaki' : 'Perempuan'} · ${p.aku}/${p.korang}`;
}
