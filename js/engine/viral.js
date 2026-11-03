// =====================================================================
//  POST VIRAL BUKAN-AFFILIATE
//  Untuk bina follower & engagement: relatable, debat, tips, poll, cerita…
//  Placeholder: {{topik}} {{orang}} {{s1}} {{s2}} {{s3}} {{hot}} {{a1}} {{b1}} … {{senarai}}
//  {{senaraiNombor}} {{bil}} {{motivasi}} {{motivasi2}} {{nostalgia}} {{nostalgia2}} {{nostalgia3}} {{emoji}}
// =====================================================================
import { mulberry32, newSeed, pick, shuffle, hashText } from './spintax.js';
import { helpers } from './generator.js';
import { TONES, PLATFORMS } from './data.js';
import { applyVoice } from './persona.js';

const { EMPTY, EMOJI_RE, render, fixTone, fill, dropEmptyLines, tidy, limitEmoji, punchy, stripBait, hasQuestion, ENGAGE_BY_PLATFORM } = helpers;

export const NICHES = {
  duit: {
    label: '💸 Duit & Gaji', topik: 'duit & gaji', orang: '{warga gaji bulan-bulan|orang makan gaji}',
    emoji: ['💸', '🥲', '💰', '😂', '📉'],
    situasi: ['check baki bank sambil tutup sebelah mata', 'cakap "bulan ni nak save" tapi hari ke-3 dah checkout', 'kira berapa hari lagi nak gaji macam countdown raya', 'gaji masuk pukul 12 malam, pukul 12.05 dah habis bayar bil', 'beli kopi RM15 tapi berkira nak bayar parking RM1'],
    tips: ['Asingkan duit simpanan sebaik gaji masuk — bukan simpan baki', 'Catat semua perbelanjaan seminggu, korang akan terkejut duit pergi ke mana', 'Tunggu 24 jam sebelum beli benda yang bukan keperluan', 'Bina tabung kecemasan sekurang-kurangnya 3 bulan perbelanjaan'],
    hot: ['gaji besar tak jamin kaya — tabiat belanja yang tentukan', 'simpan duit tak semestinya kena berhenti enjoy langsung', 'beli rumah awal bukan keputusan terbaik untuk semua orang'],
    pilihan: [['Simpan duit', 'Travel'], ['Kereta baru', 'Rumah dulu'], ['Bayar hutang dulu', 'Simpan dulu']],
    hashtags: ['#DuitGaji', '#KewanganPeribadi', '#TipsJimat', '#GajiMasuk', '#RelatableMY'],
  },
  kerja: {
    label: '💼 Kerja & Office', topik: 'kerja', orang: '{budak office|warga kerja 9-5}',
    emoji: ['💼', '😮‍💨', '☕', '😂', '🖥️'],
    situasi: ['reply "noted" padahal tak faham langsung', 'pergi pantry 5 kali sehari sebab bosan', 'buka email Isnin pagi terus rasa nak cuti', 'cakap "on the way" padahal baru bangun', 'meeting sejam untuk benda yang boleh settle dalam satu email'],
    tips: ['Siapkan 3 kerja paling penting dulu sebelum buka email', 'Belajar cakap "tak boleh" dengan sopan', 'Rehat 5 minit setiap jam — mata & otak perlukan', 'Simpan rekod pencapaian kerja untuk masa appraisal'],
    hot: ['kerja keras tanpa kerja bijak cuma buat penat', 'WFH lebih produktif dari masuk office untuk kebanyakan kerja', 'setia dengan satu syarikat bukan lagi jaminan masa depan'],
    pilihan: [['WFH', 'Masuk office'], ['Gaji tinggi tapi stress', 'Gaji sederhana tapi tenang'], ['Bos garang tapi adil', 'Bos baik tapi tak tegas']],
    hashtags: ['#KerjaOffice', '#BudakOffice', '#KerjayaMY', '#WFHMalaysia', '#RelatableMY'],
  },
  parenting: {
    label: '👶 Mak-mak & Parenting', topik: 'jaga anak', orang: '{mak-mak|mak ayah zaman sekarang}',
    emoji: ['👶', '🥲', '🧸', '😂', '💕'],
    situasi: ['pujuk anak makan sampai nasi sendiri dah sejuk', 'akhirnya anak tidur, tapi mak pula scroll phone sampai pukul 2', 'terpijak Lego pukul 2 pagi', 'cakap "last satu episod je" tapi anak tengok 10 lagi', 'masuk tandas pun ada penonton'],
    tips: ['Bagi anak pilihan terhad: "Nak baju merah atau biru?"', 'Puji usaha anak, bukan hanya hasil', 'Tetapkan had masa skrin yang jelas & konsisten', 'Jaga diri sendiri juga — mak ayah yang penat susah nak sabar'],
    hot: ['anak tak perlu masuk kelas tuisyen sejak umur 4 tahun', 'mak ayah pun boleh minta maaf pada anak', 'gadget bukan musuh — cara guna yang penting'],
    pilihan: [['Anak tidur dengan mak ayah', 'Anak tidur bilik sendiri'], ['Babysitter', 'Hantar taska'], ['Bekal dari rumah', 'Beli kat kantin']],
    hashtags: ['#MakMak', '#ParentingMalaysia', '#IbuBapa', '#AnakAnak', '#RelatableMY'],
  },
  kucing: {
    label: '🐱 Kucing & Pet', topik: 'bela kucing', orang: '{hamba kucing|cat lovers}',
    emoji: ['🐱', '😻', '🐾', '😂', '🥹'],
    situasi: ['beli mainan mahal, kucing pilih main dengan kotak dia', 'tak bergerak sejam sebab kucing tidur atas riba', 'ambil 50 gambar kucing sehari, semua nampak sama', 'beli makanan kucing premium, tapi diri sendiri makan Maggi', 'bercakap dengan kucing macam dia faham semua'],
    tips: ['Sediakan tempat cakar supaya perabot selamat', 'Bawa kucing check-up & vaksin ikut jadual', 'Pastikan air bersih sentiasa ada', 'Bersihkan litter box setiap hari'],
    hot: ['kucing kampung lebih comel dari kucing baka', 'kucing pun boleh merajuk — jangan cakap tak', 'bela kucing lebih menenangkan dari pergi spa'],
    pilihan: [['Kucing oren', 'Kucing hitam'], ['Kucing manja', 'Kucing garang'], ['Seekor je', 'Satu rumah penuh']],
    hashtags: ['#KucingMalaysia', '#HambaKucing', '#Anabul', '#CatLoversMY', '#KucingComel'],
  },
  makanan: {
    label: '🍜 Makanan', topik: 'makan', orang: '{kaki makan|foodie}',
    emoji: ['🍜', '😋', '🤤', '😂', '🍛'],
    situasi: ['buka peti ais 5 kali padahal tahu takde apa', 'cakap "diet start Isnin" setiap Isnin', 'ambil gambar makanan sampai sejuk', 'tengok video masak pukul 2 pagi sampai lapar', 'order menu sama setiap kali walaupun ada 50 pilihan'],
    tips: ['Masak lebih dan simpan untuk bekal esok — jimat masa & duit', 'Simpan bawang & cili yang dah dipotong dalam bekas kedap udara', 'Rasa masakan dulu sebelum tambah garam', 'Rancang menu seminggu sebelum pergi pasar'],
    hot: ['nasi lemak paling sedap ialah yang bungkus tepi jalan', 'kuah lebih penting dari nasi', 'makan pakai tangan lagi sedap dari sudu garpu'],
    pilihan: [['Nasi lemak', 'Roti canai'], ['Teh tarik', 'Kopi O'], ['Pedas', 'Tak pedas']],
    hashtags: ['#MakananMalaysia', '#FoodieMY', '#KakiMakan', '#SedapGila', '#RelatableMY'],
  },
  skincare: {
    label: '💄 Kecantikan', topik: 'skincare & makeup', orang: '{kaki skincare|beauty junkie}',
    emoji: ['💄', '✨', '🧴', '😂', '💅'],
    situasi: ['beli skincare baru sebelum habis yang lama', 'tidur tak buang makeup lepas tu menyesal pagi esok', 'tengok 30 video review sebelum beli satu lipstik', 'ada 10 lipstik tapi pakai warna sama je', 'buat rutin 10 langkah malam, pagi esok bangun lewat'],
    tips: ['Pakai sunscreen setiap hari, walaupun duduk rumah', 'Cuba produk baru satu-satu, bukan serentak', 'Buat patch test dulu kalau kulit sensitif', 'Tidur cukup & minum air — skincare paling murah'],
    hot: ['rutin skincare simple lagi berkesan dari 10 langkah', 'mahal tak semestinya sesuai dengan kulit kau', 'sunscreen lagi penting dari serum'],
    pilihan: [['Matte', 'Dewy'], ['Makeup penuh', 'No makeup look'], ['Skincare mahal', 'Skincare drugstore']],
    hashtags: ['#SkincareMalaysia', '#BeautyTipsMY', '#MakeupMY', '#GlowUp', '#RelatableMY'],
  },
  rumah: {
    label: '🏠 Rumah & Kemas', topik: 'kemas rumah', orang: '{suri rumah|orang yang suka kemas}',
    emoji: ['🏠', '🧺', '✨', '😂', '🧹'],
    situasi: ['kemas rumah laju-laju bila tetamu nak datang', 'simpan beg plastik dalam beg plastik', 'ada satu kerusi khas untuk sangkut baju', 'beli bekas baru untuk susun barang, last-last bekas pula bersepah', 'jumpa barang hilang selepas dah beli yang baru'],
    tips: ['Kemas 10 minit setiap malam — rumah tak sempat bersepah', 'Satu barang masuk, satu barang keluar', 'Simpan barang ikut kekerapan guna', 'Lipat baju terus lepas angkat dari ampaian'],
    hot: ['rumah kemas bukan tanda rajin — tanda sistem bagus', 'barang banyak tak buat rumah lebih selesa', 'mesin basuh lagi penting dari TV besar'],
    pilihan: [['Minimalis', 'Penuh barang'], ['Basuh pinggan terus', 'Rendam dulu'], ['Lipat baju terus', 'Bukit baju dulu']],
    hashtags: ['#RumahKemas', '#TipsRumah', '#SuriRumah', '#DeclutterMY', '#RelatableMY'],
  },
  student: {
    label: '🎓 Student', topik: 'belajar', orang: '{student|budak U}',
    emoji: ['🎓', '📚', '😭', '😂', '✏️'],
    situasi: ['buat assignment malam sebelum due date', 'beli alat tulis comel tapi tak study pun', 'cakap "study group" tapi last-last bergosip', 'mesej lecturer pukul 2 pagi', 'stress exam tapi habiskan satu season drama'],
    tips: ['Belajar 25 minit, rehat 5 minit (teknik Pomodoro)', 'Ajar semula apa yang dipelajari kepada orang lain', 'Buat nota ringkas guna ayat sendiri', 'Tidur cukup sebelum exam — lebih berkesan dari study sampai subuh'],
    hot: ['markah tinggi bukan satu-satunya ukuran berjaya', 'study group selalunya tak produktif', 'kerja part-time masa belajar bagi pengalaman yang berharga'],
    pilihan: [['Study pagi', 'Study malam'], ['Library', 'Kafe'], ['Nota tulis tangan', 'Nota digital']],
    hashtags: ['#StudentLife', '#BudakU', '#StudyTips', '#StudentMY', '#RelatableMY'],
  },
  kahwin: {
    label: '💍 Hubungan & Kahwin', topik: 'hubungan', orang: '{pasangan|suami isteri}',
    emoji: ['💍', '🥰', '😂', '💕', '🙈'],
    situasi: ['tanya "nak makan apa?" lepas tu reject semua cadangan', 'gaduh pasal benda kecil, lepas tu lupa gaduh pasal apa', 'share video lucu dengan pasangan padahal duduk sebelah', 'cakap "takpe" tapi sebenarnya ada apa-apa', 'curi makanan dalam pinggan pasangan'],
    tips: ['Luangkan masa bercakap tanpa phone setiap hari', 'Ucap terima kasih untuk benda kecil', 'Bincang kewangan secara terbuka', 'Bila gaduh, lawan masalah — bukan lawan pasangan'],
    hot: ['majlis kahwin sederhana lebih bijak dari bergaya tapi berhutang', 'pasangan pun perlukan masa sendiri', 'bahasa cinta setiap orang berbeza'],
    pilihan: [['Majlis besar', 'Majlis kecil'], ['Duit asing', 'Duit bersama'], ['Tinggal dengan family', 'Duduk sendiri']],
    hashtags: ['#SuamiIsteri', '#KahwinMY', '#Couple', '#RelationshipMY', '#RelatableMY'],
  },
  motivasi: {
    label: '🌱 Motivasi & Diri', topik: 'diri sendiri', orang: '{manusia biasa|orang yang tengah berusaha}',
    emoji: ['🌱', '🤍', '✨', '🙏', '☀️'],
    situasi: ['buat to-do list cantik tapi tak buat satu pun', 'niat bangun awal tapi tekan snooze 5 kali', 'bandingkan hidup sendiri dengan orang lain kat media sosial', 'penat tapi tak tahu penat sebab apa', 'nak mula sesuatu tapi tunggu "masa yang sesuai"'],
    tips: ['Mula kecil — 1% lebih baik setiap hari', 'Rehat bukan malas; rehat sebahagian dari usaha', 'Kurangkan bandingkan diri dengan highlight orang lain', 'Tulis 3 benda yang kau syukuri setiap malam'],
    hot: ['tak semua orang perlu bangun pukul 5 pagi untuk berjaya', 'berhenti bukan semestinya tanda kalah', 'motivasi datang selepas mula, bukan sebelum'],
    pilihan: [['Pagi produktif', 'Malam produktif'], ['Plan semua', 'Ikut flow'], ['Introvert', 'Extrovert']],
    hashtags: ['#Motivasi', '#SelfCare', '#KataKata', '#Muhasabah', '#PositiveVibes'],
  },
  umum: {
    label: '✏️ Topik sendiri', topik: 'benda ni', orang: '{kita semua|semua orang}',
    emoji: ['😂', '✨', '👀', '🤔', '🔥'],
    situasi: ['cakap "sekejap je" tapi sejam pun tak siap', 'buka phone nak check satu benda, terus scroll sejam', 'rancang banyak benda hujung minggu, last-last tidur je', 'beli barang sebab diskaun, bukan sebab perlu', 'tangguh kerja 5 minit selama seminggu'],
    tips: [],
    hot: [],
    pilihan: [],
    hashtags: ['#RelatableMY', '#Malaysia', '#FYP'],
  },
};

