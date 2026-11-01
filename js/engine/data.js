// =====================================================================
//  BANK AYAT — semua kepelbagaian caption datang dari fail ini.
//  Nak tambah gaya sendiri? Tambah template baru dalam ANGLES di bawah,
//  atau guna tab "Template Saya" dalam web (tak perlu sentuh kod).
//
//  Placeholder yang boleh guna dalam template:
//   {{nama}} {{namaPendek}} {{harga}} {{hargaNombor}} {{hargaAsal}} {{hargaAsalCoret}}
//   {{diskaun}} {{jimat}} {{hargaBulat}} {{k1}} {{k2}} {{k3}} {{k1i}} {{k2i}} {{k3i}}
//   {{senarai}} {{senaraiNombor}} {{bilKelebihan}} {{untuk}} {{kedai}} {{emoji}}
//   {{masalah}} {{musim}}
//  Baris yang mengandungi placeholder kosong akan dibuang secara automatik.
// =====================================================================

// ---------- NADA ----------
// Token [korang] [aku] [best] [weh] [beli] [murah] [cepat] [serius] dalam template
// diganti ikut nada yang dipilih.
export const TONES = {
  santai: {
    label: '😎 Santai',
    korang: ['{korang|geng|korang semua|kawan-kawan}'],
    aku: ['{aku|saya}'],
    best: ['{best|padu|power|syok|mantap}'],
    weh: ['{Weh|Geng|Korang|Hai geng}'],
    beli: ['{checkout|grab|sambar|ambil}'],
    murah: ['{murah|jimat|berbaloi|mesra poket}'],
    cepat: ['{cepat|laju-laju|sebelum habis}'],
    serius: ['{serius|sumpah|betul}'],
  },
  rojak: {
    label: '🇲🇾 Rojak BM-English',
    korang: ['{you all|korang|guys|uols}'],
    aku: ['{I|aku}'],
    best: ['{best gila|worth it|superb|padu|so good}'],
    weh: ['{Guys|OMG guys|Okay guys|Hello babes}'],
    beli: ['{checkout|grab|add to cart}'],
    murah: ['{murah|affordable|worth it|cheap gila}'],
    cepat: ['{fast|cepat|ASAP}'],
    serius: ['{seriously|serius|honestly}'],
  },
  formal: {
    label: '👔 Formal',
    korang: ['{anda|tuan/puan}'],
    aku: ['{saya}'],
    best: ['{berkualiti|sangat bagus|terbaik|cemerlang}'],
    weh: ['{Hai|Salam sejahtera|Assalamualaikum dan salam sejahtera}'],
    beli: ['{dapatkan|miliki|tempah}'],
    murah: ['{berpatutan|mampu milik|jimat}'],
    cepat: ['{segera|sekarang}'],
    serius: ['{sungguh|benar-benar}'],
  },
  lawak: {
    label: '😂 Lawak',
    korang: ['{korang|geng|kawan-kawan sekalian|warga troli}'],
    aku: ['{aku|saya yang lemah iman ni|aku}'],
    best: ['{best sampai nak nangis|padu gila|power giler|best tahap dewa}'],
    weh: ['{Weh|Aduhai|Mak aih|Ya ampun geng}'],
    beli: ['{checkout|sambar|culik masuk troli}'],
    murah: ['{murah gila|murah sampai rasa bersalah|jimat}'],
    cepat: ['{cepat|laju macam lipas|sebelum orang lain sambar}'],
    serius: ['{sumpah tak tipu|serius ni|betul-betul}'],
  },
  urgent: {
    label: '🚨 Urgent / FOMO',
    korang: ['{korang|semua|geng}'],
    aku: ['{aku|saya}'],
    best: ['{best|padu|power}'],
    weh: ['{‼️ PERHATIAN|🚨 Cepat|⏰ Last call|🔥 HOT}'],
    beli: ['{grab sekarang|checkout cepat|sambar terus}'],
    murah: ['{murah|jimat|harga jatuh}'],
    cepat: ['{SEKARANG|cepat sebelum habis|harini jugak}'],
    serius: ['{serius|betul}'],
  },
};

