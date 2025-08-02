# Chat Organism Component

Komponen Chat adalah organisme yang dapat digunakan kembali untuk menampilkan percakapan antara pengguna dan bot dengan fitur kustomisasi yang lengkap.

## Fitur

- ✅ **Reusable**: Dapat digunakan di berbagai bagian aplikasi
- ✅ **Customizable**: Styling yang dapat disesuaikan untuk setiap elemen
- ✅ **Type Safe**: Menggunakan TypeScript dengan type definitions
- ✅ **Interactive**: Event handlers untuk klik pesan dan avatar
- ✅ **Auto Scroll**: Otomatis scroll ke bawah saat ada pesan baru
- ✅ **Responsive**: Desain yang responsif untuk berbagai ukuran layar
- ✅ **Animated**: Animasi smooth untuk setiap pesan baru

## Props

### Basic Props
- `messages: MessageType[]` - Array pesan untuk ditampilkan
- `containerClass: string` - Kelas CSS untuk container utama
- `userMessageClass: string` - Kelas CSS untuk pesan pengguna
- `botMessageClass: string` - Kelas CSS untuk pesan bot

### Bot Avatar Configuration
- `botAvatarConfig: BotAvatarConfig` - Konfigurasi avatar bot
  - `type: 'icon' | 'image'` - Tipe avatar (icon atau gambar)
  - `icon?: string` - Nama icon (jika menggunakan icon)
  - `imageUrl?: string` - URL gambar (jika menggunakan image)
  - `backgroundColor?: string` - Kelas CSS untuk background color
  - `iconColor?: string` - Kelas CSS untuk warna icon

### Animation & Display
- `showTimestamp: boolean` - Tampilkan timestamp (default: false)
- `animationDelay: number` - Delay animasi dalam ms (default: 50)
- `animationDuration: number` - Durasi animasi dalam ms (default: 300)
- `maxMessageWidth: string` - Lebar maksimum pesan (default: '85%')

## Events

- `on:messageClick` - Dipanggil saat pesan diklik
- `on:avatarClick` - Dipanggil saat avatar bot diklik

## Types

```typescript
export type MessageType = {
  from: 'user' | 'bot';
  text: string;
  timestamp?: Date;
  id?: string;
};

export type BotAvatarConfig = {
  type: 'icon' | 'image';
  icon?: string;
  imageUrl?: string;
  backgroundColor?: string;
  iconColor?: string;
};
```

## Contoh Penggunaan

### Basic Usage
```svelte
<script>
  import { Chat } from '$lib/components/organisms';
  
  let messages = [
    { from: 'bot', text: 'Hello! How can I help you?' },
    { from: 'user', text: 'I need help with my order' }
  ];
</script>

<Chat {messages} />
```

### Advanced Usage dengan Kustomisasi
```svelte
<script>
  import { Chat, type MessageType } from '$lib/components/organisms';
  
  let messages: MessageType[] = [
    { 
      from: 'bot', 
      text: 'Welcome to our restaurant!',
      timestamp: new Date(),
      id: '1'
    }
  ];
  
  function handleMessageClick(event) {
    console.log('Message clicked:', event.detail);
  }
  
  function handleAvatarClick(event) {
    console.log('Avatar clicked:', event.detail);
  }
</script>

<Chat 
  {messages}
  containerClass="h-96 p-4 bg-gray-50 rounded-lg overflow-y-auto"
  botAvatarConfig={{
    type: 'icon',
    backgroundColor: 'bg-blue-500',
    iconColor: 'text-white'
  }}
  userMessageClass="bg-blue-100 text-blue-900 p-3 rounded-lg"
  botMessageClass="bg-gray-200 text-gray-900 p-3 rounded-lg"
  showTimestamp={true}
  animationDelay={100}
  animationDuration={400}
  on:messageClick={handleMessageClick}
  on:avatarClick={handleAvatarClick}
/>
```

### Implementasi di ChatBotFAB
```svelte
<Chat 
  {messages}
  containerClass="flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-gradient-to-b from-primary-50 to-white"
  botAvatarConfig={{
    type: 'icon',
    icon: 'lightning',
    backgroundColor: 'bg-gradient-to-br from-primary-500 to-primary-600',
    iconColor: 'text-white'
  }}
  userMessageClass="px-4 py-3 rounded-2xl rounded-tr-md mb-1 max-w-[85%] text-sm bg-white text-gray-800 shadow-lg border border-primary-200 backdrop-blur-sm"
  botMessageClass="px-4 py-3 rounded-2xl rounded-tl-md mb-1 text-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg border border-primary-400"
  animationDelay={50}
  animationDuration={300}
  on:messageClick={(e) => console.log('Message clicked:', e.detail)}
  on:avatarClick={(e) => console.log('Avatar clicked:', e.detail)}
/>
```

## Exported Functions

- `scrollToBottom()` - Scroll container ke bagian bawah

## Styling

Komponen ini menggunakan custom scrollbar styling dan animasi yang smooth. Semua styling dapat dikustomisasi melalui props className.

## Atomic Design

Komponen ini adalah bagian dari **Organisms** dalam atomic design pattern, yang berarti:
- Terdiri dari kombinasi atoms dan molecules
- Memiliki fungsionalitas yang kompleks dan lengkap
- Dapat digunakan kembali di berbagai bagian aplikasi
- Memiliki state dan logic sendiri