const MOTIVASI = [
  'Kau tak lambat. Kau di laluan kau sendiri.',
  'Progress kecil tetap progress.',
  'Rehat bukan malas. Rehat sebahagian dari usaha.',
  'Tak semua hari kena produktif. Ada hari cukup sekadar bertahan.',
  'Bandingkan diri kau dengan kau semalam, bukan dengan orang lain.',
  'Benda yang kau risau hari ni mungkin tak penting lagi bulan depan.',
  'Syukur dengan apa yang ada, sambil usaha untuk apa yang belum.',
  'Mula dulu. Sempurna kemudian.',
];

const NOSTALGIA = [
  'Tunggu kartun pukul 6 petang lepas balik sekolah',
  'Gulung balik kaset guna pensel',
  'Main getah, batu seremban & polis sentry',
  'Beli jajan 20 sen kat kedai runcit',
  'Simpan duit dalam tabung tin susu',
  'Main game Snake kat Nokia sampai bateri habis',
  'Tulis diari & kunci dengan mangga kecil',
  'Tambah kredit prabayar RM10 dan jimat SMS',
];

export const FORMATS = {
  relatable: {
    label: '😂 Relatable',
    templates: [
      `{Siapa|Sape} relate? 😂🙋‍♀️

Pernah {{s1}}?
Atau {{s2}}?

Kalau dua-dua ya, kita geng 🤝
Tag kawan yang macam ni 👇`,
      `Benda yang semua {{orang}} pernah buat tapi tak nak mengaku 👇

1. {{s1Cap}}
2. {{s2Cap}}
3. {{s3Cap}}

Nombor berapa paling kau? 😂`,
      `POV: kau {{s1}} {{emoji}}

…dan kau sedar kau bukan seorang 😂
Komen "SAYA" kalau ni kau 👇`,
    ],
  },
  hottake: {
    label: '🌶️ Hot Take / Debat',
    needs: 'hot',
    templates: [
      `Unpopular opinion: {{hot}} 🌶️

Setuju ✅ atau tak ❌?
Gaduh kat komen, aku tunggu 🍿`,
      `Aku tahu ramai tak setuju, tapi…
{{hotCap}}.

Ubah fikiran aku. Komen 👇`,
      `{{orangCap}}, soalan cepu emas: {{a1}} atau {{b1}}? 🤔

Jawab jujur. Tak boleh jawab "dua-dua" 😂`,
    ],
  },
  pilih: {
    label: '🗳️ This or That / Poll',
    needs: 'pilihan',
    templates: [
      `This or That: edisi {{topik}} 👇

{{a1}} atau {{b1}}?
{{a2}} atau {{b2}}?
{{a3}} atau {{b3}}?

Jawab dalam komen (contoh: A, B, A) 😂`,
      `Soalan cepat untuk {{orang}} 🗳️

{{a1}} atau {{b1}}?

Jawab dalam komen, dan bagi satu sebab 😄
Aku nak tengok team mana paling ramai.`,
    ],
  },
  tips: {
    label: '💡 Tips',
    needs: 'tips',
    templates: [
      `{{bil}} tips {{topik}} yang aku harap aku tahu lebih awal 👇

{{senaraiNombor}}

Save dulu, nanti cari 📌`,
      `Benda yang ubah cara aku {urus|tengok} {{topik}} 💡

{{senarai}}

Yang mana kau dah buat? 👇`,
      `Kalau kau baru nak mula pasal {{topik}}, baca ni dulu ✋

{{senaraiNombor}}

Share pada kawan yang perlu 🔁`,
    ],
  },
  kisah: {
    label: '📖 Storyline',
    templates: [
      `Post panjang sikit. Tapi aku rasa ramai {{orang}} akan relate 🙏

{Semalam|Minggu lepas} aku {{s1}}.
Aku ingat aku sorang je yang macam ni.

Malam tu aku cerita dalam group WhatsApp.
{Tak sampai 5 minit|Sekejap je}, group tu meletup 😂

Sorang cakap dia pernah {{s2}}.
Sorang lagi mengaku dia selalu {{s3}}.

Dari situ aku sedar satu benda…
{{motivasi}}

Kita semua sebenarnya {lebih sama|tak jauh beza} dari yang kita sangka 🤍

Korang pernah tak? Cerita kat komen 👇`,
      `Aku nak cerita sikit pasal {{topik}} ☕

{Dulu|Sebelum ni} aku selalu {{s1}}.
{Orang|Kawan-kawan} tegur, aku buat tak tahu je 🙈

Sampai satu hari, aku {{s2}}… dan masa tu aku rasa {malu|terpukul} sangat 😅

Lepas kejadian tu aku mula ubah sikit-sikit.
Bukan terus sempurna.
Tapi setiap hari, lebih baik sikit dari semalam.

Sekarang bila aku tengok balik, aku senyum sorang-sorang.
{{motivasi}}

Siapa pernah lalu fasa yang sama? 👇`,
    ],
  },
  cerita: {
    label: '☕ Storytime / Confession',
    templates: [
      `Storytime ☕

Semalam aku {{s1}}.
Lepas tu aku sedar… aku dah buat benda sama {berkali-kali|banyak kali minggu ni}.

Aku je ke macam ni? 😂`,
      `Confession 🙈

Aku pernah {{s1}}.
Dan {{s2}}.

Okay giliran korang. Confess dalam komen 👇`,
    ],
  },
  tanda: {
    label: '🏆 Tanda-tanda Kau…',
    templates: [
      `3 tanda kau {{orang}} sejati 😂

1. Kau pernah {{s1}}
2. Kau selalu {{s2}}
3. Kau {{s3}}

Dapat 3/3? Tahniah 🏆 Tag geng kau 👇`,
      `Kau confirm {{orang}} kalau… 👇

✅ {{s1Cap}}
✅ {{s2Cap}}
✅ {{s3Cap}}

Berapa yang kena? 😂`,
    ],
  },
  motivasi: {
    label: '🌱 Motivasi',
    hashtags: ['#Motivasi', '#KataKata', '#SelfCare', '#PositiveVibes'],
    templates: [
      `Peringatan untuk diri sendiri (dan kau yang baca ni) 🤍

{{motivasi}}

Simpan untuk hari yang berat.`,
      `Kalau hari ni terasa berat, baca ni 🌱

{{motivasi}}
{{motivasi2}}

Kau dah buat yang terbaik. Rehat sekejap pun tak apa 🤍`,
    ],
  },
  nostalgia: {
    label: '🥹 Nostalgia 90-an',
    hashtags: ['#Budak90an', '#Nostalgia', '#ZamanKanakKanak', '#Malaysia'],
    templates: [
      `Siapa ingat benda ni? 🥹

{{nostalgia}}
{{nostalgia2}}

Kalau kau ingat dua-dua, umur kau dah… okay tak payah sebut 😂`,
      `Budak 90-an je faham 👇

✅ {{nostalgia}}
✅ {{nostalgia2}}
✅ {{nostalgia3}}

Tambah lagi dalam komen 👇`,
    ],
  },
};