// ---------- KATEGORI ----------
export const CATEGORIES = {
  fesyen: {
    label: '👗 Fesyen',
    keywords: ['baju', 'tudung', 'shawl', 'kasut', 'seluar', 'dress', 'jubah', 'kurung', 'blouse', 'beg', 'bag', 'skirt', 'jaket', 'hoodie', 't-shirt', 'tshirt', 'kemeja', 'sandal', 'selipar', 'sneakers', 'jam', 'watch', 'cermin mata', 'pakaian', 'abaya', 'inner', 'stokin', 'topi', 'cap'],
    emoji: ['👗', '👠', '✨', '💃', '🛍️', '🧕', '👜'],
    masalah: [
      'Baju dalam almari penuh tapi rasa {takde|tak ada} baju nak pakai?',
      'Susah cari {pakaian|outfit} yang selesa tapi tetap nampak kemas?',
      'Penat cari outfit yang {muat bajet|ngam dengan bajet}?',
    ],
    hashtags: ['#OOTDMalaysia', '#FesyenMurah', '#FesyenWanita', '#OutfitIdea', '#BajuMurah'],
    defaultK: ['Nampak kemas & bergaya', 'Sesuai untuk pakai harian', 'Harga berbaloi'],
  },
  kecantikan: {
    label: '💄 Kecantikan',
    keywords: ['serum', 'krim', 'cream', 'lipstik', 'lipstick', 'lip', 'makeup', 'bedak', 'foundation', 'cushion', 'skincare', 'toner', 'cleanser', 'sunscreen', 'sunblock', 'mask', 'perfume', 'minyak wangi', 'mascara', 'eyeliner', 'blusher', 'pencuci muka', 'facial', 'lotion', 'body wash', 'shampoo', 'syampu', 'rambut', 'kuku', 'nail'],
    emoji: ['💄', '💅', '✨', '🌸', '🧴', '💖', '🪞'],
    masalah: [
      'Muka {kusam|nampak penat} dan tak bermaya?',
      'Makeup cepat cair bila {panas|cuaca panas}?',
      'Kulit kering tak kira berapa banyak pakai pelembap?',
    ],
    hashtags: ['#SkincareMalaysia', '#BeautyFinds', '#MakeupMurah', '#GlowUp', '#RacunSkincare'],
    defaultK: ['Senang guna setiap hari', 'Sesuai untuk rutin harian', 'Harga berbaloi'],
  },
  rumah: {
    label: '🏠 Rumah & Dapur',
    keywords: ['dapur', 'periuk', 'kuali', 'pinggan', 'cawan', 'rak', 'storage', 'bekas', 'container', 'penyapu', 'mop', 'cadar', 'bantal', 'langsir', 'lampu', 'kipas', 'blender', 'air fryer', 'airfryer', 'rice cooker', 'kettle', 'pisau', 'organizer', 'tilam', 'karpet', 'tuala', 'sabun', 'pencuci', 'vacuum', 'sudip', 'botol air'],
    emoji: ['🏠', '🍳', '🧽', '🧺', '✨', '🪴', '🛋️'],
    masalah: [
      'Dapur selalu bersepah dan susah nak kemas?',
      'Penat buat kerja rumah yang tak habis-habis?',
      'Ruang rumah {sempit|kecil} dan barang {bersepah|merata}?',
    ],
    hashtags: ['#RumahKemas', '#BarangDapur', '#HomeDecorMalaysia', '#IdeaRumah', '#DapurCantik'],
    defaultK: ['Jimat masa & tenaga', 'Senang dibersihkan', 'Rumah nampak lebih kemas'],
  },
  gajet: {
    label: '📱 Gajet',
    keywords: ['phone', 'telefon', 'charger', 'cable', 'kabel', 'earphone', 'earbuds', 'headphone', 'powerbank', 'power bank', 'speaker', 'smartwatch', 'casing', 'case', 'tripod', 'ring light', 'mouse', 'keyboard', 'laptop', 'tablet', 'ipad', 'usb', 'bluetooth', 'wireless', 'kamera', 'camera', 'mic', 'router', 'led'],
    emoji: ['📱', '🎧', '🔌', '⚡', '💻', '🔋', '🎮'],
    masalah: [
      'Bateri phone selalu habis {time penting|masa paling perlu}?',
      'Wayar {berselirat|bersimpul} dan selalu rosak?',
      'Gajet lama dah lembap dan buat stress?',
    ],
    hashtags: ['#GajetMurah', '#TechMalaysia', '#GadgetFinds', '#TechTips', '#GajetBerguna'],
    defaultK: ['Senang guna', 'Kemas & praktikal', 'Sesuai untuk kegunaan harian'],
  },
  bayi: {
    label: '👶 Bayi & Kanak-kanak',
    keywords: ['baby', 'bayi', 'anak', 'kids', 'kanak', 'lampin', 'diaper', 'susu', 'botol susu', 'stroller', 'mainan', 'toy', 'toys', 'pacifier', 'puting', 'carrier', 'bib', 'tadika', 'sekolah', 'budak'],
    emoji: ['👶', '🍼', '🧸', '💕', '🎀', '🌈'],
    masalah: [
      'Anak {meragam|merengek} dan susah nak settle?',
      'Mak-mak penat urus barang {baby|anak} yang bersepah?',
      'Susah cari barang {baby|anak-anak} yang selamat dan berbaloi?',
    ],
    hashtags: ['#MakMakShopee', '#BarangBaby', '#ParentingMalaysia', '#IbuBapa', '#AnakAnak'],
    defaultK: ['Memudahkan urusan mak ayah', 'Sesuai untuk kegunaan harian', 'Harga berbaloi'],
  },
  kesihatan: {
    label: '💪 Kesihatan & Sukan',
    keywords: ['vitamin', 'supplement', 'suplemen', 'protein', 'kopi', 'gym', 'yoga', 'dumbbell', 'senaman', 'massage', 'urut', 'kesihatan', 'diet', 'kolagen', 'collagen', 'madu', 'herba', 'jamu', 'basikal', 'running', 'sukan'],
    emoji: ['💪', '🏃‍♀️', '🥗', '🌿', '❤️', '🧘‍♀️'],
    masalah: [
      'Badan selalu penat dan tak bertenaga?',
      'Susah nak konsisten jaga kesihatan?',
      'Sakit badan lepas seharian {kerja|bekerja}?',
    ],
    hashtags: ['#GayaHidupSihat', '#FitnessMalaysia', '#SihatSelalu', '#HealthyLifestyle', '#JagaKesihatan'],
    defaultK: ['Senang masuk dalam rutin harian', 'Sesuai untuk semua peringkat', 'Praktikal & mudah guna'],
  },
  makanan: {
    label: '😋 Makanan & Minuman',
    keywords: ['coklat', 'chocolate', 'kerepek', 'snek', 'snack', 'biskut', 'kuih', 'sambal', 'rendang', 'kopi', 'teh', 'minuman', 'makanan', 'frozen', 'mee', 'maggi', 'sos', 'perencah', 'kek', 'cookies', 'popcorn', 'jajan', 'keropok'],
    emoji: ['😋', '🍫', '🍪', '🔥', '🥤', '🌶️'],
    masalah: [
      'Lapar tengah malam tapi malas nak masak?',
      'Cari {snek|makanan ringan} sedap untuk minum petang?',
      'Bosan makan benda sama hari-hari?',
    ],
    hashtags: ['#MakananViral', '#SnekViral', '#FoodieMalaysia', '#SedapGila', '#JajanViral'],
    defaultK: ['Sedap & senang dimakan', 'Sesuai untuk minum petang', 'Boleh stok kat rumah'],
  },
  lain: {
    label: '🛒 Lain-lain',
    keywords: [],
    emoji: ['🔥', '✨', '🛒', '💯', '👍', '🤩'],
    masalah: [
      'Selalu {rasa nak|cari} barang yang betul-betul berbaloi?',
      'Penat beli barang yang cepat rosak?',
    ],
    hashtags: ['#BarangViral', '#RacunMurah', '#BarangBerguna', '#MustHave'],
    defaultK: ['Senang guna', 'Harga berbaloi', 'Sesuai untuk harian'],
  },
};

