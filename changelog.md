# Changelog

## [v1.6.3] - 2026-11-10
### Fixed
- Memperbaiki bug "Double Input" di mana satu ketikan di HP mengisi dua kotak sekaligus (A1 dan B1).
- Memisahkan event listener untuk mencegah tumpang tindih antara event `keydown` dan `input`.


## [v1.6.2] - 2026-11-10
### Changed
- Memindahkan posisi indikator versi dari pojok kanan bawah (melayang) ke bawah tombol "Clear Board" agar lebih terlihat jelas dan rapi.


## [v1.6.1] - 2026-11-10
### Fixed
- Memperbaiki masalah keyboard mobile yang tidak muncul dengan mengubah styling input tersembunyi (ukuran 1x1px, font 16px).
- Memperbaiki masalah zoom-out/layout melebar di mobile dengan menambahkan `box-sizing: border-box` dan `overflow-x: hidden`.


## [v1.6.0] - 2026-11-10
### Added
- Menambahkan indikator versi di pojok kanan bawah website untuk memudahkan verifikasi pembaruan GitHub Pages.


## [1.5.0] - 2026-11-10
### Added
- **Mobile Responsive**: Layout sekarang otomatis menyesuaikan ukuran layar HP (atas-bawah).
- **Mobile Keyboard Support**: Menambahkan elemen input tersembunyi agar keyboard virtual muncul saat kotak diklik di HP.


## [1.5.0] - 2026-11-10
### Added
- **Mobile Responsive**: Layout sekarang otomatis menyesuaikan ukuran layar HP (atas-bawah).
- **Mobile Keyboard Support**: Menambahkan elemen input tersembunyi agar keyboard virtual muncul saat kotak diklik di HP.


## [1.4.0] - 2026-11-10
### Added
- Fitur eksekusi interaktif: Pengguna dapat mengklik kotak yang direkomendasikan AI untuk langsung menerapkan simulasi (Upgrade atau Discard).
- Simulasi Discard sekarang secara otomatis menjatuhkan tile di atasnya (gravitasi) tanpa mengisi tile baru (menunggu input user).


## [1.3.0] - 2026-11-10
### Fixed
- Memperbaiki bug di mana tombol "Cari Langkah Terbaik" tidak berfungsi setelah patch layout sebelumnya.
- Memastikan semua logika JavaScript bersih dari error indentasi/sintaks.
### Changed
- Menghapus "Skor Simulasi" dari UI rekomendasi.
- Menambahkan fitur "Detail Proses Merge" (contoh: 3x Lv.1 ➔ Lv.2) agar AI lebih transparan.
- Memindahkan panduan dan status bar ke panel kanan agar layout seimbang (seperti screenshot).


## [1.2.0] - 2026-11-10
### Changed
- Merombak tata letak (layout) agar lebih rapi dan seimbang.
- Memindahkan panduan input dan status bar ke panel kanan.
- Mengubah proporsi lebar grid dan panel kanan (Grid lebih ramping, panel kanan lebih lega).


Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

## [1.1.0] - 2026-11-10
### Added
- Menambahkan detail log merge pada rekomendasi AI (contoh: "3x Lv.2 ➔ Lv.3").
- Memastikan tombol "Clear Board" selalu tampil di bawah grid.

### Changed
- Menghapus tampilan "Skor Simulasi" pada UI rekomendasi agar lebih bersih dan fokus pada aksi.