const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function buildVars(input, rand, tone) {
  const niche = NICHES[input.niche] || NICHES.umum;
  const toned = (t) => render(t, rand, tone);
  const custom = String(input.topik || '').trim();
  const points = (input.poin || []).map((p) => String(p || '').trim()).filter(Boolean);
  const tips = points.length ? points : niche.tips;
  const sit = shuffle(rand, niche.situasi).map(toned);
  const pairs = shuffle(rand, niche.pilihan);
  const mot = shuffle(rand, MOTIVASI);
  const nos = shuffle(rand, NOSTALGIA);
  const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
  const hot = niche.hot.length ? toned(pick(rand, niche.hot)) : '';
  const orang = toned(niche.orang);
  return {
    topik: custom || niche.topik,
    orang,
    orangCap: capFirst(orang),
    s1: sit[0] || '', s2: sit[1] || '', s3: sit[2] || '',
    s1Cap: capFirst(sit[0] || ''), s2Cap: capFirst(sit[1] || ''), s3Cap: capFirst(sit[2] || ''),
    hot, hotCap: capFirst(hot),
    a1: pairs[0]?.[0] || '', b1: pairs[0]?.[1] || '',
    a2: pairs[1]?.[0] || '', b2: pairs[1]?.[1] || '',
    a3: pairs[2]?.[0] || '', b3: pairs[2]?.[1] || '',
    senarai: tips.slice(0, 4).map((t) => `✅ ${t}`).join('\n'),
    senaraiNombor: tips.slice(0, 5).map((t, i) => `${nums[i]} ${t}`).join('\n'),
    bil: tips.length ? String(Math.min(tips.length, 5)) : '',
    motivasi: mot[0], motivasi2: mot[1],
    nostalgia: nos[0], nostalgia2: nos[1], nostalgia3: nos[2],
    emoji: pick(rand, niche.emoji),
    _tips: tips.length, _hot: Boolean(hot), _pilihan: pairs.length,
  };
}

