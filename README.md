# 🧪 RacunPost

Tukar **link affiliate Shopee & TikTok Shop** kepada caption dan poster yang menarik engagement.
**100% percuma**: tiada API AI berbayar, tiada database, tiada login. Semua data disimpan dalam browser pengguna.

## Ciri-ciri

| Ciri | Penerangan |
|---|---|
| ⚡ **Jana Post** | Paste link, isi harga & kelebihan, kemudian dapat 3/5/8 caption dengan **angle jualan berbeza** |
| 🔀 **Kepelbagaian** | 10 angle × 3 template × spintax × 5 nada × bank hook/CTA/emoji/hashtag = ribuan kombinasi |
| 🧠 **Anti-ulang** | Web ingat caption yang pernah keluar dan elak ulang yang sama |
| 🔗 **Auto isi** | Baca nama & harga dari teks share Shopee/TikTok atau URL produk penuh |
| 📱 **Ikut platform** | Facebook, Instagram, TikTok (beg kuning / link bio), Threads (≤500), X (≤280), WhatsApp |
| 🎭 **5 nada** | Santai, Rojak BM-English, Formal, Lawak, Urgent/FOMO |
| 🗓️ **Kempen** | 11.11, 12.12, Gaji masuk, Raya, Ramadan, Buka sekolah, dll. |
| 🖼️ **Poster** | 3 susun atur × 6 warna × 3 saiz (1:1, 4:5, 9:16). Muat turun PNG / share |
| 📅 **Planner 7 hari** | 7 post berbeza angle dengan waktu cadangan, digilirkan antara platform |
| 🗂️ **Sejarah** | Simpan semua produk & caption, boleh guna semula |
| ✍️ **Template Saya** | Tulis gaya caption sendiri (sokong spintax & placeholder) |
| 🤖 **Prompt AI percuma** | Copy prompt lengkap, kemudian paste dalam ChatGPT/Claude/Gemini (akaun percuma) |
| 📲 **PWA** | Boleh "Install" di telefon & terima link terus melalui menu Share |

## Deploy percuma ke GitHub Pages (2 minit)

1. Buka repo ini di GitHub, kemudian **Settings → Pages**.
2. Di **Build and deployment → Source**, pilih **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**, kemudian tekan **Save**.
4. Tunggu 1–2 minit. Web anda di **https://adib2024.github.io/affliate/**

Setiap kali push ke `main`, web dikemas kini secara automatik.

### Cara isi produk paling laju

Dalam app Shopee/TikTok, tekan **Share → Copy link** dan paste **semua teks** yang dicopy ke kotak link.
Teks share biasanya mengandungi nama & harga produk, jadi web akan isi automatik.
(Link pendek seperti `s.shopee.com.my/xxx` sahaja tak boleh dibaca tanpa server, jadi isi nama sendiri.)

## Jalankan di komputer sendiri

```bash
node dev-server.js
```

Buka http://localhost:5173. Tiada `npm install` diperlukan (Node 18+). Web ni 100% statik, jadi tiada server diperlukan bila online.

## Struktur

```
index.html, styles.css       → UI
js/engine/data.js            → BANK AYAT (edit sini untuk tambah gaya global)
js/engine/spintax.js         → spintax {a|b} + token nada [korang]
js/engine/generator.js       → enjin caption, planner, prompt AI
js/ui/poster.js              → penjana poster (canvas)
js/app.js                    → logik UI
js/engine/linkinfo.js        → baca nama & harga dari link / teks share
sw.js, manifest.webmanifest  → PWA
```

## Tambah ayat sendiri

- **Cara mudah:** guna tab **✍️ Template** dalam web.
- **Cara global:** tambah template dalam `ANGLES` di `js/engine/data.js`.
  - `{a|b|c}`: pilih satu secara rawak
  - `[korang] [aku] [best] [weh] [beli] [murah] [cepat] [serius]`: bertukar ikut nada
  - `{{nama}} {{harga}} {{senarai}} …`: maklumat produk. Baris dengan maklumat kosong dibuang automatik.

## Nota

- Gambar poster: upload gambar / screenshot produk dari telefon.
- Waktu cadangan dalam Planner ialah anggaran umum untuk audiens Malaysia. Semak Insights akaun anda untuk waktu terbaik sebenar.
