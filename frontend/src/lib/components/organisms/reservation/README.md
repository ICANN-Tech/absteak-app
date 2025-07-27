# ReservationSummary Component

Komponen reusable untuk menampilkan ringkasan reservasi dengan styling yang konsisten dan fleksibel.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `reservationData` | `ReservationData` | `{}` | Data reservasi yang akan ditampilkan |
| `branches` | `Branch[]` | `[]` | Daftar cabang untuk mapping lokasi |
| `variant` | `'elegant' \| 'default' \| 'minimal'` | `'elegant'` | Varian styling |
| `title` | `string` | `'Ringkasan Reservasi'` | Judul header |

## Types

### ReservationData
```typescript
interface ReservationData {
  date?: Date | string;
  time?: string;
  location?: string;
  partySize?: number;
  contactPerson?: string;
  contactPhone?: string;
}
```

### Branch
```typescript
interface Branch {
  value: string;
  name: string;
  disabled?: boolean;
}
```

## Styling Variants

### Elegant (Default)
- Background: Semi-transparent black dengan backdrop blur
- Border: Primary color dengan opacity
- Text: Orange accent untuk header dan contact info
- Icons: Primary color

### Default
- Background: White dengan subtle shadow
- Border: Gray
- Text: Standard dark colors
- Icons: Gray

### Minimal
- Background: Light gray
- Border: Minimal
- Text: Muted colors
- Icons: Muted

## Features

- **Responsive Design**: Grid layout yang menyesuaikan dengan ukuran layar
- **Icon Integration**: Menggunakan Flowbite Svelte Icons
- **Date Formatting**: Format tanggal Indonesia otomatis
- **Location Mapping**: Mapping value lokasi ke nama cabang
- **Conditional Rendering**: Hanya menampilkan informasi kontak jika tersedia
- **Type Safety**: Full TypeScript support

## Usage

### Basic Usage
```svelte
<script>
  import { ReservationSummary } from '$lib/components/organisms';
  
  const reservationData = {
    date: new Date(),
    time: '19:00',
    location: 'jakarta-pusat',
    partySize: 4,
    contactPerson: 'Bapak Didi',
    contactPhone: '+62 812-3456-7890'
  };
  
  const branches = [
    { value: 'jakarta-pusat', name: 'Jakarta Pusat - Plaza Indonesia' },
    { value: 'jakarta-selatan', name: 'Jakarta Selatan - Senayan City' }
  ];
</script>

<ReservationSummary {reservationData} {branches} />
```

### With Different Variants
```svelte
<!-- Elegant variant (default) -->
<ReservationSummary {reservationData} {branches} variant="elegant" />

<!-- Default variant -->
<ReservationSummary {reservationData} {branches} variant="default" />

<!-- Minimal variant -->
<ReservationSummary {reservationData} {branches} variant="minimal" />
```

### Custom Title
```svelte
<ReservationSummary 
  {reservationData} 
  {branches} 
  title="Booking Summary"
/>
```

## Dependencies

- `flowbite-svelte-icons` - Untuk icon
- `$lib/const/ui` - Untuk styling constants dan helper functions

## Styling

Styling dikontrol melalui constants di `$lib/const/ui.ts`:
- `RESERVATION_SUMMARY` - Base styling constants
- `getReservationSummaryClasses()` - Helper function untuk generate classes