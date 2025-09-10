# Translation Utility Documentation

Komprehensif dokumentasi untuk sistem translasi ABSteak App yang mendukung translasi namespace-based dan configuration-based dengan dukungan multilingual.

## Overview

Sistem translasi ini menyediakan dua pendekatan utama:
1. **Namespace-based Translation**: Translasi tradisional menggunakan file JSON
2. **Configuration-based Translation**: Translasi langsung dari data konfigurasi multilingual

## Functions

### `createMultilingualTranslation<T>(config, fields?)`

Fungsi utama yang menangani kedua jenis translasi dengan dukungan type safety dan backward compatibility.

#### Parameters

- `config`: `MultilingualTranslationConfig<T> | string`
  - Jika string: namespace untuk translasi tradisional
  - Jika object: konfigurasi untuk translasi data-based
- `fields?`: `string[]` - Field yang akan ditranslasi (opsional jika menggunakan namespace)

#### Configuration Object

```typescript
interface MultilingualTranslationConfig<T = any> {
  data: T[] | T | (() => T[] | T);     // Data sumber
  fields: string[];                    // Field yang ditranslasi
  namespace?: string;                  // Namespace fallback
  fallbackLocale?: LocaleEnum;         // Locale fallback
}
```

#### Return Value

Mengembalikan Svelte store yang berisi fungsi translasi:

```typescript
// Untuk namespace-based
(key: string, fallback?: any, variables?: TranslationVariables) => string

// Untuk data-based
() => MultilingualTranslationResult<T>
```

## Usage Examples

### 1. Namespace-based Translation (Traditional)

```typescript
import { createMultilingualTranslation } from '@Utils/Global/Translation';

// Menggunakan namespace
const t = createMultilingualTranslation('common');

// Dalam template Svelte
<h1>{$t('greeting')}</h1>
<p>{$t('welcome.message', 'Welcome!', { name: 'John' })}</p>
```

### 2. Configuration-based Translation

#### Static Data

```typescript
const menuItems = [
  {
    id: 1,
    name: '{"en":"Beef Steak","id":"Steak Sapi"}',
    description: '{"en":"Premium beef","id":"Daging sapi premium"}'
  }
];

const menuTranslation = createMultilingualTranslation({
  data: menuItems,
  fields: ['name', 'description']
});

// Hasil otomatis ditranslasi sesuai locale aktif
const translatedMenu = $menuTranslation();
```

#### Dynamic Data (Inertia Props)

```typescript
import { page } from '@inertiajs/svelte';

const experienceTranslation = createMultilingualTranslation({
  data: () => $page.props.configurations?.experience,
  fields: ['title', 'subtitle', 'content'],
  namespace: 'experience' // fallback namespace
});

const translatedExperience = $experienceTranslation();
```

#### Single Object Translation

```typescript
const configTranslation = createMultilingualTranslation({
  data: () => $page.props.configurations?.hero,
  fields: ['title', 'subtitle']
});

const hero = $configTranslation();
// hero.title dan hero.subtitle sudah ditranslasi
```

### 3. Mixed Usage (Namespace + Data)

```typescript
const translation = createMultilingualTranslation({
  data: () => $page.props.configurations?.menu,
  fields: ['name', 'description'],
  namespace: 'menu' // untuk fallback translations
});

// Data-based translation
const translatedData = $translation();

// Namespace-based translation
const pageTitle = $translation('page.title');
```

## Advanced Features

### 1. Type Safety

```typescript
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

const menuTranslation = createMultilingualTranslation<MenuItem[]>({
  data: menuItems,
  fields: ['name', 'description']
});

// TypeScript akan memvalidasi tipe return
const menu: MenuItem[] = $menuTranslation();
```

### 2. Fallback Handling

```typescript
const translation = createMultilingualTranslation({
  data: configData,
  fields: ['title'],
  fallbackLocale: LocaleEnum.En // fallback ke English
});
```

### 3. Variable Interpolation

