# Datepicker Component

Komponen Datepicker yang reusable dengan styling konsisten dengan komponen Input lainnya.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | `undefined` | Nilai tanggal yang dipilih |
| `label` | `string` | `''` | Label untuk datepicker |
| `placeholder` | `string` | `'Pilih tanggal'` | Placeholder text |
| `variant` | `'default' \| 'elegant' \| 'minimal'` | `'default'` | Varian styling |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran komponen |
| `required` | `boolean` | `false` | Apakah field wajib diisi |
| `disabled` | `boolean` | `false` | Apakah komponen disabled |
| `error` | `string` | `''` | Pesan error |
| `success` | `string` | `''` | Pesan sukses |
| `name` | `string` | `''` | Nama field untuk form |
| `id` | `string` | `''` | ID unik untuk komponen |
| `inline` | `boolean` | `true` | Tampilkan datepicker inline |

## Variants

### Default
- Background putih dengan border abu-abu
- Cocok untuk tema terang

### Elegant
- Background gelap dengan backdrop blur
- Border abu-abu transparan
- Efek glow amber saat focus
- Cocok untuk tema gelap/premium

### Minimal
- Background primary transparan
- Border primary
- Efek minimal dan clean

## Features

- ✅ Styling konsisten dengan komponen Input
- ✅ Support untuk 3 varian (default, elegant, minimal)
- ✅ Label dengan indikator required
- ✅ Pesan error dan success
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Accessibility compliant

## Usage

```svelte
<script>
  import { Datepicker } from '$lib/components/atoms/datepicker';
  
  let selectedDate = undefined;
</script>

<!-- Basic usage -->
<Datepicker bind:value={selectedDate} />

<!-- With label and variant -->
<Datepicker 
  bind:value={selectedDate}
  label="Tanggal Reservasi"
  variant="elegant"
  required
/>

<!-- With error message -->
<Datepicker 
  bind:value={selectedDate}
  label="Tanggal"
  error="Tanggal harus diisi"
/>
```

## Styling

Komponen ini menggunakan konstanta styling dari `$lib/const/ui.ts` untuk memastikan konsistensi dengan komponen lain:

- `DATEPICKER_CONTAINER`: Styling container utama
- `DATEPICKER_CLASSES`: Styling untuk berbagai elemen datepicker
- `getDatepickerClasses()`: Helper function untuk generate classes
- `getDatepickerVariantClasses()`: Helper function untuk variant classes

## Dependencies

- `flowbite-svelte`: Library UI component
- `$lib/const/ui`: Konstanta styling internal