// ---------- MUSIM / KEMPEN ----------
export const SEASONS = {
  tiada: { label: 'Tiada', lines: [] },
  '11.11': { label: '11.11', lines: ['{Sempena|Khas untuk} 11.11 ni harga dia {jatuh|turun} {gila|mendadak} 🔥', '11.11 dah {sampai|tiba}! {Masa|Waktu} {terbaik|paling sesuai} nak [beli] 🛒'] },
  '12.12': { label: '12.12', lines: ['{Sempena|Khas untuk} 12.12 — {sale|promosi} {hujung tahun|terakhir tahun ni}! 🎉', '12.12 {sale|promo} {dah start|tengah berjalan}! ⏰'] },
  payday: { label: 'Gaji masuk', lines: ['{Gaji dah masuk|Payday} {ke|ni}? 💸 {Masa|Jom} {belanja diri sendiri|reward diri}!', '{Duit gaji|Gaji} baru masuk, {jangan|tak payah} {tunggu lama|fikir panjang} 😎'] },
  raya: { label: 'Hari Raya', lines: ['{Persiapan|Prep} {Raya|Hari Raya} {dah mula|start sekarang}! 🌙✨', '{Raya|Hari Raya} {makin dekat|dah nak sampai} — {jangan|tak payah} {tunggu last minute|kelam-kabut} 🕌'] },
  ramadan: { label: 'Ramadan', lines: ['{Ramadan|Bulan puasa} {ni|kali ni} {lagi|makin} {senang|mudah} dengan ni 🌙', '{Persiapan|Prep} Ramadan {dah ready|start} belum? 🌙'] },
  sekolah: { label: 'Buka sekolah', lines: ['{Musim|Season} {buka sekolah|back to school} {dah dekat|dah sampai}! 🎒', '{Mak ayah|Parents}, {persiapan|prep} sekolah dah siap? 🎒✏️'] },
  merdeka: { label: 'Merdeka', lines: ['{Sale|Promo} Merdeka! 🇲🇾 {Jom|Mari} [beli] {sebelum habis|sementara ada}'] },
  blackfriday: { label: 'Black Friday', lines: ['Black Friday {sale|deal} {dah start|tengah panas}! 🖤🔥'] },
  hujungtahun: { label: 'Hujung tahun', lines: ['{Sale|Clearance} hujung tahun {dah start|tengah berlangsung}! 🎆'] },
};