function available(fmt, vars) {
  if (fmt.needs === 'tips') return vars._tips > 0;
  if (fmt.needs === 'hot') return vars._hot || vars._pilihan > 0;
  if (fmt.needs === 'pilihan') return vars._pilihan > 0;
  return true;
}

const SWEET = { facebook: [80, 600], instagram: [80, 900], tiktok: [40, 300], threads: [60, 500], x: [40, 280], whatsapp: [60, 500] };

function score(text, platform) {
  const first = (text.split('\n').find((l) => l.trim()) || '').trim();
  const n = [...text].length;
  const [lo, hi] = SWEET[platform] || SWEET.facebook;
  const emojis = (text.match(EMOJI_RE) || []).length;
  const checks = [
    [first.length <= 80, 20, 'Baris pertama lebih pendek & padu'],
    [/[?!]|\d|😂|🥹|👀|🌶️|🙋/u.test(first), 15, 'Mulakan dengan soalan, nombor atau emosi'],
    platform === 'facebook'
      ? [hasQuestion(text) && stripBait(text) === text, 25, 'Facebook: tamat dengan soalan ikhlas, elak "tag/like/react"']
      : [/komen|tag |save|simpan|share|kongsi|react|jawab|setuju|confess|hantar|❤️|\?/i.test(text), 25, 'Ajak orang komen, save atau hantar pada kawan'],
    [/\n\s*\n/.test(text), 15, 'Pecahkan perenggan supaya senang dibaca'],
    [emojis >= 1 && emojis <= 10, 10, 'Guna emoji secukupnya'],
    [n >= lo && n <= hi, 15, `Panjang ideal: ${lo}–${hi} aksara`],
  ];
  let s = 0;
  const tips = [];
  for (const [ok, pts, tip] of checks) { if (ok) s += pts; else tips.push(tip); }
  return { score: s, tips };
}

