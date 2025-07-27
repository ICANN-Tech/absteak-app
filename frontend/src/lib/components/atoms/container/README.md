# Container Component

Komponen Container yang dapat digunakan kembali untuk membuat kontainer dengan berbagai varian styling.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `Snippet` | - | Konten yang akan ditampilkan di dalam container |
| `variant` | `'default' \| 'elegant' \| 'minimal'` | `'elegant'` | Varian styling container |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Ukuran maksimal container |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'` | Padding internal container |
| `shadow` | `boolean` | `true` | Menampilkan shadow atau tidak |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'2xl'` | Border radius container |
| `border` | `boolean` | `true` | Menampilkan border atau tidak |
| `backdrop` | `boolean` | `true` | Menggunakan backdrop blur atau tidak |
| `class` | `string` | `''` | Kelas CSS tambahan |

## Variants

### Elegant (Default)
- Background: `bg-black/10` dengan backdrop blur
- Border: `border-white/20`
- Cocok untuk overlay di atas background image

### Default
- Background: `bg-white`
- Border: `border-gray-300`
- Cocok untuk konten utama

### Minimal
- Background: `bg-primary-700/20` dengan backdrop blur
- Border: `border-primary-600`
- Cocok untuk tema minimal

## Usage

```svelte
<script>
  import { Container } from '$lib/components/atoms';
</script>

<!-- Basic usage -->
<Container>
  <h2>Judul</h2>
  <p>Konten container</p>
</Container>

<!-- With custom props -->
<Container 
  variant="elegant" 
  size="lg" 
  padding="xl"
  shadow={true}
  rounded="2xl"
>
  <form>
    <!-- Form content -->
  </form>
</Container>

<!-- Minimal container -->
<Container 
  variant="minimal" 
  size="sm" 
  padding="md"
  border={false}
>
  <div>Minimal content</div>
</Container>
```

## Examples

### Form Container
```svelte
<Container variant="elegant" size="md" padding="lg">
  <div class="text-center mb-6">
    <h3 class="text-2xl font-bold text-white mb-2">Form Title</h3>
    <p class="text-gray-300">Form description</p>
  </div>
  <!-- Form fields -->
</Container>
```

### Card Container
```svelte
<Container variant="default" size="lg" padding="md" rounded="lg">
  <div class="space-y-4">
    <!-- Card content -->
  </div>
</Container>
```