// ---------- PLATFORM POSTING ----------
export const PLATFORMS = {
  facebook: { label: 'Facebook', icon: '📘', tags: [3, 5], limit: 0 },
  instagram: { label: 'Instagram', icon: '📸', tags: [6, 10], limit: 2200 },
  tiktok: { label: 'TikTok', icon: '🎵', tags: [4, 6], limit: 2200 },
  threads: { label: 'Threads', icon: '🧵', tags: [0, 1], limit: 500, compact: true },
  x: { label: 'X (Twitter)', icon: '✖️', tags: [1, 2], limit: 280, compact: true },
  whatsapp: { label: 'WhatsApp / Telegram', icon: '💬', tags: [0, 0], limit: 0 },
};

// ---------- SUMBER AFFILIATE ----------
export const SOURCES = {
  shopee: { label: 'Shopee', kedai: 'Shopee', tags: ['#ShopeeMY', '#ShopeeFinds', '#RacunShopee', '#ShopeeHaul', '#ShopeeMalaysia'] },
  tiktok: { label: 'TikTok Shop', kedai: 'TikTok Shop', tags: ['#TikTokShop', '#TikTokMadeMeBuyIt', '#RacunTikTok', '#TikTokShopMY', '#FYP'] },
  lain: { label: 'Lain-lain', kedai: 'online', tags: ['#OnlineShopping', '#BarangViral'] },
};