function pickTags(niche, platform, rand) {
  const [min, max] = PLATFORMS[platform]?.tags || [0, 0];
  if (!max) return [];
  const n = min + Math.floor(rand() * (max - min + 1));
  return shuffle(rand, niche.hashtags).slice(0, n);
}

function buildOne(input, opts, fmtId, tIndex, seed) {
  const rand = mulberry32(seed);
  const toneKey = opts.tone === 'formal' ? 'santai' : opts.tone;
  const tone = fixTone(TONES[toneKey] || TONES.santai, rand);
  const vars = buildVars(input, rand, tone);
  const fmt = FORMATS[fmtId];
  const platform = PLATFORMS[opts.platform] || PLATFORMS.facebook;
  let text = tidy(dropEmptyLines(fill(render(fmt.templates[tIndex], rand, tone), vars)));
  if (opts.viral !== false) text = punchy(text);
  // Peraturan platform: Facebook elak "bait"; Instagram ajak hantar (sends); Threads tamat dengan soalan.
  if (opts.platform === 'facebook') {
    text = tidy(stripBait(text));
    if (!hasQuestion(text)) text = `${text}\n\n${render(pick(rand, ENGAGE_BY_PLATFORM.facebookStory), rand, tone)}`;
  } else if (opts.platform === 'threads' && !hasQuestion(text)) {
    text = `${text}\n\n${render(pick(rand, ENGAGE_BY_PLATFORM.threads), rand, tone)}`;
  } else if (opts.platform === 'instagram' && !/hantar|send/i.test(text)) {
    text = `${text}\n${render(pick(rand, ENGAGE_BY_PLATFORM.instagram), rand, tone)}`;
  }
  if (platform.compact) {
    const lines = text.split('\n');
    while (lines.length > 2 && lines.join('\n').length > platform.limit) lines.splice(lines.length - 2, 1);
    text = tidy(lines.join('\n'));
  }
  if (opts.platform === 'whatsapp') {
    const [first, ...rest] = text.split('\n');
    text = [`*${first.replace(/\*/g, '')}*`, ...rest].join('\n');
  }
  text = applyVoice(limitEmoji(text, opts.emoji), opts.persona);
  const tagSource = fmt.hashtags ? { hashtags: fmt.hashtags } : (NICHES[input.niche] || NICHES.umum);
  const tags = opts.hashtags ? pickTags(tagSource, opts.platform, rand) : [];
  let full = tags.length ? `${text}\n\n${tags.join(' ')}` : text;
  if (platform.limit && [...full].length > platform.limit) full = text;
  if (platform.limit && [...full].length > platform.limit) full = `${[...full].slice(0, platform.limit - 1).join('')}…`;
  const { score: sc, tips } = score(full, opts.platform);
  return {
    id: `v-${fmtId}-${tIndex}-${seed}`, angleId: fmtId, angleLabel: fmt.label, text: full, comment: '',
    score: sc, tips, hash: hashText(full), chars: [...full].length,
  };
}

