# SCSS Styles Structure

Struktur styles SCSS untuk project Laravel Inertia Svelte ABSteak.

## Struktur File

```
resources/css/styles/
├── _variables.scss    # Variabel SCSS (colors, fonts, spacing, dll)
├── _base.scss         # Base styles dan CSS reset
├── _scrollbar.scss    # Custom scrollbar styles
├── global.scss        # File utama yang mengimpor semua partial
└── README.md          # Dokumentasi ini
```

## Cara Penggunaan

### 1. Import di File CSS/SCSS

```scss
// Import semua styles
@import './styles/global.scss';

// Atau import individual
@import './styles/_variables.scss';
@import './styles/_base.scss';
```

### 2. Menggunakan Variabel SCSS

```scss
// Contoh penggunaan variabel
.my-component {
    font-family: $font-sans;
    color: $primary-color;
    transition: all $transition-duration $transition-easing;
    padding: $spacing-4;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-md;
}

// Menggunakan font cursive
.heading {
    font-family: $font-cursive;
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
}
```

### 3. Utility Classes

File `global.scss` menyediakan utility classes yang siap pakai:

```html
<!-- Typography -->
<h1 class="text-3xl font-bold text-primary">Judul</h1>
<p class="text-base font-normal text-gray-700">Paragraf</p>

<!-- Spacing -->
<div class="p-4 m-2">Content dengan padding dan margin</div>

<!-- Flexbox -->
<div class="flex items-center justify-between">Flex container</div>

<!-- Background dan Colors -->
<div class="bg-primary text-white p-4 rounded-lg">Card</div>
```

### 4. Custom Scrollbar

```html
<!-- Default scrollbar -->
<div class="scroll-container">Content yang bisa di-scroll</div>

<!-- Thin scrollbar -->
<div class="scroll-container scrollbar-thin">Content dengan scrollbar tipis</div>

<!-- Hidden scrollbar -->
<div class="scroll-container scrollbar-hide">Content tanpa scrollbar</div>

<!-- Colored scrollbar -->
<div class="scroll-container scrollbar-primary">Content dengan scrollbar primary</div>
```

## Variabel yang Tersedia

### Transitions
- `$transition-duration: 0.3s`
- `$transition-easing: cubic-bezier(0.4, 0, 0.2, 1)`

### Fonts
- `$font-sans: 'Arial', sans-serif`
- `$font-cursive: 'Pacifico', cursive`

### Colors
- Primary: `$primary-color`
- Secondary: `$secondary-color`
- Accent: `$accent-color`
- Success: `$success-color`
- Warning: `$warning-color`
- Error: `$error-color`
- Info: `$info-color`
- Gray scale: `$gray-50` sampai `$gray-900`

### Typography
- Font sizes: `$font-size-xs` sampai `$font-size-6xl`
- Font weights: `$font-weight-thin` sampai `$font-weight-black`
- Line heights: `$line-height-none` sampai `$line-height-loose`

### Spacing
- `$spacing-0` sampai `$spacing-32`

### Border Radius
- `$border-radius-none` sampai `$border-radius-full`

### Shadows
- `$shadow-sm` sampai `$shadow-2xl`
- `$shadow-inner`, `$shadow-none`

### Breakpoints
- `$breakpoint-sm: 640px`
- `$breakpoint-md: 768px`
- `$breakpoint-lg: 1024px`
- `$breakpoint-xl: 1280px`
- `$breakpoint-2xl: 1536px`

## Integrasi dengan Tailwind CSS

Styles SCSS ini bekerja bersama dengan Tailwind CSS yang sudah ada. Variabel SCSS dapat digunakan untuk:

1. **Custom Components**: Membuat komponen dengan styling yang konsisten
2. **Override Tailwind**: Menyesuaikan default Tailwind dengan brand colors
3. **Complex Animations**: Membuat animasi yang lebih kompleks dari yang disediakan Tailwind

## Best Practices

1. **Gunakan Variabel**: Selalu gunakan variabel untuk values yang berulang
2. **Modular Import**: Import hanya file yang dibutuhkan untuk performa yang lebih baik
3. **Consistent Naming**: Ikuti konvensi penamaan yang sudah ada
4. **Mobile First**: Gunakan breakpoints untuk responsive design
5. **Performance**: Hindari nested selectors yang terlalu dalam

## Contoh Implementasi di Svelte Component

```svelte
<script>
    // Component logic
</script>

<div class="card">
    <h2 class="card-title">Judul Card</h2>
    <p class="card-content">Konten card dengan styling custom</p>
    <button class="btn btn-primary">Action Button</button>
</div>

<style lang="scss">
    @import '../../../css/styles/_variables.scss';
    
    .card {
        background: $white;
        border-radius: $border-radius-lg;
        box-shadow: $shadow-md;
        padding: $spacing-6;
        transition: all $transition-duration $transition-easing;
        
        &:hover {
            box-shadow: $shadow-lg;
            transform: translateY(-2px);
        }
    }
    
    .card-title {
        font-family: $font-cursive;
        font-size: $font-size-2xl;
        font-weight: $font-weight-bold;
        color: $primary-color;
        margin-bottom: $spacing-4;
    }
    
    .card-content {
        font-family: $font-sans;
        font-size: $font-size-base;
        color: $gray-700;
        line-height: $line-height-relaxed;
        margin-bottom: $spacing-6;
    }
    
    .btn {
        font-family: $font-sans;
        font-weight: $font-weight-medium;
        padding: $spacing-3 $spacing-6;
        border-radius: $border-radius-md;
        border: none;
        cursor: pointer;
        transition: all $transition-duration $transition-easing;
        
        &.btn-primary {
            background-color: $primary-color;
            color: $white;
            
            &:hover {
                background-color: darken($primary-color, 10%);
                transform: translateY(-1px);
            }
        }
    }
</style>
```

## Troubleshooting

### Error: Cannot resolve SCSS imports
- Pastikan path import benar
- Periksa apakah file SCSS ada
- Restart Vite development server

### Variabel tidak terdefinisi
- Import `_variables.scss` di file yang menggunakan variabel
- Periksa nama variabel (case-sensitive)

### Styles tidak muncul
- Periksa apakah `global.scss` sudah diimport di `app.css`
- Clear browser cache
- Periksa console untuk error