// Bank kelebihan ikut KEYWORD dalam nama produk (BM & English).
// Bila ruang "Kelebihan" kosong, web cari keyword dalam nama produk dan guna ayat di sini.
// Tambah baris baru ikut produk yang selalu anda jual — lagi banyak, lagi tepat.

export const KEYWORD_BENEFITS = [
  // ---- Susun atur / meja / rumah ----
  { re: /cable (management|organi[sz]er|tray)|wire (organi[sz]er|management)|pengurus wayar|rak wayar/i, k: ['Wayar tersusun kemas, tak berselirat lagi', 'Bawah meja nampak bersih & teratur'] },
  { re: /under ?desk|bawah meja/i, k: ['Pasang bawah meja — tak makan ruang langsung'] },
  { re: /socket|extension|plug|power strip|palam/i, k: ['Extension & plug tersorok, tak bersepah atas lantai'] },
  { re: /extendable|adjustable|retractable|boleh laras|telescopic/i, k: ['Boleh laras ikut saiz yang anda nak'] },
  { re: /foldable|folding|lipat|collapsible/i, k: ['Boleh lipat — jimat ruang bila simpan'] },
  { re: /organi[sz]er|storage|rak|rack|shelf|penyimpanan|drawer|laci/i, k: ['Barang tersusun, senang cari bila perlu'] },
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
  { re: /vacuum|penyedut|mop|penyapu/i, k: ['Kemas rumah jadi lebih cepat & kurang penat'] },
  { re: /air fryer|airfryer/i, k: ['Masak rangup tanpa banyak minyak'] },
  { re: /blender|pengisar|juicer/i, k: ['Kisar laju — siap dalam beberapa saat'] },

  // ---- Gajet ----
  { re: /wireless|bluetooth|tanpa wayar/i, k: ['Wireless — bebas bergerak tanpa wayar berselirat'] },
  { re: /fast charg|quick charg|pd ?\d+w|\d+w\b|cas laju/i, k: ['Cas laju — tak perlu tunggu lama'] },
  { re: /power ?bank/i, k: ['Bateri simpanan — phone tak mati masa penting'] },
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
  { re: /tudung|shawl|bawal|hijab/i, k: ['Senang dibentuk, terletak cantik sepanjang hari'] },
  { re: /lightweight|ringan/i, k: ['Ringan — tak rasa berat langsung'] },
  { re: /sneaker|kasut|shoe|sandal/i, k: ['Selesa dipakai jalan jauh'] },

  // ---- Kecantikan ----
  { re: /vitamin c|brightening|mencerahkan|glow/i, k: ['Bantu kulit nampak lebih cerah & berseri'] },
  { re: /hyaluronic|hydrat|moistur|pelembap/i, k: ['Kulit terasa lembap & tak kering'] },
  { re: /niacinamide|pore|liang/i, k: ['Bantu liang pori nampak lebih halus'] },
  { re: /spf|sunscreen|sunblock|uv/i, k: ['Lindungi kulit dari cahaya matahari'] },
  { re: /long ?lasting|tahan lama|waterproof|transfer.?proof|smudge/i, k: ['Tahan lama — tak perlu touch-up selalu'] },
  { re: /matte/i, k: ['Finishing matte — tak berminyak'] },
  { re: /halal/i, k: ['Halal — guna dengan tenang'] },
  { re: /perfume|minyak wangi|eau de/i, k: ['Wangi tahan lama — orang sekeliling perasan'] },

  // ---- Bayi / kesihatan / makanan ----
  { re: /bpa.?free|food grade|gred makanan/i, k: ['Bahan food grade, bebas BPA — selamat untuk keluarga'] },
  { re: /baby|bayi|newborn/i, k: ['Lembut & selamat untuk si kecil'] },
  { re: /collagen|kolagen/i, k: ['Mudah diambil setiap hari'] },
  { re: /massage|urut/i, k: ['Lega lenguh badan tanpa perlu ke spa'] },
  { re: /snack|kerepek|keropok|biskut|coklat|chocolate/i, k: ['Sedap — sekali makan memang tak cukup'] },
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