```typescript
const t = createMultilingualTranslation('common');

// Template: "Hello {name}, you have {count} messages"
const message = $t('notification.message', '', {
  name: 'John',
  count: 5
});
// Result: "Hello John, you have 5 messages"
```

## Data Format

### Multilingual JSON Format

Data multilingual harus dalam format JSON string atau object:

```json
{
  "en": "English Text",
  "id": "Teks Indonesia"
}
```

### Database Storage

```sql
-- Contoh struktur tabel
CREATE TABLE configurations (
  id UUID PRIMARY KEY,
  key VARCHAR(255),
  value TEXT, -- JSON string multilingual
  group VARCHAR(100)
);

-- Contoh data
INSERT INTO configurations (key, value, group) VALUES (
  'hero.title',
  '{"en":"Welcome to ABSteak","id":"Selamat Datang di ABSteak"}',
  'homepage'
);
```

## Migration Guide

### From `createTranslationStore`

```typescript
// Sebelum
const t = createTranslationStore('common');

// Sesudah (backward compatible)
const t = createMultilingualTranslation('common');
// atau
const t = createMultilingualTranslation({
  data: [],
  fields: [],
  namespace: 'common'
});
```

### From `createMultilingualStore`

```typescript
// Sebelum
const translation = createMultilingualStore('experience.general', ['title', 'subtitle']);

// Sesudah
const translation = createMultilingualTranslation({
  data: () => $page.props.configurations?.experience,
  fields: ['title', 'subtitle'],
  namespace: 'experience'
});
```

## Performance Considerations

1. **Reactive Updates**: Menggunakan Svelte derived stores untuk update otomatis
2. **Lazy Loading**: Translation files dimuat sesuai kebutuhan
3. **Caching**: Hasil translasi di-cache untuk performa optimal
4. **Memory Efficient**: Hanya menyimpan data yang diperlukan

## Error Handling

```typescript
// Graceful fallback untuk data yang rusak
const translation = createMultilingualTranslation({
  data: () => {
    try {
      return $page.props.configurations?.menu;
    } catch (error) {
      console.warn('Failed to load menu data:', error);
      return [];
    }
  },
  fields: ['name', 'description']
});
```

## Best Practices

1. **Consistent Field Names**: Gunakan nama field yang konsisten
2. **Fallback Values**: Selalu sediakan fallback untuk data penting
3. **Type Definitions**: Gunakan TypeScript interfaces untuk type safety
4. **Error Boundaries**: Implementasikan error handling yang proper
5. **Performance**: Hindari nested reactive calls yang berlebihan

## Troubleshooting

### Common Issues

1. **Data tidak muncul**
   - Periksa format JSON multilingual
   - Pastikan field names sesuai
   - Cek console untuk error parsing

2. **Fallback tidak bekerja**
   - Verifikasi fallbackLocale setting
   - Pastikan namespace file tersedia

3. **Type errors**
   - Gunakan generic types yang sesuai
   - Periksa interface definitions

### Debug Mode

```typescript
// Enable debug logging
const translation = createMultilingualTranslation({
  data: () => {
    const data = $page.props.configurations?.menu;
    console.log('Translation data:', data);
    return data;
  },
  fields: ['name', 'description']
});
```

## API Reference

### Types

```typescript
interface MultilingualTranslationConfig<T = any> {
  data: T[] | T | (() => T[] | T);
  fields: string[];
  namespace?: string;
  fallbackLocale?: LocaleEnum;
}

type MultilingualTranslationResult<T> = T extends any[] ? T : T;

interface TranslationVariables {
  [key: string]: string | number;
}
```

### Functions

- `createMultilingualTranslation<T>(config, fields?)`: Main translation function
- `createTranslationStore(namespace)`: Legacy namespace-based function
- `interpolateVariables(text, variables)`: Variable interpolation helper

---

**Note**: Dokumentasi ini akan terus diperbarui seiring dengan pengembangan fitur baru.