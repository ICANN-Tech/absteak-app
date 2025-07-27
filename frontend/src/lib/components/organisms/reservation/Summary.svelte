<script context="module" lang="ts">
  // Types
  export interface ReservationData {
    date?: Date | string;
    time?: string;
    location?: string;
    partySize?: number;
    contactPerson?: string;
    contactPhone?: string;
  }

  export interface Branch {
    value: string;
    name: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import { CalendarMonthSolid, ClockSolid, MapPinSolid, UsersSolid } from 'flowbite-svelte-icons';
  import { getReservationSummaryClasses, type UI_VARIANTS } from '$lib/const/ui';

  // Props
  export let reservationData: ReservationData = {};
  export let branches: Branch[] = [];
  export let variant: keyof typeof UI_VARIANTS = 'elegant';
  export let title: string = 'Ringkasan Reservasi';

  // Reactive classes
  $: classes = getReservationSummaryClasses(variant);

  // Helper functions
  function formatDate(date: Date | string | undefined): string {
    if (!date) return 'Belum dipilih';
    
    if (typeof date === 'string') return date;
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  function getLocationName(locationValue: string | undefined): string {
    if (!locationValue) return '';
    const branch = branches.find(b => b.value === locationValue);
    return branch?.name || locationValue;
  }

  function formatPartySize(size: number | undefined): string {
    if (!size) return '';
    return `${size} ${size > 1 ? 'Persons' : 'Person'}`;
  }
</script>

<div class={classes.container}>
  <!-- Header -->
  <div class={classes.header}>
    {title}
  </div>

  <!-- Info Utama -->
  <div class={classes.grid}>
    <div class={classes.item}>
      <CalendarMonthSolid class={classes.icon} />
      <span class={classes.text}>{formatDate(reservationData.date)}</span>
    </div>
    <div class={classes.item}>
      <ClockSolid class={classes.icon} />
      <span class={classes.text}>{reservationData.time || ''}</span>
    </div>
    <div class={classes.item}>
      <MapPinSolid class={classes.icon} />
      <span class={classes.text}>{getLocationName(reservationData.location)}</span>
    </div>
    <div class={classes.item}>
      <UsersSolid class={classes.icon} />
      <span class={classes.text}>{formatPartySize(reservationData.partySize)}</span>
    </div>
  </div>

  <!-- Informasi Kontak -->
  {#if reservationData.contactPerson || reservationData.contactPhone}
    <div class={classes.contact.container}>
      {#if reservationData.contactPerson}
        <div>
          <div class={classes.contact.label}>Contact Person</div>
          <div class={classes.contact.value}>{reservationData.contactPerson}</div>
        </div>
      {/if}
      {#if reservationData.contactPhone}
        <div>
          <div class={classes.contact.label}>No. Telepon</div>
          <div class={classes.contact.value}>{reservationData.contactPhone}</div>
        </div>
      {/if}
    </div>
  {/if}
</div>