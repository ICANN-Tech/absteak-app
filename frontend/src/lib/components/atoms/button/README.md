# Button Atom Component

Komponen Button atom yang dapat digunakan kembali dengan dukungan untuk circle button.

## Props

### Basic Props
- `variant`: 'primary' | 'danger' | 'success' | 'warning' | 'info' (default: 'primary')
- `type`: string (default: 'button')
- `disabled`: boolean (default: false)
- `className`: string (default: '')
- `href`: string | undefined (untuk link button)

### Circle Button Props
- `pill`: boolean (default: false) - Membuat button dengan bentuk pill/rounded
- `circle`: boolean (default: false) - Membuat button dengan bentuk circle sempurna
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md') - Ukuran untuk circle button

## Circle Button Sizes
- `xs`: 32x32px (w-8 h-8)
- `sm`: 40x40px (w-10 h-10)
- `md`: 48x48px (w-12 h-12)
- `lg`: 64x64px (w-16 h-16)
- `xl`: 80x80px (w-20 h-20)

## Usage Examples

### Regular Button
```svelte
<Button variant="primary">Click Me</Button>
```

### Pill Button
```svelte
<Button variant="primary" pill>Pill Button</Button>
```

### Circle Button
```svelte
<Button variant="primary" circle size="lg">
  <Icon />
</Button>
```

### Circle Button with Custom Classes
```svelte
<Button 
  variant="primary" 
  circle 
  size="md"
  className="shadow-lg hover:scale-110 transition-transform"
>
  <SendIcon />
</Button>
```

## Implementation in ChatBotFAB

Komponen ini telah diimplementasikan di ChatBotFAB untuk:
1. FAB button utama (size="lg")
2. Send button di input area (size="md")

Kedua button menggunakan `circle={true}` untuk bentuk circle yang sempurna.