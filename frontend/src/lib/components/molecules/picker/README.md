# TimePicker Component

Komponen TimePicker yang reusable untuk memilih waktu dari slot-slot yang tersedia. Komponen ini dirancang dengan styling yang konsisten dengan komponen UI lainnya dan mendukung berbagai varian tampilan.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timeSlots` | `TimeSlot[]` | `[]` | Array dari slot waktu yang tersedia |
| `selectedTime` | `string` | `''` | Waktu yang dipilih (two-way binding) |
| `label` | `string` | `''` | Label untuk time picker |
| `variant` | `'default' \| 'elegant' \| 'minimal'` | `'default'` | Varian styling |
| `columns` | `number` | `4` | Jumlah kolom dalam grid |
| `required` | `boolean` | `false` | Apakah field ini wajib diisi |
| `disabled` | `boolean` | `false` | Apakah time picker dinonaktifkan |
| `error` | `string` | `''` | Pesan error |
| `success` | `string` | `''` | Pesan sukses |
| `id` | `string` | `''` | ID untuk elemen |
| `name` | `string` | `''` | Nama untuk hidden input (form submission) |

## TimeSlot Interface

```typescript
interface TimeSlot {
  time: string;        // Format waktu (contoh: "17:00")
  available: boolean;  // Apakah slot tersedia
  label?: string;      // Label tambahan (opsional)
}
```

## Varian Styling

### Default
- Background: Semi-transparan dengan blur effect
- Border: Subtle dengan warna primary
- Hover: Smooth transition ke primary color

### Elegant
- Background: Lebih gelap dengan blur effect yang kuat
- Border: Warna primary yang lebih menonjol
- Hover: Elegant transition dengan shadow

### Minimal
- Background: Minimal dengan border tipis
- Clean dan simple appearance
- Subtle hover effects

## Events

Komponen ini mengirimkan custom event `timeSelected` ketika waktu dipilih:

```javascript
// Event detail
{
  time: string,    // Waktu yang dipilih
  slot: TimeSlot   // Object slot lengkap
}
```

## Contoh Penggunaan

### Basic Usage
```svelte
<script>
  import { TimePicker } from '$lib/components/molecules';
  
  let selectedTime = '';
  const timeSlots = [
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: false },
    { time: '18:30', available: true }
  ];
</script>

<TimePicker
  {timeSlots}
  bind:selectedTime
  label="Pilih Waktu"
/>
```

### With Variants
```svelte
<!-- Elegant variant -->
<TimePicker
  {timeSlots}
  bind:selectedTime
  variant="elegant"
  label="Waktu Reservasi"
  columns={3}
/>

<!-- Minimal variant -->
<TimePicker
  {timeSlots}
  bind:selectedTime
  variant="minimal"
  columns={5}
/>
```

### With Error/Success States
```svelte
<TimePicker
  {timeSlots}
  bind:selectedTime
  label="Pilih Waktu"
  error="Waktu harus dipilih"
  required
/>

<TimePicker
  {timeSlots}
  bind:selectedTime
  label="Pilih Waktu"
  success="Waktu berhasil dipilih"
/>
```

### Form Integration
```svelte
<form>
  <TimePicker
    {timeSlots}
    bind:selectedTime
    name="booking_time"
    label="Waktu Reservasi"
    required
  />
  <!-- Hidden input akan otomatis dibuat untuk form submission -->
</form>
```

## Fitur Utama

- **Responsive Grid**: Jumlah kolom dapat disesuaikan
- **Accessibility**: Support untuk screen readers dan keyboard navigation
- **State Management**: Otomatis menangani state available/selected/unavailable
- **Form Integration**: Hidden input untuk form submission
- **Custom Events**: Event listener untuk integrasi dengan komponen lain
- **Consistent Styling**: Menggunakan konstanta dari `ui.ts`
- **Type Safety**: Full TypeScript support

## Dependencies

- `$lib/const/ui.ts` - Untuk styling constants dan helper functions
- Tailwind CSS - Untuk styling classes