
export interface PaymentMethod {
	id: string;
	name: string;
	type: 'credit_card' | 'debit_card' | 'e_wallet' | 'bank_transfer' | 'cash';
	icon: string;
	description: string;
	fee?: number;
	available: boolean;
	processingTime?: string;
}

export type PaymentMethods = PaymentMethod[]