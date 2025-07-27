# Hero Carousel Component

Komponen carousel hero yang dapat dikustomisasi dengan dukungan multiple instances, state management menggunakan Svelte stores, dan transisi yang smooth.

## Features

- ✅ **Customizable Images** - Dapat menerima array gambar custom
- ✅ **ID Support** - Mendukung multiple instances dengan ID unik
- ✅ **Global Store** - Dapat menggunakan store global tanpa ID
- ✅ **Reactive State** - Menggunakan Svelte stores untuk state management
- ✅ **Customizable Content** - Semua konten dapat dikustomisasi via props
- ✅ **Smooth Transitions** - Transisi fade dengan overlay effect
- ✅ **TypeScript Support** - Full type safety
- ✅ **Responsive Design** - Mobile-friendly design

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `carouselId` | `string \| null` | `null` | ID unik untuk carousel (opsional, jika null akan menggunakan global store) |
| `images` | `{ url: string }[]` | Default images | Array gambar untuk carousel |
| `interval` | `number` | `6000` | Interval transisi dalam milliseconds |
| `title` | `string` | `'AB steak'` | Judul utama |
| `subtitle` | `string` | `'Restaurant'` | Subtitle |
| `description` | `string` | Default description | Deskripsi konten |
| `primaryButtonText` | `string` | `'Our Menu'` | Text tombol utama |
| `primaryButtonHref` | `string` | `'#menu'` | Link tombol utama |
| `secondaryButtonText` | `string` | `'Book a table'` | Text tombol kedua |
| `secondaryButtonHref` | `string` | `'#reservation'` | Link tombol kedua |

## Usage

### Basic Usage

```svelte
<script>
  import HeroCarousel from '$lib/components/organisms/carousel/hero/index.svelte';
</script>

<!-- Default carousel -->
<HeroCarousel />
```

### Custom Images

```svelte
<script>
  import HeroCarousel from '$lib/components/organisms/carousel/hero/index.svelte';
  
  const customImages = [
    { url: 'https://example.com/image1.jpg' },
    { url: 'https://example.com/image2.jpg' },
    { url: 'https://example.com/image3.jpg' }
  ];
</script>

<HeroCarousel 
  images={customImages}
  title="Your Restaurant"
  subtitle="Name"
  description="Your custom description here"
/>
```

### Multiple Instances

```svelte
<script>
  import HeroCarousel from '$lib/components/organisms/carousel/hero/index.svelte';
  
  const heroImages = [
    { url: 'https://example.com/hero1.jpg' },
    { url: 'https://example.com/hero2.jpg' }
  ];
  
  const aboutImages = [
    { url: 'https://example.com/about1.jpg' },
    { url: 'https://example.com/about2.jpg' }
  ];
</script>

<!-- Hero section -->
<HeroCarousel 
  carouselId="main-hero"
  images={heroImages}
  title="Main"
  subtitle="Restaurant"
/>

<!-- About section -->
<HeroCarousel 
  carouselId="about-hero"
  images={aboutImages}
  title="About"
  subtitle="Us"
  interval={4000}
/>
```

### Full Customization

```svelte
<HeroCarousel 
  carouselId="custom-hero"
  images={customImages}
  interval={5000}
  title="Delicious"
  subtitle="Food"
  description="Experience the finest culinary journey with our expertly crafted dishes."
  primaryButtonText="Explore Menu"
  primaryButtonHref="/menu"
  secondaryButtonText="Make Reservation"
  secondaryButtonHref="/reservation"
/>
```

## Store Integration

Komponen ini menggunakan carousel store yang mendukung:

- **Global Store**: Jika `carouselId` adalah `null`
- **ID-based Store**: Jika `carouselId` memiliki nilai string
- **Automatic Cleanup**: Store dibersihkan otomatis saat komponen di-unmount

## Architecture

```
Hero Carousel Component
├── Props (images, content, config)
├── Carousel Utility (logic)
├── Carousel Store (state management)
└── Template (UI rendering)
```

## Dependencies

- `svelte` - Framework utama
- `flowbite-svelte` - UI components (Button)
- `$lib/utils/carousel` - Carousel utility
- `$lib/stores/carousel` - Store management

## Styling

Komponen menggunakan:
- **Tailwind CSS** untuk styling
- **Custom CSS animations** untuk fade-in effect
- **Google Fonts (Pacifico)** untuk font cursive
- **Responsive design** dengan breakpoints

## Examples

Lihat contoh lengkap di folder `example/` yang mencakup:

1. **Default Usage** - Penggunaan dasar
2. **Custom Images** - Gambar custom
3. **Pizza Restaurant Theme** - Tema khusus
4. **Fast Transition** - Transisi cepat

## Performance

- ✅ Efficient store management
- ✅ Automatic cleanup
- ✅ Optimized re-renders
- ✅ Lazy loading support
- ✅ Memory leak prevention

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ✅ Progressive enhancement
- ✅ Graceful degradation

## Contributing

Untuk berkontribusi pada komponen ini:

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## License

MIT License - lihat file LICENSE untuk detail lengkap.