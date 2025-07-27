import { writable, derived } from 'svelte/store'

export type ReservationForm = {
  name: string
  email: string
  phone: string
  person: string
  kids: string
  date: string
  time: string
  notes: string
}

export const reservationForm = writable<ReservationForm>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
    person: '',
    kids: ''
})

// Validasi sederhana
function validate(form: ReservationForm) {
  const errors: Partial<Record<keyof ReservationForm, string>> = {}

  if (!form.name.trim()) errors.name = 'Nama wajib diisi'
  if (!form.email.includes('@')) errors.email = 'Email tidak valid'
  if (!form.phone.match(/^[0-9]{10,}$/)) errors.phone = 'Nomor telepon tidak valid'
  if (!form.date) errors.date = 'Tanggal harus dipilih'
  if (!form.time) errors.time = 'Waktu harus dipilih'

  return errors
}

// Store turunan berisi error
export const reservationErrors = derived(reservationForm, ($form) => validate($form))