// ---------- ANGLE / GAYA JUALAN ----------
// Setiap angle ada beberapa template; setiap template penuh dengan spintax.
export const ANGLES = [
  {
    id: 'masalah',
    label: '🩹 Masalah → Penyelesaian',
    templates: [
      `{{masalah}} {😩|😮‍💨|🥲}

{Dulu|Sebelum ni} [aku] pun {sama|macam tu jugak}… sampai [aku] {jumpa|try} {{nama}} ni.

{{senarai}}

{Sekarang|Lepas guna} {memang|terus} {tak pening dah|lega|settle}. {{emoji}}
{Harga|Price} {cuma|hanya|baru} {{harga}} je!`,
      `[Korang] pernah {rasa|alami} {ni|benda ni} tak? 👇
{{masalah}}

{Ni|Inilah} {jawapan dia|solution dia|penyelesaian dia}: {{nama}} {{emoji}}
{{senarai}}

{Sesuai|Paling sesuai|Memang sesuai} untuk {{untuk}}.`,
      `{Stop|Berhenti} {buang duit|pening kepala|stress} {sebab|pasal} {benda ni|hal ni} 🙅‍♀️
{{masalah}}

{{nama}} {settlekan semua|selesaikan masalah ni|jadi penyelamat}. [Serius] [best]. {{emoji}}
{{senarai}}`,
    ],
  },
  {
    id: 'testimoni',
    label: '⭐ Testimoni / Review',
    templates: [
      `{Okay|Jujur|Honest review} — [aku] dah guna {{nama}} {hampir seminggu|dua minggu|sebulan}, {dan ni|so ni} pendapat [aku] 👇

{{senarai}}

{Rating|Markah} [aku]: {⭐⭐⭐⭐⭐ 5/5|10/10|5/5 tanpa ragu}
{Confirm|Memang} {akan|nak} repeat order! {{emoji}}`,
      `{Tak sangka|Tak expect|Langsung tak sangka} {barang|produk} {{harga}} {boleh|mampu} jadi [best] macam ni {😭|🥹|🤯}

{{nama}} — {{k1i}}. {Yang paling|Paling} [aku] suka: {{k2i}}.

{Dah ramai|Ramai} {tanya|DM tanya} [aku] beli kat mana, so [aku] share {sini|kat sini} {ye|tau}. {{emoji}}`,
      `{Review|Update} {jujur|ikhlas} lepas {beli|guna} {{nama}} {{emoji}}

👍 {{k1}}
👍 {{k2}}
👍 {{k3}}
👎 Satu je — [aku] {menyesal|rasa rugi} tak beli {awal-awal|dari dulu}! 😂

{Berbaloi|Worth} {setiap sen|every ringgit}. [Korang] {kena|wajib} try.`,
    ],
  },
  {
    id: 'fomo',
    label: '🔥 FOMO / Stok Terhad',
    templates: [
      `{🚨|⚠️|‼️} {STOK TERHAD|Stok tinggal sikit|Stok nak habis}!
{{nama}} {tengah|sedang} {viral|laku keras|jadi rebutan} {sekarang|minggu ni} 🔥

💸 {Harga promo|Harga sekarang}: {{harga}}
❌ {Harga asal|Sebelum ni}: {{hargaAsalCoret}}

{Bila|Kalau} {promo|stok} habis, harga {naik balik|kembali asal}. {Jangan|Tak payah} tunggu {esok|lain kali} [korang]! ⏰`,
      `{Last call|Peluang terakhir|Jangan tidur lagi} {⏰|🔔|🕛}
{{nama}} {diskaun|turun} {{diskaun}} {untuk masa terhad|selagi promo masih ada}!

{Tadi|Semalam} [aku] {tengok|check} stok {masih banyak|ok lagi}, {sekarang|tadi} dah {tinggal sikit|nak habis} {😱|🥲}
{{senarai}}`,
      `{Siapa|Sesiapa} yang {dah lama|tengah} {usha|survey} {{namaPendek}} — {ni masa dia|now or never|jangan lepaskan}! 🔥
{{senarai}}
{Harga|Price} {{harga}} {je|sahaja} — {tak selalu|jarang} {dapat|jumpa} harga macam ni.`,
    ],
  },
  {
    id: 'harga',
    label: '💸 Fokus Harga / Jimat',
    templates: [
      `{{harga}} {JE|SAHAJA|je ni}?! {🤯|😱|💸}
{Dapat|Boleh dapat} {{nama}} — {{k1i}}.

{Harga asal|Biasa} {{hargaAsal}}, {sekarang|kat sini} [korang] jimat {{jimat}}! {{emoji}}`,
      `{Bajet|Duit} {tight|ketat|tengah sesak} tapi nak {barang|benda} [best]? 🤏
{{nama}} {cuma|hanya} {{harga}} {{emoji}}
{Diskaun|Potongan} {{diskaun}} — {jimat|save} {{jimat}}!
{Murah|Mampu milik} tapi {kualiti|quality} {tak main-main|tetap padu|memang power}.`,
      `{Duit|Duit} {{harga}} {boleh buat apa|korang guna untuk apa} {je|}? 🤔
{Mungkin|Biasanya} {dua cawan kopi|sekali makan luar|sekali isi minyak} {je|}…
{ATAU|Atau} [korang] {boleh dapat|bawa balik} {{nama}} ni! {{emoji}}
{{senarai}}`,
    ],
  },
  {
    id: 'senarai',
    label: '📋 Senarai / Listicle',
    templates: [
      `{{bilKelebihan}} {sebab|alasan} [korang] {WAJIB|kena|perlu} ada {{namaPendek}} 👇

{{senaraiNombor}}

{Bonus|Bonus point}: harga {cuma|baru} {{harga}}! {{emoji}}`,
      `{Barang|Benda} yang [aku] {tak sangka|tak expect} [aku] perlukan, {sampai|sehingga} [aku] {beli|cuba}: {{nama}} {{emoji}}

{{senaraiNombor}}

{Simpan|Save} post ni {kalau|kalau-kalau} nak beli nanti 📌`,
      `{{namaPendek}} {dalam|in} {{bilKelebihan}} {perkara|point} ⏱️
{{senaraiNombor}}
{Harga|Harga dia}: {{harga}} ✅`,
    ],
  },
  {
    id: 'soalan',
    label: '❓ Soalan / Engagement',
    templates: [
      `{Soalan|Nak tanya} {jujur|sikit}… [korang] {team|kem} mana? 🤔
A) {Beli murah, cepat rosak|Tahan je masalah tu}
B) {Beli sekali, guna lama|Terus settle dengan {{namaPendek}}}

[Aku] {confirm|memang} B! {{emoji}} {Komen|Drop} jawapan [korang] {kat bawah|👇}`,
      `{Ada tak|Siapa} yang {belum|tak} {tahu|jumpa} {{namaPendek}} ni? 🙋‍♀️
{{k1}} — [serius] [best]!
{{senarai}}
{Tag|Tag} {kawan|member|bestie} yang {perlu|patut} tahu {benda ni|pasal ni} 👇`,
      `{Kalau|Andai} [korang] ada RM{{hargaNombor}} {sekarang|harini}, {nak beli apa|nak spend apa}? 💭
{Untuk|Kalau} [aku], {{nama}} {dah confirm|memang} {masuk troli|dalam cart} 🛒
{{senarai}}`,
    ],
  },
  {
    id: 'cerita',
    label: '📖 Cerita / Storytelling',
    templates: [
      `{Semalam|Minggu lepas|Hari tu} {kawan|adik|mak|housemate} [aku] {tanya|tegur}, "{Eh|Weh}, {apa tu|benda apa tu}? {Nampak|Macam} [best]!" {👀|😳}

[Aku] {tunjuk|kenalkan} {{nama}} — {terus|lepas tu terus} dia {order|checkout} {satu|sebiji} {jugak|} 😂

{{senarai}}`,
      `{Cerita|Story} {sikit|pendek} {☕|📖}
{Dulu|Sebelum ni} [aku] {skeptikal|ragu-ragu|tak percaya} {dengan|pasal} {{namaPendek}} ni. {Tapi|But} {sebab|bila} harga {{harga}} je, [aku] {try lah|cuba lah}.

{Sekarang|Hasilnya}? {{k1}}. {{emoji}}
{Memang|Confirm} {tak menyesal|berbaloi|worth it}.`,
      `{POV|Situasi}: [korang] {baru|akhirnya} {beli|dapat} {{nama}} {dan|lepas tu} {terus guna hari-hari|tak boleh hidup tanpa dia|jatuh cinta} {😂|🥹|💯}
{{senarai}}`,
    ],
  },
  {
    id: 'banding',
    label: '⚖️ Perbandingan / Before-After',
    templates: [
      `{Sebelum vs Selepas|Before vs After} 👇
❌ {Sebelum|Before}: {leceh & buang masa|stress, serabut|membazir duit}
✅ {Selepas|After}: {{k1}}
✅ {Bonus|Plus}: {{k2}}

Semua {sebab|kerana} {{nama}} {{emoji}}`,
      `{Beli|Ambil} {yang mahal|brand mahal} {ratus-ratus|RM100++}? 🤔
{ATAU|Atau} {{nama}} {cuma|hanya} {{harga}}, {yang dah cukup|yang memang} [best] untuk {kegunaan harian|pakai hari-hari}?
{{senarai}}
[Aku] {pilih|choose} {yang kedua|option kedua} {la|lah} {😎|💅}`,
      `{Harga asal|Biasa} vs {Harga promo|Sekarang} {💸|🛍️}
🏷️ {Harga asal|Sebelum}: {{hargaAsalCoret}}
🔥 {{kedai}}: {{harga}} — jimat {{jimat}}!
{{nama}} {{emoji}}
{{senarai}}`,
    ],
  },
  {
    id: 'hadiah',
    label: '🎁 Idea Hadiah',
    templates: [
      `{Idea|Cadangan} {hadiah|gift} {untuk|buat} {{untuk}}? 🎁
{{nama}} — {{k1i}}. {Confirm|Mesti} dia {suka|happy|terharu} {🥹|💕}
Harga {{harga}} {je|sahaja} — {tak pokai|jimat poket}!`,
      `{Hadiah|Gift} {bawah|under} {{hargaBulat}}? ✅
{Nampak|Rasa} {mahal|exclusive}, {tapi|but} {bajet|harga} {mesra poket|friendly} 💝
{{nama}}
{{senarai}}`,
      `{Birthday|Anniversary|Hari jadi} {dah dekat|nak sampai}? {Jangan|Tak payah} {pening|fikir lama} 🎀
{{nama}} {boleh jadi|memang} {hadiah|gift} {paling|yang} {praktikal|berguna|disayangi}. {{emoji}}
{{senarai}}`,
    ],
  },
  {
    id: 'lawak',
    label: '😂 Lawak / Relatable',
    noFormal: true,
    templates: [
      `[Aku]: {Bulan ni|Minggu ni} {nak|kena} {jimat|save duit} 💪
{Juga|Also} [aku]: {{nama}} {masuk troli|dah checkout} {😭|🤡|🙈}

{Tapi|Dah la} harga {{harga}} je… {siapa boleh tahan|tak dapat tahan} {😂|🤣}
{{senarai}}`,
      `{Duit|Dompet}: {tolonglah|please} {berhenti|stop} 🥲
{{kedai}}: {Nah|Ini} {{nama}} {{emoji}}
[Aku]: {Okay|Baiklah} {fine|lah} 🛒`,
      `{Plot twist|Fakta}: {{nama}} ni {lagi|lebih} {setia|reliable} dari {ex|crush} [aku] {😂|💀}
{{k1}}. {{k2}}.
{Dan|Plus} harga {{harga}} je. {Okay|So} siapa {nak|mahu} {join|ikut} [aku] [beli]? 🙋‍♀️`,
    ],
  },
];

