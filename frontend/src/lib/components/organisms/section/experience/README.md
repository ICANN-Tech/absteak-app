# Experience Section Component

## Overview

Experience Section adalah komponen organism yang menampilkan section pengalaman dengan kombinasi teks dan galeri gambar yang bergerak secara infinite scroll. Komponen ini dirancang untuk memberikan pengalaman visual yang menarik dengan animasi scrolling yang smooth.

## Features

- ✅ **Responsive Design** - Menyesuaikan layout untuk desktop dan mobile
- ✅ **Infinite Scrolling Images** - Dua kolom gambar dengan animasi scroll berlawanan arah
- ✅ **Customizable Content** - Semua teks dan gambar dapat dikustomisasi melalui props
- ✅ **Background Image Support** - Mendukung background image yang dapat dikustomisasi
- ✅ **TypeScript Support** - Fully typed untuk development experience yang lebih baik
- ✅ **Reusable Component** - Menggunakan ScrollableImage molecule untuk modularitas

## Props

### Text Content Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'EXPERIENCE GORDON RAMSAY ACROSS NORTH AMERICA'` | Judul utama section |
| `description` | `string` | `'Visit world-renowned, Michelin-starred...'` | Deskripsi utama |
| `subtitle` | `string` | `'Join us on the Las Vegas Strip...'` | Sub deskripsi |

### Visual Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backgroundImage` | `string` | Gordon Ramsay background URL | URL background image |
| `leftColumnImages` | `string[]` | Array of restaurant images | Array URL gambar untuk kolom kiri |
| `rightColumnImages` | `string[]` | Array of restaurant images | Array URL gambar untuk kolom kanan |
| `leftColumnHeights` | `string[]` | `['h-48', 'h-72', ...]` | Array class Tailwind untuk tinggi gambar kolom kiri |
| `rightColumnHeights` | `string[]` | `['h-64', 'h-52', ...]` | Array class Tailwind untuk tinggi gambar kolom kanan |

## Dependencies

### Internal Components
- `ScrollableImage` dari `$lib/components/molecules/media` - Komponen untuk menampilkan galeri gambar dengan animasi scroll

### External Dependencies
- Tailwind CSS untuk styling
- CSS animations untuk scroll effects (didefinisikan di `app.css`)

## Animation Classes

Komponen ini menggunakan CSS animations yang didefinisikan secara global:
- `.animate-scroll-up` - Animasi scroll ke atas
- `.animate-scroll-down` - Animasi scroll ke bawah

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Background Image                     │
│  ┌─────────────────┐  ┌─────────────────────────────────┐ │
│  │                 │  │        Image Gallery           │ │
│  │   Text Content  │  │  ┌─────────┐  ┌─────────────┐   │ │
│  │   - Title       │  │  │ Left    │  │ Right       │   │ │
│  │   - Description │  │  │ Column  │  │ Column      │   │ │
│  │   - Subtitle    │  │  │ (↑)     │  │ (↓)         │   │ │
│  │                 │  │  └─────────┘  └─────────────┘   │ │
│  └─────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Usage Examples

Lihat file `Example.svelte` untuk berbagai contoh penggunaan komponen ini.

## Best Practices

1. **Image Optimization**: Gunakan gambar yang sudah dioptimasi untuk web
2. **Height Variation**: Variasikan tinggi gambar untuk visual yang lebih menarik
3. **Content Length**: Jaga panjang teks agar tidak terlalu panjang untuk mobile
4. **Image Count**: Minimal 6 gambar per kolom untuk efek infinite scroll yang smooth
5. **Accessibility**: Pastikan contrast yang cukup antara teks dan background

## Performance Considerations

- Gambar dimuat secara lazy loading melalui komponen Image atom
- Animasi menggunakan CSS transform untuk performa yang optimal
- Komponen menggunakan ScrollableImage yang sudah dioptimasi untuk reusability

## Browser Support

- Modern browsers yang mendukung CSS transforms dan animations
- Responsive design untuk semua ukuran layar
- Fallback graceful untuk browser yang tidak mendukung animasi