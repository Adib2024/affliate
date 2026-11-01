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
      'Pakai baju yang sama {berulang kali|hari-hari} sampai {rasa bosan|kawan perasan}?',
      'Beli online, sampai rumah {tak sama macam gambar|tak muat}? 😩',
    ],
    hasil: ['Keluar rumah terus rasa yakin & cantik ✨', 'Orang mula tanya "beli kat mana?" 😍', 'Siap cepat pagi-pagi, tak pening fikir nak pakai apa', 'Gambar OOTD terus {naik|cantik} — tak payah edit banyak 📸', 'Satu {pieces|helai}, boleh {mix & match|gayakan} banyak cara'],
    khas: ['Padankan dengan {jeans|seluar slack|baju kurung|blazer} pun {cantik|masuk}', 'Sesuai untuk {kerja|kuliah|jalan-jalan|kenduri}', '{Gayakan|Pakai} untuk {raya|majlis|weekend} — {terus menyerlah|nampak mahal}', 'Warna {neutral|lembut} senang {padan|match} dengan {apa-apa|semua} outfit'],
    hashtags: ['#OOTDMalaysia', '#FesyenMurah', '#FesyenWanita', '#OutfitIdea', '#BajuMurah'],
    defaultK: ['Nampak kemas & bergaya', 'Sesuai untuk pakai harian', 'Harga berbaloi'],
  },
  kecantikan: {
    label: '💄 Kecantikan',
    keywords: ['serum', 'vitamin c', 'brightening', 'whitening', 'niacinamide', 'glow', 'krim', 'cream', 'lipstik', 'lipstick', 'lip', 'makeup', 'bedak', 'foundation', 'cushion', 'skincare', 'toner', 'cleanser', 'sunscreen', 'sunblock', 'mask', 'perfume', 'minyak wangi', 'mascara', 'eyeliner', 'blusher', 'pencuci muka', 'facial', 'lotion', 'body wash', 'shampoo', 'syampu', 'rambut', 'kuku', 'nail'],
    emoji: ['💄', '💅', '✨', '🌸', '🧴', '💖', '🪞'],
    masalah: [
      'Muka {kusam|nampak penat} dan tak bermaya?',
      'Makeup cepat cair bila {panas|cuaca panas}?',
      'Kulit kering tak kira berapa banyak pakai pelembap?',
      'Dah habis duit beli {macam-macam|banyak} produk tapi {tak nampak hasil|kulit sama je}?',
      'Malu nak {selfie|keluar} tanpa {makeup|filter}?',
    ],
    hasil: ['Muka nampak segar walaupun tak tidur cukup ✨', 'Yakin selfie tanpa filter 🤳', 'Rutin cantik jadi ringkas & tak membazir', 'Rutin {pagi|malam} jadi {laju|simple} — {3 langkah|beberapa minit} je', 'Rasa lebih yakin {berdepan orang|nak keluar rumah} 💖'],
    khas: ['{Senang masuk|Boleh masuk} dalam rutin {pagi|malam} [korang]', 'Saiz {ngam|sesuai} untuk {bawa dalam beg|travel}', '{Tip|Tips}: {konsisten|guna setiap hari} untuk {hasil terbaik|nampak beza}', 'Buat {patch test|test sikit} dulu {kalau kulit sensitif|untuk kulit sensitif} ya'],
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
      'Barang dapur {bersepah|tak tersusun} sampai {susah nak masak|malas nak masuk dapur}?',
      '{Hujung minggu|Cuti} habis {kemas rumah|buat kerja rumah} je?',
    ],
    hasil: ['Rumah nampak kemas, hati pun tenang 🏡', 'Kerja rumah siap cepat, ada masa rehat ☕', 'Tetamu datang pun tak malu', '{Dapur|Rumah} nampak macam {dalam Pinterest|rumah contoh} ✨', 'Jimat masa — lebih banyak {rehat|masa dengan family} 🛋️'],
    khas: ['Sesuai untuk {rumah sewa|condo|rumah teres|apartment}', '{Mak-mak|Suri rumah|Orang bujang} {mesti suka|confirm suka}', '{Senang|Mudah} {dipasang|digunakan} — tak perlu {tukang|panggil orang}', 'Cantik {letak|diletak} kat {dapur|ruang tamu|bilik}'],
    hashtags: ['#RumahKemas', '#BarangDapur', '#HomeDecorMalaysia', '#IdeaRumah', '#DapurCantik'],
    defaultK: ['Jimat masa & tenaga', 'Senang dibersihkan', 'Rumah nampak lebih kemas'],
  },
  kerja: {
    label: '💼 Meja & Pejabat',
    keywords: ['desk', 'meja', 'cable management', 'cable tray', 'under desk', 'office', 'pejabat', 'monitor stand', 'laptop stand', 'kerusi', 'chair', 'stationery', 'alat tulis', 'workstation', 'wfh', 'organizer meja'],
    emoji: ['💼', '🖥️', '✨', '🧹', '📐', '🗂️'],
    masalah: [
      'Bawah meja {berselirat|bersepah} dengan wayar & extension? 😩',
      'Meja kerja {bersepah|serabut} sampai {mood kerja hilang|tak fokus nak buat kerja}?',
      'Kaki {asyik tersepak|selalu tersangkut} wayar bawah meja?',
      '{WFH|Kerja dari rumah} tapi {setup|meja} {tak selesa|serabut}?',
      '{Video call|Zoom meeting} tapi {belakang|meja} [korang] {bersepah|tak kemas}? 😅',
    ],
    hasil: ['Meja kerja kemas — mood & fokus terus naik 🧠', 'Setup meja nampak macam {Pinterest|setup influencer} ✨', 'Tak malu lagi bila video call atau kawan datang', '{Produktiviti|Fokus} naik — kerja siap {lebih cepat|awal} ⚡', 'Setiap kali duduk depan meja terus {rasa semangat|mood kerja} 💪'],
    khas: ['Sesuai untuk {WFH|pejabat|meja belajar|setup gaming}', '{Pelajar|Freelancer|Orang office} {mesti ada|wajib ada}', 'Pasang {sekali|5 minit} je, {kemas|tersusun} {selamanya|terus}', '{Setup|Meja} [korang] terus {naik level|nampak pro} 🖥️'],
    hashtags: ['#DeskSetup', '#WFHMalaysia', '#MejaKemas', '#SetupMeja', '#WorkspaceGoals'],
    defaultK: ['Meja nampak lebih kemas & teratur', 'Senang dipasang', 'Sesuai untuk rumah & pejabat'],
  },
  gajet: {
    label: '📱 Gajet',
    keywords: ['phone', 'telefon', 'charger', 'cable', 'kabel', 'earphone', 'earbuds', 'headphone', 'powerbank', 'power bank', 'speaker', 'smartwatch', 'casing', 'case', 'tripod', 'ring light', 'mouse', 'keyboard', 'laptop', 'tablet', 'ipad', 'usb', 'bluetooth', 'wireless', 'kamera', 'camera', 'mic', 'router', 'led'],
    emoji: ['📱', '🎧', '🔌', '⚡', '💻', '🔋', '🎮'],
    masalah: [
      'Bateri phone selalu habis {time penting|masa paling perlu}?',
      'Wayar {berselirat|bersimpul} dan selalu rosak?',
      'Gajet lama dah lembap dan buat stress?',
      '{Charger|Kabel} rosak {berulang kali|tak sampai sebulan}?',
      'Nak {gajet|aksesori} bagus tapi {tak nak bayar mahal|bajet terhad}?',
    ],
    hasil: ['Hidup harian jadi lebih mudah & lancar ⚡', 'Tak stress lagi bila gajet buat hal', 'Kerja & hiburan jadi lebih syok 🎧', '{Gajet|Phone} sentiasa {ready|bersedia} bila perlu 🔋', '{Setup|Kerja} jadi {kemas|lancar} tanpa {serabut|gangguan}'],
    khas: ['{Serasi|Boleh guna} dengan {kebanyakan|banyak} {phone|peranti}', 'Sesuai untuk {pelajar|orang kerja|gamer|content creator}', '{Bawa|Simpan} dalam beg pun {tak berat|senang}', '{Hadiah|Gift} {terbaik|praktikal} untuk {kaki gajet|abang|suami}'],
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
      '{Tidur|Rehat} tak cukup sebab {urus anak|anak meragam} {malam-malam|tengah malam}? 😴',
      'Keluar rumah dengan anak {macam pindah rumah|bawa barang banyak}?',
    ],
    hasil: ['Anak selesa, mak ayah pun lega 🥹', 'Urusan anak jadi lebih cepat & teratur', 'Lebih banyak masa berkualiti dengan si kecil 💕', 'Lebih {tenang|relax} — anak happy, mak ayah happy 🥰', 'Keluar jalan dengan anak jadi {lebih senang|tak serabut}'],
    khas: ['{Sesuai|Ngam} untuk {newborn|baby|anak kecil} {sampai|hingga} {toddler|besar sikit}', '{Hadiah|Gift} {cukup bulan|baby shower|lawat bersalin} yang {berguna|praktikal}', '{Mak-mak|Ibu} {first time|baru} {mesti ada|wajib ada}', '{Senang|Mudah} {dicuci|dibersihkan} — {jimat masa|tak leceh}'],
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
      '{Niat|Azam} nak {sihat|bersenam} tapi {selalu tak jadi|asyik tangguh}?',
      '{Pinggang|Belakang|Leher} {lenguh|sakit} lepas {duduk lama|kerja}?',
    ],
    hasil: ['Badan rasa lebih bertenaga setiap hari 💪', 'Konsisten jaga diri tanpa rasa terbeban', 'Lega lepas penat seharian', '{Rutin sihat|Jaga diri} jadi {senang|seronok} — {tak rasa terpaksa|tak terbeban}', 'Bangun pagi rasa {segar|bertenaga} ☀️'],
    khas: ['Sesuai untuk {semua peringkat umur|mak ayah|orang bekerja}', '{Boleh guna|Senang guna} {di rumah|bila-bila masa} — tak perlu {gym|keluar}', '{Hadiah|Gift} {terbaik|berguna} untuk {mak ayah|orang tersayang}', '{Ingat|Tip}: {konsisten|sikit-sikit tiap hari} lagi {berkesan|penting}'],
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
      '{Craving|Mengidam} {benda manis|benda pedas|snek} tapi {malas keluar|kedai jauh}?',
      '{Tetamu|Kawan} datang {mengejut|tiba-tiba}, takde {benda nak hidang|jamuan}?',
    ],
    hasil: ['Minum petang terus jadi lebih syok ☕', 'Lapar tengah malam? Settle 😋', 'Semua orang dalam rumah berebut nak rasa', 'Sekali rasa — {confirm|mesti} {order lagi|repeat} 😋', '{Stok|Simpan} kat rumah, {bila-bila masa|tiap kali} {craving|lapar} terus {settle|ada}'],
    khas: ['Paling sedap {makan masa tengok movie|cicah dengan teh O|time hujan|masa minum petang}', '{Sesuai|Ngam} untuk {jamuan|majlis|potluck|bekal sekolah}', '{Simpan|Letak} dalam {kereta|beg|laci office} — {lapar|craving} terus {ada|settle}', '{Satu|Sebungkus} {tak cukup|takkan cukup} — {beli|ambil} {lebih|dua}'],
    hashtags: ['#MakananViral', '#SnekViral', '#FoodieMalaysia', '#SedapGila', '#JajanViral'],
    defaultK: ['Sedap & senang dimakan', 'Sesuai untuk minum petang', 'Boleh stok kat rumah'],
  },
  kereta: {
    label: '🚗 Kereta & Motor',
    keywords: ['kereta', 'car', 'motor', 'motorsikal', 'dashcam', 'car mount', 'car holder', 'seat cover', 'sarung kusyen', 'wiper', 'tayar', 'tire', 'helmet', 'topi keledar', 'air freshener', 'pewangi kereta', 'car charger', 'car vacuum', 'polish', 'wax'],
    emoji: ['🚗', '🛵', '✨', '🔧', '🛣️', '😎'],
    masalah: [
      'Dalam kereta {bersepah|bau tak best} {sampai malu nak tumpangkan orang|bila ada kawan naik}?',
      '{Phone|GPS} {jatuh|tergolek} masa {memandu|drive}? 😬',
      'Kereta nampak {kusam|lama} walaupun baru {basuh|cuci}?',
    ],
    hasil: ['Kereta {kemas|wangi} — {drive|memandu} pun {tenang|lagi syok} 😎', '{Tumpangkan|Bawa} kawan pun {tak malu|bangga}', '{Perjalanan|Drive} jauh jadi lebih {selesa|selamat} 🛣️'],
    khas: ['Sesuai untuk {semua jenis|kebanyakan} {kereta|model}', '{Hadiah|Gift} {terbaik|berguna} untuk {kaki drive|suami|ayah}', '{Pasang|Guna} {sendiri|DIY} — {tak perlu|tak payah} {ke bengkel|bayar upah}', 'Wajib ada untuk {balik kampung|road trip|drive jauh}'],
    hashtags: ['#KeretaMalaysia', '#AksesoriKereta', '#CarLifeMY', '#DriveSafe', '#OtomotifMY'],
    defaultK: ['Senang dipasang sendiri', 'Praktikal untuk perjalanan harian', 'Harga berbaloi'],
  },
  haiwan: {
    label: '🐱 Haiwan Peliharaan',
    keywords: ['kucing', 'cat', 'anjing', 'dog', 'pet', 'cat litter', 'pasir kucing', 'makanan kucing', 'cat food', 'cat toy', 'mainan kucing', 'scratcher', 'kandang', 'cage', 'arnab', 'rabbit', 'ikan', 'aquarium', 'akuarium', 'burung'],
    emoji: ['🐱', '🐾', '😻', '🐶', '💕', '🧶'],
    masalah: [
      '{Bulu|Pasir} kucing {bersepah|merata} {satu rumah|kat lantai}? 😩',
      'Kucing {bosan|asyik cakar sofa} {sebab|kerana} takde {mainan|benda nak main}?',
      '{Bau|Tandas} kucing {kuat|tak best} sampai {tetamu perasan|satu rumah bau}?',
    ],
    hasil: ['{Anabul|Kucing} happy, {hooman|tuan} pun happy 😻', 'Rumah {bersih|wangi} walaupun bela {ramai|banyak} kucing 🐾', '{Anabul|Bulus} [korang] terus {aktif|manja} 🥰'],
    khas: ['{Cat lovers|Pencinta kucing|Hamba kucing} {wajib ada|mesti ada}', 'Sesuai untuk {anak kucing|kitten} {sampai|hingga} {dewasa|besar}', '{Hadiah|Gift} untuk {kawan|bestie} yang {gila kucing|bela kucing} 🐱', '{Tengok la|Cuba tengok} {reaksi|muka} {anabul|kucing} [korang] bila {dapat|nampak} 😂'],
    hashtags: ['#KucingMalaysia', '#CatLoversMY', '#Anabul', '#HambaKucing', '#PetMalaysia'],
    defaultK: ['Haiwan kesayangan lebih selesa', 'Senang digunakan', 'Sesuai untuk kegunaan harian'],
  },
  lain: {
    label: '🛒 Lain-lain',
    keywords: [],
    emoji: ['🔥', '✨', '🛒', '💯', '👍', '🤩'],
    masalah: [
      'Selalu {rasa nak|cari} barang yang betul-betul berbaloi?',
      'Penat beli barang yang cepat rosak?',
      '{Beli|Cari} barang {berulang kali|banyak kali} sebab {cepat rosak|tak tahan}?',
    ],
    hasil: ['Hidup harian jadi lebih mudah', 'Tak menyesal langsung beli', 'Duit berbaloi, guna pun puas hati', 'Rasa {puas hati|berbaloi} setiap kali guna 👍'],
    khas: ['Sesuai untuk {kegunaan harian|diri sendiri|hadiah}', '{Simpan|Save} post ni {untuk rujukan|kalau nak beli nanti} 📌', '{Kualiti|Barang} {okay|elok} untuk harga {macam ni|ni}'],
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
  threads: { label: 'Threads', icon: '🧵', tags: [0, 1], limit: 500 },
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
// Struktur setiap template: HOOK → rasa sakit / situasi → penyelesaian → hasil → bukti/desakan → harga.
// {{masalah}} & {{hasil}} datang dari kategori; {{senarai}} dari kelebihan (atau keyword nama produk).
export const ANGLES = [
  {
    id: 'masalah',
    label: '🩹 Masalah → Penyelesaian',
    templates: [
      `{{masalah}}

[Aku] {pun pernah lalu benda yang sama|faham sangat perasaan tu}. {Dah cuba macam-macam cara|Dah try banyak benda}, {tapi tak jalan|last-last balik macam asal} {🥲|😮‍💨}

{Sampailah|Sehinggalah} [aku] {jumpa|try} {{nama}} ni 👇
{{senarai}}

{Hasilnya|Sekarang}? {{hasil}}

Harga {cuma|hanya} {{harga}} — {lagi murah dari|tak sampai harga} {sekali makan luar|dua cawan kopi ais} {😅|☕}`,
      `{Jujur|Serius} [aku] {tanya|nak tanya} — [korang] {masih|still} {tahan|hadap} benda ni? 👇
{{masalah}}

{Tak payah|Jangan} {stress|pening} lagi. {Ada cara mudah|Solution dia simple je}: {{nama}} {{emoji}}

✨ {Kenapa|Sebab apa} [aku] {suka|recommend}:
{{senarai}}

{{hasil}}
{Semua ni|Semua} dengan {{harga}} {je|sahaja}. {Diskaun|Turun} {{diskaun}} dari harga asal!`,
      `{STOP|Berhenti} {hadap|tahan} masalah ni {🙅‍♀️|✋}
{{masalah}}

{Benda kecil|Masalah kecil} {macam ni|camni} {lama-lama|kalau dibiar} {buat hilang mood|makan masa & tenaga} [korang] {hari-hari|setiap hari}.

{{nama}} {settlekan semua|selesaikan semua ni|jadi penyelamat [aku]} 👇
{{senarai}}

{Bayangkan|Cuba bayangkan}: {{hasil}}
{Harga|Price}: {{harga}} {je|sahaja} {{emoji}}`,
    ],
  },
  {
    id: 'testimoni',
    label: '⭐ Testimoni / Review',
    templates: [
      `{Review jujur|Honest review} {lepas|selepas} {seminggu|dua minggu|sebulan} guna {{nama}} {👇|📝}

{Mula-mula|Awalnya} [aku] {ragu-ragu|tak yakin} {sebab|sebab tengok} harga {{harga}} je… {takut|risau} {kualiti teruk|tak berbaloi}.

{Rupanya|Tapi rupanya}:
{{senarai}}

{{hasil}}

{Rating|Markah} [aku]: {⭐⭐⭐⭐⭐|10/10|5/5}
{Confirm|Memang} {akan|nak} {repeat order|beli lagi} {untuk family|untuk hadiah}! {{emoji}}`,
      `{Ni antara|Ni la} {barang|benda} {paling berbaloi|terbaik} [aku] beli {tahun ni|bulan ni} {😭|🥹|🤯}

{{nama}} — {{k1i}}.
{Yang paling [aku] suka|Paling best}: {{k2i}}.

{Sebelum ni|Dulu}: {{masalahP}}
{Sekarang|Lepas guna}: {{hasil}}

{Dah ramai|Ramai} {tanya|DM tanya} [aku] beli {kat mana|dekat mana}, so [aku] share {kat sini|sini} {ye|tau} {👇|💕}`,
      `{Update|Review} {jujur|ikhlas}: {{nama}} {{emoji}}

👍 {{k1}}
👍 {{k2}}
👍 {{k3}}
👍 Harga {cuma|hanya} {{harga}}
👎 Satu je — [aku] {menyesal|rasa rugi} tak beli {awal-awal|dari dulu} 😂

{Kalau|Untuk} [korang] yang {tengah survey|masih fikir-fikir}: {{hasil}}
{Berbaloi|Worth} {setiap sen|every ringgit}. [Serius].`,
    ],
  },
  {
    id: 'fomo',
    label: '🔥 FOMO / Stok Terhad',
    templates: [
      `{🚨|⚠️|‼️} {HARGA PROMO|Harga jatuh|Promo} — {tak tahu sampai bila|boleh tamat bila-bila masa}!

{{nama}} {tengah|sedang} {laku keras|jadi rebutan|viral} {sekarang|minggu ni} 🔥
{{senarai}}

💸 {Harga promo|Sekarang}: {{harga}}
❌ {Harga asal|Biasa}: {{hargaAsalCoret}}
💰 {Jimat|Save} {{jimat}} ({{diskaun}})

{Bila|Kalau} promo habis, harga {naik balik|kembali asal}. {Jangan|Tak payah} tunggu {esok|lain kali} [korang]! ⏰`,
      `{Last call|Peluang terakhir|Jangan scroll dulu} {⏰|🔔}
{{nama}} {diskaun|turun} {{diskaun}} — {masa terhad je|selagi promo masih ada}!

{Tadi|Semalam} [aku] {tengok|check} stok {masih banyak|ok lagi}, {sekarang|tadi} dah {makin kurang|nak habis} {😱|🥲}

{Kenapa|Sebab apa} {orang berebut|ramai beli}:
{{senarai}}

{{hasil}}
{Harga|Sekarang} {{harga}} je. {Jangan|Tak payah} {menyesal kemudian|tunggu harga naik} 🙏`,
      `{Siapa|Sesiapa} yang {dah lama|tengah} {usha|survey|simpan dalam cart} {{namaPendek}} — {ni masa dia|now or never|jangan lepaskan}! 🔥

{{senarai}}

{Harga|Price} {{harga}} {je|sahaja} — {tak selalu|jarang} {dapat|jumpa} harga {macam ni|serendah ni}.
{Checkout|Grab} {sekarang|harini}, {esok-esok|nanti} [korang] {terima kasih kat diri sendiri|bersyukur} 😉`,
    ],
  },
  {
    id: 'harga',
    label: '💸 Fokus Harga / Jimat',
    templates: [
      `{{harga}} {JE|SAHAJA|je ni}?! {🤯|😱|💸}

{Untuk|Dapat} {{nama}} yang:
{{senarai}}

{Harga asal|Biasa} {{hargaAsal}} — {sekarang|kat sini} [korang] {jimat|save} {{jimat}}! {{emoji}}
{Murah|Mampu milik}, tapi {kualiti|quality} {tak main-main|tetap padu}.`,
      `{Bajet|Duit} {tight|ketat|tengah sesak} tapi nak {{hasilI}}? 🤏

{Jawapannya|Ni jawapannya}: {{nama}} {{emoji}}
{Cuma|Hanya} {{harga}}!
{Diskaun|Potongan} {{diskaun}} {dari harga asal|— jimat {{jimat}}} 🔥

{{senarai}}

{Tak perlu|Tak payah} {keluar duit banyak|beli yang mahal-mahal} untuk {dapat hasil|rasa beza}. {Ni la|Inilah} {barang|benda} {paling berbaloi|best value} {bulan ni|minggu ni}.`,
      `{Duit|RM} {{hargaNombor}} {biasanya|selalunya} [korang] {guna untuk apa|habis kat mana}? 🤔
{Dua cawan kopi|Sekali makan luar|Sekali isi minyak} {je|} kan…

{ATAU|Atau} [korang] {boleh dapat|bawa balik} {{nama}}:
{{senarai}}

{Kesan dia|Hasilnya} {lama|berpanjangan}: {{hasilI}} {{emoji}}`,
    ],
  },
  {
    id: 'senarai',
    label: '📋 Senarai / Listicle',
    templates: [
      `{{bilKelebihan}} {sebab|alasan} [korang] {WAJIB|kena|perlu} ada {{namaPendek}} 👇

{{senaraiNombor}}

{Bonus|Plus}: harga {cuma|baru} {{harga}}! {{emoji}}
{Simpan|Save} post ni {sebelum|takut} {lupa|hilang} 📌`,
      `{Barang|Benda} yang [aku] {tak sangka|tak expect} [aku] {perlukan|perlu sangat}, {sampai|sehinggalah} [aku] {beli|cuba}: {{nama}} {{emoji}}

{Apa yang [aku] dapat|Apa yang berubah}:
{{senaraiNombor}}

{Paling best|Yang paling terasa}: {{hasil}}
Harga {{harga}} {je|sahaja}.`,
      `{Checklist|Senarai semak} {sebelum|kalau nak} beli {{namaPendek}} ✅

{{senaraiNombor}}
✔️ Harga {mampu milik|berpatutan}: {{harga}}

{Semua|Kesemua} {tick|cukup}? {Jom|So} [beli] {sebelum harga naik|sementara promo} {😉|🛒}`,
    ],
  },
  {
    id: 'soalan',
    label: '❓ Soalan / Engagement',
    noHook: true,
    templates: [
      `{Soalan|Nak tanya} {jujur|sikit}… [korang] {team|kem} mana? 🤔

A) {Tahan je masalah tu, malas nak ubah|Biar je, nanti-nanti la settle}
B) {Settle sekali, terus selesa|Terus settle dengan {{namaPendek}}}

[Aku] {confirm|memang} B! {Sebab|Kerana}:
{{senarai}}

{Komen|Drop} {A atau B|jawapan [korang]} {kat bawah|👇}`,
      `{Ada tak|Siapa} {lagi|} yang {belum|tak} {tahu|jumpa} {{namaPendek}} ni? 🙋‍♀️

{Kalau|Kalau [korang]} {selalu rasa|pernah rasa}: {{masalahP}}
{Benda ni|Ni} {memang|confirm} untuk [korang].

{{senarai}}

{Tag|Tag} {kawan|member|bestie} yang {perlu|patut} tahu {benda ni|pasal ni} 👇`,
      `{Kalau|Andai} [korang] ada {{harga}} {sekarang|harini}, {nak beli apa|nak spend apa}? 💭

{Untuk|Kalau} [aku], {{nama}} {dah confirm|memang} {masuk troli|dalam cart} 🛒
{Sebab|Kerana} {{hasilI}} {{emoji}}

{{senarai}}

{Korang|[Korang]} {pula|pulak}? {Komen|Drop} kat bawah 👇`,
    ],
  },
  {
    id: 'cerita',
    label: '📖 Cerita / Storytelling',
    templates: [
      `{Semalam|Minggu lepas|Hari tu} {kawan|adik|mak|housemate} [aku] {datang rumah|singgah}, terus {tegur|tanya}: "{Eh|Weh}, {sejak bila kemas macam ni|apa yang lain ni}? {Nampak|Macam} [best]!" {👀|😳}

[Aku] {tunjuk|kenalkan} {{nama}}.
{Lepas tu|Terus} dia {order|checkout} {satu|sebiji} {jugak|} 😂

{Apa yang buat dia terus beli|Kenapa dia terus beli}:
{{senarai}}

Harga {{harga}} je. {Patutlah|Memang patut la}.`,
      `{Cerita|Story} {sikit|pendek} {☕|📖}

{Dulu|Sebelum ni}: {{masalahP}}
[Aku] {skeptikal|ragu-ragu} {dengan|pasal} {{namaPendek}} ni. {Tapi|But} {sebab|bila tengok} harga {{harga}} je, [aku] {try lah|cuba lah}.

{Sekarang|Hasilnya}? {{hasil}} {{emoji}}
{{senarai}}

{Memang|Confirm} {tak menyesal|berbaloi|worth it}.`,
      `{POV|Situasi}: [korang] {akhirnya|finally} {beli|dapat} {{nama}} {😂|🥹}

Hari 1: "{Hmm|Okay}, {boleh la|nampak ok}"
Hari 3: "{Eh|Wah}, {{k1i}}"
Hari 7: "{Macam mana la|Kenapa la} [aku] {hidup tanpa ni dulu|tak beli awal}?!" {💯|🤯}

{{hasil}}
{Harga|Semua dengan} {{harga}} je.`,
    ],
  },
  {
    id: 'banding',
    label: '⚖️ Perbandingan / Before-After',
    templates: [
      `{Sebelum vs Selepas|Before vs After} {{namaPendek}} 👇

❌ {Sebelum|Before}: {{masalahP}}
✅ {Selepas|After}: {{hasil}}

{Apa yang buat beza|Rahsia dia}:
{{senarai}}

{Semua dengan|Harga} {{harga}} {je|sahaja} {{emoji}}`,
      `{Beli|Ambil} {yang mahal|brand mahal} {ratus-ratus|RM100++}? 🤔
{ATAU|Atau} {{nama}} {cuma|hanya} {{harga}}, {yang dah cukup|yang memang} [best] untuk {kegunaan harian|pakai hari-hari}?

{{senarai}}

[Aku] {pilih|choose} {yang kedua|option kedua} {la|lah} {😎|💅}
{Duit lebih|Baki duit} {simpan|buat belanja benda lain} 💰`,
      `{Harga asal|Biasa} vs {Harga promo|Sekarang} {💸|🛍️}
🏷️ {Harga asal|Sebelum}: {{hargaAsalCoret}}
🔥 {{kedai}}: {{harga}} — jimat {{jimat}}!

{Untuk|Dapat} {{nama}}:
{{senarai}}

{{hasil}} {{emoji}}`,
    ],
  },
  {
    id: 'hadiah',
    label: '🎁 Idea Hadiah',
    templates: [
      `{Pening|Buntu} {cari|fikir} hadiah {untuk|buat} {{untuk}}? 🎁

{Cuba|Bagi} {{nama}} — {hadiah|gift} yang {betul-betul|memang} {dipakai|berguna}, bukan {simpan dalam almari|jadi perhiasan}.

{{senarai}}

{Confirm|Mesti} dia {suka|happy|terharu} {🥹|💕}
Harga {{harga}} {je|sahaja} — {tak pokai|jimat poket}!`,
      `{Hadiah|Gift} {bawah|under} {{hargaBulat}} {yang nampak mahal|yang orang betul-betul guna}? ✅

{{nama}} {{emoji}}
{{senarai}}

{Bagi|Hadiahkan} {pada|kat} {{untuk}} — {setiap kali guna|bila guna}, {terus teringat|confirm ingat} siapa yang bagi 💝`,
      `{Birthday|Hari jadi|Anniversary} {dah dekat|nak sampai}? {Jangan|Tak payah} {pening|beli last minute} 🎀

{{nama}} {boleh jadi|memang} {hadiah|gift} {paling|yang} {praktikal|berguna}:
{{senarai}}

{{hasil}}
{Harga|Semua} {{harga}} je {{emoji}}`,
    ],
  },
  {
    id: 'tips',
    label: '💡 Tips / Cara Guna',
    templates: [
      `{Tips|Tip} {mudah|simple} {untuk|kalau} [korang] nak {{hasilI}} 💡

1️⃣ {Kenal pasti|Fikir} {masalah utama|apa yang paling mengganggu} — {{masalahP}}
2️⃣ {Guna|Cuba} {barang|alat} yang {tepat|betul}. [Aku] guna {{nama}}
3️⃣ {Konsisten|Jadikan rutin} — {hasil dia|kesan dia} {terasa|nampak} {dalam seminggu|cepat}

{Kenapa|Sebab apa} {{namaPendek}}?
{{senarai}}

Harga {{harga}} je. {Simpan|Save} tips ni 📌`,
      `{Cara|Macam mana} [aku] {settle|selesaikan} {masalah|hal} ni {dalam masa|kurang dari} {5 minit|sehari} ⏱️

{Masalah|Situasi}: {{masalahP}}
{Solution|Penyelesaian}: {{nama}} {{emoji}}

{Apa yang [aku] buat|Langkah dia}:
{{senaraiNombor}}

{Hasilnya|Sekarang}: {{hasil}}`,
      `{Life hack|Hack} {yang|} [aku] {baru tahu|tak sangka berkesan} {🤯|💡}

{Selama ni|Dulu} [aku] {ingat|fikir} {{masalahP}} {memang tak boleh elak|benda biasa}.
{Rupanya|Tapi rupanya} {cuma perlu|ada cara mudah}: {{nama}}

{{senarai}}

{Kos|Modal} dia? {{harga}} je. {Share|Kongsi} {pada|kat} kawan yang perlu tahu 🔁`,
    ],
  },
  {
    id: 'rahsia',
    label: '🤫 Rahsia / Curiosity',
    templates: [
      `{Ramai|Kawan-kawan} {tanya|asyik tanya} {macam mana|apa rahsia} [aku] {{hasilI}} 🤫

{Okay|Baiklah}, [aku] {bocorkan|share} {rahsia dia|jawapan dia}…
{Bukan|Tak} {mahal|susah} pun. {Cuma|Hanya}: {{nama}} {{emoji}}

{{senarai}}

{Harga|Modal} {{harga}} je. {Jangan|Tolong jangan} {bagitahu orang lain|share ramai-ramai} {😂|🤭}`,
      `{Benda|Barang} {kecil|murah} ni {la|lah} {sebab|punca} {{hasilI}} 👀

{Tak|Tak ada} {siapa|orang} {perasan|tahu}, tapi {{nama}} {buat beza|ubah semuanya}:
{{senarai}}

{Cuba|Try} {sendiri|la} — {{harga}} je.`,
      `{Apa|Apakah} {persamaan|beza} {orang yang|mereka yang} {{hasilI}}? 🤔

{Kebanyakan|Selalunya} dia {orang|org} {tak|tidak} {hadap|tahan} {{masalahP}}.
{Sebab|Kerana} dia {guna|ada} {benda macam|} {{nama}} 👇

{{senarai}}

{Sekarang|Kini} [korang] pun {tahu|dah tahu} {rahsia dia|caranya}. Harga {{harga}} je {{emoji}}`,
    ],
  },
  {
    id: 'unboxing',
    label: '📦 Unboxing / First Impression',
    templates: [
      `{Unboxing|Buka kotak} {{nama}} 📦✨

📦 {Penghantaran|Sampai}: {laju|cepat}, {packaging|bungkusan} {kemas|elok}
👀 {First impression|Kesan pertama}: {lagi cantik dari gambar|nampak berkualiti|padu}!
{{senarai}}

{Untuk|Dengan} harga {{harga}}… {serius|memang} [best] {😍|🤩}`,
      `{Barang|Parcel} {sampai|dah sampai}! 📦 {Jom|Mari} tengok {{namaPendek}} ni {{emoji}}

✅ {Saiz|Kualiti} {ngam|sesuai}
✅ {{k1}}
✅ {{k2}}

{Rating|Markah} first impression: {⭐⭐⭐⭐⭐|9/10|10/10}
{Nanti|Lepas ni} [aku] update {lepas guna seminggu|review penuh} — {follow|stay tuned} {ye|tau}! 👀`,
      `{Paket|Parcel} {hari ni|minggu ni}: {{nama}} 📦

{Jujur|Honestly}, [aku] {expect biasa-biasa|tak letak harapan tinggi} sebab harga {{harga}} je.
{Tapi bila buka|Bila dah buka}… {😳|🤯}
{{senarai}}

{Dah|Terus} {terasa|nampak}: {{hasilI}} ✨`,
    ],
  },
  {
    id: 'lawak',
    label: '😂 Lawak / Relatable',
    noFormal: true,
    noHook: true,
    templates: [
      `[Aku]: {Bulan ni|Minggu ni} {nak|kena} {jimat|save duit} 💪
{Juga|Also} [aku]: {{nama}} {masuk troli|dah checkout} {😭|🤡|🙈}

{Tapi|Dah la} harga {{harga}} je… {siapa boleh tahan|tak dapat tahan} {😂|🤣}
{Dan|Plus} {lepas guna|bila dah sampai}: {{hasil}}

{Okay|So} {bukan membazir|ni dikira pelaburan} {kan|ye tak}? 😌`,
      `{Duit|Dompet}: {tolonglah|please} {berhenti|stop} 🥲
{{kedai}}: {Nah|Ini} {{nama}}, {{harga}} je {{emoji}}
[Aku]: {Okay|Baiklah} {fine|lah} 🛒

{Dan sekarang|Hasilnya}:
{{senarai}}

{Dompet|Duit} [aku] {menangis|merajuk}, tapi [aku] {happy|puas hati} 😂`,
      `{Plot twist|Fakta}: {{nama}} ni {lagi|lebih} {setia|reliable} dari {ex|crush} [aku] {😂|💀}

{{senarai}}

{Tak pernah|Tak reti} {buat hal|kecewakan}. {Dan|Plus} harga {{harga}} je.
{Okay|So} siapa {nak|mahu} {join|ikut} [aku] [beli]? 🙋‍♀️`,
    ],
  },
];

// ---------- HOOK "STOP SCROLL" ----------
// Kadang-kadang diletak di atas caption sebagai baris pembuka tambahan (kepelbagaian + tarikan).
export const HOOKS = [
  'Jangan scroll dulu ✋ — ni untuk [korang] yang {selalu|pernah} {{masalahP}}',
  '{Barang|Benda} {{harga}} yang {ubah|tukar} {rutin|hari-hari} [aku] {🤯|😳}',
  '[Aku] {patut|sepatutnya} beli ni {dari dulu|tahun lepas lagi} {😭|🥲}',
  '{Kalau|Untuk} [korang] nak {{hasilI}} — {baca ni|ni untuk [korang]} 👇',
  '{Tak sangka|Tak expect} {barang|benda} {{harga}} {boleh buat|mampu buat} {beza|perubahan} {sebesar ni|macam ni} 😳',
  '{Bagi|Beri} [aku] {5 saat|10 saat} — [korang] {mesti|confirm} {nak benda ni|terus nak checkout} ⏱️',
  '{Ni|Inilah} {barang|benda} yang [aku] {paling banyak|selalu} {kena tanya|orang DM tanya} {minggu ni|bulan ni} 👇',
  '{Racun|RACUN} {hari ini|minggu ni} {🧪|☠️} — {jangan salahkan [aku]|tanggung sendiri} {😂|🤭}',
  '{Siapa|Sesiapa} yang {selalu|pernah} {{masalahP}}, {angkat tangan|sila baca ni} 🙋‍♀️',
  '{Ramai tak tahu|Tak ramai tahu} {barang|benda} ni {wujud|ada} — {padahal|walhal} {berguna gila|settle masalah besar} 👀',
];

// ---------- LINK DALAM KOMEN PERTAMA ----------
// Facebook & Threads kurang "tolak" post yang ada link luar → letak link dalam komen.
export const COMMENT_POINTER = [
  '🔗 Link {ada|letak} {di komen|kat komen} {pertama|bawah} {ye|tau} 👇',
  '👇 {Link beli|Link order} {dalam|kat} komen {pertama|paling atas}!',
  '{Nak|Berminat}? Link {ada|saya letak} {di|kat} komen 👇',
];
export const COMMENT_TEXT = [
  '🛒 {Link|Order} {sini|kat sini} 👉 {{link}}',
  '👉 {Ni link dia|Link beli}: {{link}}\n{Harga|Harga promo} {{harga}} — {cepat sebelum habis|sementara promo masih ada} ⏰',
  '{Link|Link order} 👇\n{{link}}\n{Selamat [beli]|Happy shopping} [korang]! 🛍️',
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
  '{Komen|Drop} "{NAK|🙋‍♀️|MAHU}" kalau {berminat|nak juga|setuju}!',
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
