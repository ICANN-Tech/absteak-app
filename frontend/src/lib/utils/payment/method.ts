import type { PaymentMethod } from '$lib/types';
import { 
	CreditCardSolid, 
	WalletSolid,
	BuildingSolid,
	CashSolid
} from 'flowbite-svelte-icons';

/**
 * Get the appropriate icon component for a payment method type
 */
export function getMethodIcon(method: PaymentMethod) {
	switch (method.type) {
		case 'credit_card':
		case 'debit_card':
			return CreditCardSolid;
		case 'e_wallet':
			return WalletSolid;
		case 'bank_transfer':
			return BuildingSolid;
		case 'cash':
			return CashSolid;
		default:
			return CreditCardSolid;
	}
}

/**
 * Generate CSS classes for payment method styling based on state
 */
export function getMethodClasses(
	method: PaymentMethod, 
	isSelected: boolean, 
	disabled: boolean = false
): string {
	const baseClasses =
		'relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group';

	if (!method.available) {
		return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
	}

	if (disabled) {
		return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
	}

	if (isSelected) {
		return `${baseClasses} border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20 scale-[1.02]`;
	}

	return `${baseClasses} border-gray-700 bg-white/5 hover:border-orange-400 hover:bg-orange-400/5 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-400/10`;
}

/**
 * Format fee amount for display
 */
export function formatFee(fee: number | undefined): string {
	if (!fee || fee === 0) return 'Gratis';
	return `Rp ${fee.toLocaleString('id-ID')}`;
}

/**
 * Get localized label for payment method type
 */
export function getTypeLabel(type: string): string {
	switch (type) {
		case 'credit_card':
			return 'Kartu Kredit';
		case 'debit_card':
			return 'Kartu Debit';
		case 'e_wallet':
			return 'E-Wallet';
		case 'bank_transfer':
			return 'Transfer Bank';
		case 'cash':
			return 'Tunai';
		default:
			return 'Lainnya';
	}
}

/**
 * Group payment methods by their type
 */
export function groupMethodsByType(methods: PaymentMethod[]): Record<string, PaymentMethod[]> {
	return methods.reduce((acc, method) => {
		if (!acc[method.type]) {
			acc[method.type] = [];
		}
		acc[method.type].push(method);
		return acc;
	}, {} as Record<string, PaymentMethod[]>);
}

/**
 * Check if a payment method is selected
 */
export function isMethodSelected(method: PaymentMethod, selectedMethod: PaymentMethod | null): boolean {
	return selectedMethod?.id === method.id;
}

/**
 * Default payment methods data
 */
export const defaultPaymentMethods: PaymentMethod[] = [
	{
		id: 'credit-visa',
		name: 'Visa Credit Card',
		type: 'credit_card',
		icon: 'visa',
		description: 'Pembayaran dengan kartu kredit Visa',
		fee: 0,
		available: true,
		processingTime: 'Instant'
	},
	{
		id: 'credit-mastercard',
		name: 'Mastercard',
		type: 'credit_card',
		icon: 'mastercard',
		description: 'Pembayaran dengan kartu kredit Mastercard',
		fee: 0,
		available: true,
		processingTime: 'Instant'
	},
	{
		id: 'debit-bca',
		name: 'BCA Debit',
		type: 'debit_card',
		icon: 'bca',
		description: 'Pembayaran dengan kartu debit BCA',
		fee: 2500,
		available: true,
		processingTime: 'Instant'
	},
	{
		id: 'ewallet-gopay',
		name: 'GoPay',
		type: 'e_wallet',
		icon: 'gopay',
		description: 'Pembayaran dengan GoPay e-wallet',
		fee: 0,
		available: true,
		processingTime: 'Instant'
	},
	{
		id: 'ewallet-ovo',
		name: 'OVO',
		type: 'e_wallet',
		icon: 'ovo',
		description: 'Pembayaran dengan OVO e-wallet',
		fee: 0,
		available: true,
		processingTime: 'Instant'
	},
	{
		id: 'ewallet-dana',
		name: 'DANA',
		type: 'e_wallet',
		icon: 'dana',
		description: 'Pembayaran dengan DANA e-wallet',
		fee: 0,
		available: true,
		processingTime: 'Instant'
	},
	{
		id: 'bank-bca',
		name: 'Bank Transfer BCA',
		type: 'bank_transfer',
		icon: 'bca',
		description: 'Transfer bank melalui BCA',
		fee: 6500,
		available: true,
		processingTime: '1-3 menit'
	},
	{
		id: 'bank-mandiri',
		name: 'Bank Transfer Mandiri',
		type: 'bank_transfer',
		icon: 'mandiri',
		description: 'Transfer bank melalui Mandiri',
		fee: 6500,
		available: true,
		processingTime: '1-3 menit'
	},
	{
		id: 'cash-payment',
		name: 'Bayar di Tempat',
		type: 'cash',
		icon: 'cash',
		description: 'Pembayaran tunai di restoran',
		fee: 0,
		available: true,
		processingTime: 'Saat kedatangan'
	}
];