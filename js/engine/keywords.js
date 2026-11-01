// Bank kelebihan ikut KEYWORD dalam nama produk (BM & English).
// Bila ruang "Kelebihan" kosong, web cari keyword dalam nama produk dan guna ayat di sini.
// Tambah baris baru ikut produk yang selalu anda jual — lagi banyak, lagi tepat.

export const KEYWORD_BENEFITS = [
  // ---- Susun atur / meja / rumah ----
  { re: /cable (management|organi[sz]er|tray)|wire (organi[sz]er|management)|pengurus wayar|rak wayar/i, k: ['Wayar tersusun kemas, tak berselirat lagi', 'Bawah meja nampak bersih & teratur'], m: ['Bawah meja {berselirat|bersepah} dengan wayar & extension?', 'Kaki {asyik|selalu} {tersepak|tersangkut} wayar bawah meja?'] },
  { re: /under ?desk|bawah meja/i, k: ['Pasang bawah meja — tak makan ruang langsung'] },
  { re: /socket|extension|plug|power strip|palam/i, k: ['Extension & plug tersorok, tak bersepah atas lantai'] },
  { re: /extendable|adjustable|retractable|boleh laras|telescopic/i, k: ['Boleh laras ikut saiz yang anda nak'] },
  { re: /foldable|folding|lipat|collapsible/i, k: ['Boleh lipat — jimat ruang bila simpan'] },
  { re: /organi[sz]er|storage|rak|rack|shelf|penyimpanan|drawer|laci/i, k: ['Barang tersusun, senang cari bila perlu'], m: ['Barang {bersepah|merata} sampai {susah nak cari|buang masa cari} {bila perlu|setiap hari}?'] },
  { re: /no ?drill|tanpa (tebuk|skru)|adhesive|self.?adhesive|tampal/i, k: ['Pasang tanpa tebuk dinding — sesuai rumah sewa'] },
  { re: /magnet/i, k: ['Ada magnet — lekat kukuh, senang pasang & tanggal'] },
  { re: /stainless|keluli/i, k: ['Stainless steel — tahan lama & tak berkarat'] },
  { re: /non.?stick|tak melekat/i, k: ['Non-stick — masak guna sikit minyak, senang cuci'] },
  { re: /large capacity|kapasiti besar|besar|jumbo|xl\b|xxl/i, k: ['Muatan besar, boleh simpan banyak'] },
  { re: /multi.?function|serba guna|multipurpose|2 in 1|3 in 1|4 in 1/i, k: ['Serba guna — satu barang, banyak fungsi'] },
  { re: /anti.?slip|tak licin/i, k: ['Anti-slip — tak bergerak, lebih selamat'] },
  { re: /waterproof|kalis air|water resistant/i, k: ['Kalis air — tak risau kena hujan atau tumpah'] },
  { re: /ergonomic|ergonomik/i, k: ['Reka bentuk ergonomik — selesa guna lama'] },
  { re: /desk|meja|table|workstation/i, k: ['Meja kerja nampak kemas, mood kerja pun naik'] },
  { re: /vacuum|penyedut|mop|penyapu/i, k: ['Kemas rumah jadi lebih cepat & kurang penat'], m: ['{Habuk|Rambut} {kat lantai|merata} tak habis-habis {walaupun|padahal} dah sapu?'] },
  { re: /air fryer|airfryer/i, k: ['Masak rangup tanpa banyak minyak'], m: ['Nak makan {goreng|rangup} tapi {risau minyak banyak|malas cuci kuali}?'] },
  { re: /blender|pengisar|juicer/i, k: ['Kisar laju — siap dalam beberapa saat'] },

  // ---- Gajet ----
  { re: /\bmouse\b|tetikus|mx master|mx anywhere|gaming mouse/i, k: ['Selesa di tangan walaupun guna seharian', 'Scroll laju & tepat — kerja siap lebih cepat'], m: ['Pergelangan tangan {lenguh|sakit} lepas seharian guna mouse biasa?', 'Mouse lama asyik {double click|tersangkut} masa kerja penting?'] },
  { re: /keyboard|papan kekunci|mechanical/i, k: ['Taip lebih selesa & laju'], m: ['Jari {penat|lenguh} lepas menaip seharian?'] },
  { re: /wireless|bluetooth|tanpa wayar/i, k: ['Wireless — bebas bergerak tanpa wayar berselirat'], m: ['Wayar earphone {bersimpul|asyik kusut} {dalam beg|dalam poket}?'] },
  { re: /fast charg|quick charg|pd ?\d+w|\d+w\b|cas laju/i, k: ['Cas laju — tak perlu tunggu lama'], m: ['{Penat|Bosan} tunggu phone cas {berjam-jam|lama sangat}?'] },
  { re: /power ?bank/i, k: ['Bateri simpanan — phone tak mati masa penting'], m: ['Phone {selalu|asyik} mati {time penting|masa paling perlu}? 🪫'] },
  { re: /rechargeable|boleh cas|usb.?c|type.?c/i, k: ['Boleh cas semula — tak perlu beli bateri'] },
  { re: /portable|mudah alih|mini|compact|kompak/i, k: ['Saiz kompak, senang bawa ke mana-mana'] },
  { re: /noise cancel|anc\b/i, k: ['Noise cancelling — fokus tanpa gangguan bunyi luar'] },
  { re: /led|lampu|light/i, k: ['Cahaya terang & jimat elektrik'] },
  { re: /tripod|phone holder|pemegang/i, k: ['Pegang phone stabil — rakam video tanpa goyang'] },
  { re: /casing|case|screen protector|tempered/i, k: ['Lindungi gajet dari calar & jatuh'] },

  // ---- Fesyen ----
  { re: /cotton|kapas/i, k: ['Kain cotton — lembut & sejuk dipakai'] },
  { re: /breathable|tak panas|sejuk/i, k: ['Kain bernafas — tak panas walaupun pakai lama'] },
  { re: /no iron|tak perlu gosok|anti.?wrinkle|tak berkedut/i, k: ['Tak perlu gosok — jimat masa pagi-pagi'] },
  { re: /quick dry|cepat kering/i, k: ['Cepat kering lepas basuh'] },
  { re: /stretch|elastic|anjal|getah/i, k: ['Kain anjal — selesa untuk semua bentuk badan'] },
  { re: /plus size|saiz besar|big size/i, k: ['Ada saiz besar — muat & tetap cantik'] },
  { re: /tudung|shawl|bawal|hijab/i, k: ['Senang dibentuk, terletak cantik sepanjang hari'], m: ['Tudung {senget|tak menjadi} {walaupun|padahal} dah {lama|berkali-kali} {bentuk|betulkan}? 😩'] },
  { re: /lightweight|ringan/i, k: ['Ringan — tak rasa berat langsung'] },
  { re: /sneaker|kasut|shoe|sandal/i, k: ['Selesa dipakai jalan jauh'] },

  // ---- Kecantikan ----
  { re: /vitamin c|brightening|mencerahkan|glow/i, k: ['Bantu kulit nampak lebih cerah & berseri'], m: ['Muka {kusam|gelap} & {tak berseri|nampak penat} walaupun dah {tidur cukup|jaga}?'] },
  { re: /hyaluronic|hydrat|moistur|pelembap/i, k: ['Kulit terasa lembap & tak kering'] },
  { re: /niacinamide|pore|liang/i, k: ['Bantu liang pori nampak lebih halus'] },
  { re: /spf|sunscreen|sunblock|uv/i, k: ['Lindungi kulit dari cahaya matahari'], m: ['Muka {cepat gelap|terbakar} lepas {keluar|kena} panas sekejap?'] },
  { re: /long ?lasting|tahan lama|waterproof|transfer.?proof|smudge/i, k: ['Tahan lama — tak perlu touch-up selalu'] },
  { re: /matte/i, k: ['Finishing matte — tak berminyak'] },
  { re: /halal/i, k: ['Halal — guna dengan tenang'] },
  { re: /perfume|minyak wangi|eau de/i, k: ['Wangi tahan lama — orang sekeliling perasan'] },

  // ---- Kereta ----
  { re: /dashcam|dash cam/i, k: ['Rakam setiap perjalanan — ada bukti kalau jadi apa-apa'], m: ['{Takut|Risau} {jadi apa-apa|accident} atas jalan & {takde bukti|susah nak claim}?'] },
  { re: /car (mount|holder)|phone holder kereta|pemegang phone/i, k: ['Phone stabil masa memandu — GPS senang tengok'], m: ['Phone {tergolek|jatuh} masa tengok {Waze|GPS} {sambil drive|memandu}? 😬'] },
  { re: /seat cover|sarung (kusyen|seat)/i, k: ['Kusyen kereta terjaga & nampak baru'] },
  { re: /air freshener|pewangi kereta|car perfume/i, k: ['Kereta wangi sepanjang hari'] },
  { re: /car vacuum|vacuum kereta/i, k: ['Sedut habuk & sampah dalam kereta dengan mudah'] },
  { re: /helmet|topi keledar/i, k: ['Selesa dipakai & lebih yakin di jalan raya'] },

  // ---- Haiwan peliharaan ----
  { re: /cat litter|pasir kucing|litter/i, k: ['Kurang bau, senang dibersihkan'], m: ['{Bau|Pasir} {tandas kucing|litter} {menusuk|bersepah} {satu rumah|sampai ruang tamu}? 😩'] },
  { re: /cat food|makanan kucing|dry food|wet food/i, k: ['Anabul makan berselera'] },
  { re: /scratch|pencakar/i, k: ['Kucing cakar benda ni, bukan sofa lagi 😅'], m: ['Kucing {asyik|suka} cakar {sofa|langsir|perabot} sampai {koyak|rosak}? 😩'] },
  { re: /cat toy|mainan kucing|teaser|feather/i, k: ['Kucing aktif & tak bosan'], m: ['Kucing {bosan|asyik tidur} & {gemuk|tak aktif}?'] },
  { re: /pet bed|tilam kucing|cat bed|katil kucing/i, k: ['Anabul tidur lena & selesa'] },

  // ---- Bayi / kesihatan / makanan ----
  { re: /bpa.?free|food grade|gred makanan/i, k: ['Bahan food grade, bebas BPA — selamat untuk keluarga'] },
  { re: /baby|bayi|newborn/i, k: ['Lembut & selamat untuk si kecil'] },
  { re: /collagen|kolagen/i, k: ['Mudah diambil setiap hari'] },
  { re: /massage|urut/i, k: ['Lega lenguh badan tanpa perlu ke spa'], m: ['{Badan|Bahu|Belakang} {lenguh|sakit} lepas {kerja|seharian}, tapi {takde masa|mahal} nak pergi urut?'] },
  { re: /kunafa|knafeh|pistachio|dubai/i, k: ['Rasa pistachio & kunafa yang tengah viral — tak perlu terbang ke Dubai 😋'], m: ['Teringin nak rasa {dessert|makanan} viral Dubai tapi {mahal|susah nak cari}?'] },
  { re: /chewy|mochi/i, k: ['Tekstur chewy, lembut & kenyal — sekali gigit terus jatuh cinta'], m: ['Bosan dengan {snek|dessert} yang {keras|kering} & {biasa-biasa|sama je}?'] },
  { re: /cookie|biskut|biscuit/i, k: ['Rangup di luar, lembut di dalam 🍪'], m: ['{Craving|Teringin} cookies {sedap|homemade} tapi malas nak bakar sendiri?'] },
  { re: /coklat|chocolate|cocoa|brownie/i, k: ['Coklat pekat, manis cukup rasa — tak muak'], m: ['Mengidam coklat {tengah malam|time stress} tapi {takde stok|kedai dah tutup}?'] },
  { re: /cake|kek|cheesecake|tart|dessert|puding|pudding/i, k: ['Lembut & moist — sesuai untuk dessert lepas makan'], m: ['Nak {dessert|pencuci mulut} sedap tapi {kedai jauh|malas keluar}?'] },
  { re: /kerepek|keropok|chips|snack|snek|crackers|rempeyek/i, k: ['Rangup & berperisa — sekali buka susah nak berhenti'], m: ['Tengok movie tapi takde {snek|kunyah-kunyah} {best|sedap}?'] },
  { re: /pedas|spicy|sambal|cili|chili/i, k: ['Pedas berapi tapi sedap sampai nak tambah 🌶️'], m: ['{Kaki pedas|Peminat pedas} tapi semua {snek|makanan} rasa {tak cukup pedas|biasa}?'] },
  { re: /frozen|nugget|sosej|sausage|dim sum|dumpling/i, k: ['Senang masak — goreng atau air fryer, siap dalam beberapa minit'], m: ['Balik kerja penat, {tak larat|malas} nak masak {yang leceh|lama-lama}?'] },
  { re: /kopi|coffee|nescafe|teh|tea|matcha|milo|drink|minuman|jus|juice/i, k: ['Bancuh senang, rasa macam beli kat kafe ☕'], m: ['Hari-hari beli {kopi|air} kat kafe sampai {duit habis|poket kering}?'] },
  { re: /halal/i, k: ['Halal — makan dengan tenang'] },
  { re: /homemade|buatan sendiri|air tangan/i, k: ['Homemade — rasa macam air tangan sendiri'] },
];

export function benefitsFromName(name, max = 3) {
  const s = String(name || '');
  const out = [];
  for (const { re, k } of KEYWORD_BENEFITS) {
    if (re.test(s)) {
      for (const line of k) if (!out.includes(line)) out.push(line);
    }
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

// Ayat masalah khusus ikut keyword (lebih tepat dari ayat kategori).
export function problemsFromName(name) {
  const str = String(name || '');
  const out = [];
  for (const { re, m } of KEYWORD_BENEFITS) if (m && re.test(str)) out.push(...m);
  return out;
}