// ---------- CTA (letak link) ----------
export const CTA = {
  link: {
    default: [
      '👉 {Link|Link beli|Order sini}: {{link}}',
      '🛒 {Grab|Dapatkan|Sambar} {sini|kat sini}: {{link}}',
      '{🔗|👇} {Klik|Tekan} {link ni|sini} {untuk beli|untuk tengok}: {{link}}',
      '{Nak|Berminat}? {Terus|Klik} {ke sini|sini} 👉 {{link}}',
    ],
    formal: ['Dapatkan di sini: {{link}}', 'Tempah sekarang melalui pautan ini: {{link}}', '🔗 Pautan pembelian: {{link}}'],
    urgent: ['⏰ {Cepat|Sebelum habis}: {{link}}', '🚨 {Grab sekarang|Checkout sekarang} 👉 {{link}}', '‼️ {Link|Order} {sebelum stok habis|sebelum promo tamat}: {{link}}'],
  },
  // TikTok: link dalam caption tak boleh diklik
  tiktok: {
    tiktok: ['🛒 {Tekan|Klik} {beg kuning|keranjang kuning} {kat bawah|di video ni} {ye|tau}!', '{Link|Produk} ada {kat|dalam} beg kuning 🛒 {terus|jom} [beli]!', '🛒 Beg kuning {ye|tau} [korang]!'],
    shopee: ['🔗 Link {kat bio|di bio} {ye|tau}!', '{Komen|Drop} "{NAK|LINK}" — [aku] DM link 📩', '🔗 [Korang], link Shopee {ada|dah letak} {kat bio|di bio} {ye|tau}!'],
  },
  instagram: [
    '🔗 Link {kat bio|di bio|dalam story} {ye|tau}!',
    '{Komen|Drop} "{NAK|LINK|MAHU}" {dan|nanti} [aku] DM link 📩',
    '📲 Link {ada kat|di} bio — {terus|jom} [beli]!',
  ],
};

