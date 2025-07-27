# Fitur Indicator System

## Perubahan yang Dilakukan

### 1. Pemindahan Fungsi dari +layout.svelte ke indicator.ts

Semua fungsi indicator telah dipindahkan dari `+layout.svelte` ke `src/lib/utils/viewport/indicator.ts` untuk:
- Mengurangi kompleksitas di file Svelte
- Meningkatkan reusability
- Memisahkan logic dari presentation

### 2. Fitur Mouse Detection di Sekitar Indicator

Ditambahkan fitur baru yang mencegah indicator hilang ketika mouse berada di sekitar area indicator:

#### Konfigurasi:
- **indicatorAreaRadius**: 100px (default) - radius area sekitar indicator
- **mouseAreaPercentage**: 0.8 (default) - 80% dari kiri layar untuk trigger show indicator

#### Cara Kerja:
1. Ketika mouse masuk ke area kanan layar (20% area kanan), indicator akan muncul
2. Ketika mouse berada dalam radius 100px dari indicator, indicator akan tetap terlihat
3. Ketika mouse keluar dari area indicator, timer hide akan dimulai kembali

### 3. Fungsi Baru: useLayoutIndicatorSystem

Fungsi khusus untuk digunakan di layout yang menggabungkan:
- Indicator system
- Mouse detection
- Section navigation
- Auto cleanup

#### Penggunaan:
```javascript
const layoutIndicator = useLayoutIndicatorSystem(sections, {
  hideDelay: 3000,
  mouseAreaPercentage: 0.8,
  indicatorAreaRadius: 100,
  scrollDelay: 800,
  onSectionChange: (index) => console.log('Section changed:', index),
  onScrollAttempt: (direction) => console.log('Scroll attempt:', direction)
});
```

### 4. Fitur Debugging

Ditambahkan console.log untuk monitoring:
- Perubahan visibility indicator
- Section changes
- Mouse area detection
- Cleanup process

## Manfaat

1. **Kode Lebih Bersih**: Logic indicator terpisah dari UI components
2. **User Experience Lebih Baik**: Indicator tidak hilang saat user ingin menggunakannya
3. **Maintainability**: Fungsi terpusat dan mudah dimodifikasi
4. **Reusability**: Dapat digunakan di komponen lain jika diperlukan