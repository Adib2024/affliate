// =====================================================================
//  PERATURAN "SELAMAT ALGORITMA" IKUT PLATFORM (berdasarkan research)
//
//  • Facebook (Meta, polisi rasmi sejak 2017): post yang MEMINTA like / react /
//    tag / share / komen perkataan tertentu ("engagement bait") diturunkan reach.
//    Soalan ikhlas yang ajak orang kongsi pendapat/pengalaman TIDAK terkesan.
//  • Instagram: "sends per reach" (orang hantar post melalui DM) antara isyarat
//    utama untuk sampai kepada bukan-follower → ajak "hantar pada kawan".
//  • Threads: perbualan; post yang tamat dengan soalan & dibalas cepat naik.
//    Satu topic tag sahaja. Post yang terlalu promosi kurang naik.
//  • TikTok / Reels: hook dalam 1–3 saat pertama + teks atas skrin (ramai
//    tonton tanpa bunyi); tunjuk masalah & produk dengan segera.
// =====================================================================

// Baris yang dikira "bait" di Facebook
export const BAIT_RE = /(^|[\s"“(])(tag\s|tag$|like kalau|tekan ❤️|react\b|react je|share (kat|dengan|untuk|pada|kalau)|kongsi (kat|dengan|untuk|pada|kalau)|(komen|drop) ["“]|drop emoji|komen emoji|rate (1|dari)|angkat tangan|^(❤️|😂|😮) =)/i;

export const ENGAGE_BY_PLATFORM = {
  facebook: [
    'Korang pernah alami benda sama tak? Cerita sikit 👇',
    'Jujur, korang rasa berbaloi tak untuk harga {macam ni|ni}? 🤔',
    'Kalau korang, apa yang paling penting bila pilih barang macam ni? 👇',
    'Ada pengalaman lain? Kongsi pendapat, aku baca semua komen 🙏',
    'Korang jenis beli awal atau tunggu sale? 😄',
  ],
  facebookStory: [
    'Siapa pernah lalu benda sama? Cerita kat komen 👇',
    'Korang pernah kena macam ni tak? 👇',
    'Kalau korang jadi aku, korang buat apa? 🤔',
    'Ada tak cerita yang lebih kelakar dari ni? Aku nak dengar 😂',
  ],
  instagram: [
    'Hantar post ni pada kawan yang {perlu|mesti} tengok 📩',
    'Save dulu, nanti senang cari 📌',
    '{Send|Hantar} pada {bestie|geng} yang selalu cari barang macam ni 📩',
  ],
  threads: [
    'Korang pernah tak? 👀',
    'Setuju tak? 🤔',
    'Korang pilih yang mana? 👇',
    'Ada cadangan lain? Aku nak tahu 👇',
  ],
};

// Buang baris "bait" (Facebook sahaja). Pulangkan teks baru.
export function stripBait(text) {
  return text.split('\n').filter((l) => {
    const t = l.trim();
    if (!t) return true;
    if (/https?:|komen (pertama|bawah|paling atas)|di komen|kat komen|dalam komen/i.test(t)) return true; // penunjuk link
    return !BAIT_RE.test(t);
  }).join('\n');
}

// Ada soalan di HUJUNG teks? (abaikan hashtag & baris penunjuk link)
export const hasQuestion = (text, last = 3) => /\?/.test(text.split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#') && !/https?:|komen (pertama|bawah|paling atas)|di komen|kat komen|dalam komen/i.test(l))
  .slice(-last).join(' '));

// ---------- TikTok / Reels: teks atas video ----------
export const OVERLAY_HOOKS = [
  'POV: kau jumpa {{namaPendek}} {{harga}} 😳',
  'Jangan beli {{namaPendek}} sebelum tengok ni ✋',
  'Benda {{harga}} yang ubah rutin aku',
  'Aku menyesal tak beli ni awal 😭',
  'Expectation vs reality: {{namaPendek}}',
  'Rating jujur {{namaPendek}} (1–10)',
  '3 sebab aku repeat order ni',
  'Ramai tanya aku beli kat mana 👀',
  'Tak sangka {{harga}} je?!',
  'Kalau kau selalu {{masalahP}}…',
];

export const VIDEO_SCRIPT = [
  '0–3s: teks hook besar + tunjuk MASALAH (muka/aksi)',
  '3–10s: tunjuk produk sedang digunakan (close-up)',
  '10–20s: 2–3 kelebihan sebagai teks atas skrin',
  'Akhir: harga + {{cta}}',
];

// Waktu post untuk audiens Malaysia (GMT+8). Elak 12 malam–6 pagi.
export const MY_SLOTS = [
  { time: '7:00 pagi', note: 'Scroll sebelum kerja / sekolah' },
  { time: '12:30 tengah hari', note: 'Waktu rehat makan' },
  { time: '6:30 petang', note: 'Dalam perjalanan balik kerja' },
  { time: '8:30 malam', note: 'Lepas makan malam — paling ramai online' },
  { time: '9:30 malam', note: 'Waktu santai depan TV' },
  { time: '10:00 malam', note: 'Scroll sebelum tidur' },
];