// ---------- AJAKAN ENGAGEMENT ----------
export const ENGAGE = [
  '{Komen|Drop} "{NAK|🙋‍♀️|MAHU}" kalau {berminat|nak link|nak juga}!',
  '{Tag|Tag} {kawan|bestie|member} yang {perlu|patut} {tengok|tahu} ni 👇',
  '{Save|Simpan} {dulu|post ni} {nanti|takut} {lupa|hilang} 📌',
  '{Share|Kongsi} {kalau rasa berguna|untuk kawan-kawan} 🔁',
  '{Like|Tekan ❤️} kalau [korang] {pun nak|setuju}!',
];

export const DISCLOSURE = [
  '(Link affiliate — saya mungkin dapat komisen kecil tanpa kos tambahan untuk anda 🙏)',
  '#affiliate — terima kasih support! 🙏',
];

// ---------- POSTER ----------
export const POSTER_HOOKS = [
  'RACUN HARI INI 🔥', 'MURAH GILA!', 'VIRAL SEKARANG', 'STOK TERHAD!', 'WAJIB ADA ✨',
  'JIMAT GILA 💸', 'BEST SELLER', 'HARGA JATUH!', 'JANGAN TERLEPAS', 'TOP PICK 💯',
  'BARU SAMPAI', 'REVIEW JUJUR ⭐', 'MUST HAVE', 'PROMO HEBAT', 'SALE!',
];

// ---------- PLANNER ----------
// Waktu popular untuk post di Malaysia (anggaran umum, boleh ubah sendiri).
export const PLAN_SLOTS = [
  { time: '8:30 pagi', note: 'Orang scroll sebelum kerja' },
  { time: '12:30 tengah hari', note: 'Waktu rehat makan' },
  { time: '5:30 petang', note: 'Balik kerja / dalam perjalanan' },
  { time: '8:30 malam', note: 'Waktu santai — paling ramai online' },
  { time: '9:30 malam', note: 'Lepas makan malam' },
  { time: '10:30 malam', note: 'Scroll sebelum tidur' },
];

export const DAYS_MS = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