function formatPool(input, opts, rand) {
  const probe = buildVars(input, rand, TONES.santai);
  let ids = Object.keys(FORMATS).filter((id) => available(FORMATS[id], probe));
  if (input.formats?.length) {
    const chosen = ids.filter((id) => input.formats.includes(id));
    if (chosen.length) ids = chosen;
  }
  return ids;
}

export function generateViral(input, opts, seed = newSeed(), seen = new Set()) {
  const rand = mulberry32(seed);
  const pool = shuffle(rand, formatPool(input, opts, rand));
  const count = opts.count || 5;
  const posts = [];
  const used = new Set();
  let i = 0;
  let guard = 0;
  while (posts.length < count && guard++ < count * 20) {
    const id = pool[i++ % pool.length];
    const t = Math.floor(rand() * FORMATS[id].templates.length);
    const key = `${id}:${t}`;
    const total = pool.reduce((s, f) => s + FORMATS[f].templates.length, 0);
    if (used.has(key) && used.size < total) continue;
    used.add(key);
    let post = buildOne(input, opts, id, t, Math.floor(rand() * 2 ** 32));
    for (let r = 0; r < 6 && seen.has(post.hash); r++) post = buildOne(input, opts, id, t, Math.floor(rand() * 2 ** 32));
    posts.push(post);
  }
  return posts.sort((a, b) => b.score - a.score);
}

export function rerollViral(input, opts, fmtId, seen = new Set()) {
  const fmt = FORMATS[fmtId];
  if (!fmt) return null;
  let post;
  for (let r = 0; r < 10; r++) {
    const seed = newSeed();
    post = buildOne(input, opts, fmtId, seed % fmt.templates.length, seed);
    if (!seen.has(post.hash)) break;
  }
  return post;
}

export { EMPTY };
