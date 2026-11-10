# Merge Puzzle Solver (Excel Style)

Sebuah alat bantu (solver) berbasis web untuk memecahkan puzzle game "Odin's Feast" atau game sejenis. 

## Fitur
- **Input ala Excel**: Ketik angka 1-9 (dan 0 untuk level 10) langsung dari keyboard tanpa perlu klik menu.
- **AI Solver**: Mensimulasikan kemungkinan *Upgrade* dan *Discard* untuk mencari langkah paling efisien.
- **Simulasi Gravitasi & Merge**: Mendeteksi 3 item atau lebih yang terhubung (BFS) dan mensimulasikan jatuhnya item.
- **Tanpa Asumsi RNG**: AI tidak menebak tile baru yang muncul, sehingga saran yang diberikan 100% akurat berdasarkan tile yang ada di papan.

## Cara Hosting di GitHub Pages
1. Upload semua file ini ke repository GitHub Anda.
2. Buka **Settings** > **Pages**.
3. Di bagian **Build and deployment**, pilih Source: **Deploy from a branch**.
4. Pilih Branch: **main** (atau **master**), lalu folder: **/ (root)**.
5. Klik **Save**. Tunggu 1-2 menit hingga link GitHub Pages Anda aktif.