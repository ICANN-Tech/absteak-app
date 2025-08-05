/**
 * @fileoverview Payment Service for Reservation Module
 * @description Manages payment method selection, validation, and related operations
 * @author ABSteak Development Team
 * @version 1.0.0
 */

import { get } from 'svelte/store';
import { paymentFormStore } from '../stores/form/payment';
import type { PaymentMethod } from '$lib/types';
import { defaultPaymentMethods } from '$lib/utils/payment/method';

/**
 * Payment Service Class
 * Handles all payment-related operations for the reservation form
 */
export class PaymentService {
	/**
	 * Get selected payment method
	 */
	static getSelectedPaymentMethod(): PaymentMethod | null {
		const formData = get(paymentFormStore);
		return formData.data.selectedMethod;
	}

	/**
	 * Get available payment methods
	 */
	static async getAvailablePaymentMethods(): Promise<PaymentMethod[]> {
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 100));
			
			// Filter only available methods
			return defaultPaymentMethods.filter(method => method.available);
		} catch (err) {
			console.error('Error getting available payment methods:', err);
			return [];
		}
	}

	/**
	 * Select a payment method
	 */
	static selectPaymentMethod(method: PaymentMethod | null): boolean {
		try {
			if (!method) {
				console.warn('Cannot select payment method: method is required');
				return false;
			}

			if (!method.available) {
				console.warn(`Cannot select payment method: ${method.name} is not available`);
				return false;
			}

			paymentFormStore.setPaymentMethod(method);
			console.log(`Payment method selected: ${method.name}`);
			return true;
		} catch (err) {
			console.error('Error selecting payment method:', err);
			return false;
		}
	}

	/**
	 * Handle payment method selection with validation
	 */
	static handlePaymentMethodSelection(method: PaymentMethod): boolean {
		try {
			// Validate payment method availability
			if (!method.available) {
				console.warn(`Payment method ${method.name} is not available for selection`);
				return false;
			}

			// Select the payment method
			const success = this.selectPaymentMethod(method);
			
			if (success) {
				// Mark payment method field as touched
				paymentFormStore.touchField('selectedMethod');
			}

			return success;
		} catch (err) {
			console.error('Error handling payment method selection:', err);
			return false;
		}
	}

	/**
	 * Clear payment method selection
	 */
	static clearPaymentMethodSelection(): void {
		try {
			paymentFormStore.setPaymentMethod(null);
			console.log('Payment method selection cleared');
		} catch (err) {
			console.error('Error clearing payment method selection:', err);
		}
	}

	/**
	 * Get payment state snapshot
	 */
	static getPaymentState() {
		const selectedMethod = this.getSelectedPaymentMethod();
		const formData = get(paymentFormStore);
		return {
			selectedMethod,
			isSelected: !!selectedMethod,
			isAvailable: selectedMethod?.available ?? false,
			totalAmount: formData.data.totalAmount,
			promoCode: formData.data.promoCode,
			agreeToTerms: formData.data.agreeToTerms
		};
	}

	/**
	 * Validate payment method selection
	 */
	static validatePaymentMethodSelection(): boolean {
		try {
			const selectedMethod = this.getSelectedPaymentMethod();
			
			if (!selectedMethod) {
				console.warn('Payment method validation failed: no method selected');
				return false;
			}

			if (!selectedMethod.available) {
				console.warn('Payment method validation failed: selected method is not available');
				return false;
			}

			return true;
		} catch (err) {
			console.error('Error validating payment method selection:', err);
			return false;
		}
	}

	/**
	 * Validate promo code
	 */
	static async validatePromoCode(code: string): Promise<{ valid: boolean; discount?: number; message?: string }> {
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// Mock validation logic
			const validCodes = {
				'WELCOME10': { discount: 10, message: 'Selamat datang! Diskon 10%' },
				'SAVE20': { discount: 20, message: 'Hemat 20% untuk pemesanan ini' },
				'NEWUSER': { discount: 15, message: 'Diskon khusus pengguna baru 15%' }
			};

			const promoData = validCodes[code.toUpperCase() as keyof typeof validCodes];
			
			if (promoData) {
				return {
					valid: true,
					discount: promoData.discount,
					message: promoData.message
				};
			}

			return {
				valid: false,
				message: 'Kode promo tidak valid atau sudah kadaluarsa'
			};
		} catch (err) {
			console.error('Error validating promo code:', err);
			return {
				valid: false,
				message: 'Terjadi kesalahan saat memvalidasi kode promo'
			};
		}
	}

	/**
	 * Calculate total amount including fees and discounts
	 */
	static calculateTotalAmount(baseAmount: number, adminFee: number = 0, discountPercent: number = 0): number {
		try {
			const discountAmount = (baseAmount * discountPercent) / 100;
			const subtotal = baseAmount - discountAmount;
			return subtotal + adminFee;
		} catch (err) {
			console.error('Error calculating total amount:', err);
			return baseAmount;
		}
	}

	/**
	 * Format currency for display
	 */
	static formatCurrency(amount: number): string {
		try {
			return new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			}).format(amount);
		} catch (err) {
			console.error('Error formatting currency:', err);
			return `Rp ${amount.toLocaleString()}`;
		}
	}

	/**
	 * Process payment
	 */
	static async processPayment(paymentData: any): Promise<{ success: boolean; transactionId?: string; message?: string }> {
		try {
			// Simulate payment processing
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Mock payment result
			const success = Math.random() > 0.1; // 90% success rate for demo
			
			if (success) {
				return {
					success: true,
					transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
					message: 'Pembayaran berhasil diproses'
				};
			} else {
				return {
					success: false,
					message: 'Pembayaran gagal. Silakan coba lagi atau gunakan metode pembayaran lain.'
				};
			}
		} catch (err) {
			console.error('Payment processing error:', err);
			return {
				success: false,
				message: 'Terjadi kesalahan saat memproses pembayaran'
			};
		}
	}

	/**
	 * Get payment method by ID
	 */
	static async getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
		try {
			const methods = await this.getAvailablePaymentMethods();
			return methods.find(method => method.id === id) || null;
		} catch (err) {
			console.error('Error getting payment method by ID:', err);
			return null;
		}
	}

	/**
	 * Check if payment method supports installments
	 */
	static supportsInstallments(method: PaymentMethod): boolean {
		try {
			return method.type === 'credit_card' && method.available;
		} catch (err) {
			console.error('Error checking installment support:', err);
			return false;
		}
	}

	/**
	 * Get estimated processing time for payment method
	 */
	static getProcessingTime(method: PaymentMethod): string {
		try {
			return method.processingTime || 'Instan';
		} catch (err) {
			console.error('Error getting processing time:', err);
			return 'Tidak diketahui';
		}
	}

	/**
	 * Validate payment form data
	 */
	static validatePaymentData(data: any): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		try {
			if (!data.selectedMethod) {
				errors.push('Metode pembayaran harus dipilih');
			}

			if (!data.agreeToTerms) {
				errors.push('Anda harus menyetujui syarat dan ketentuan');
			}

			if (data.totalAmount <= 0) {
				errors.push('Total pembayaran tidak valid');
			}

			return {
				valid: errors.length === 0,
				errors
			};
		} catch (err) {
			console.error('Error validating payment data:', err);
			return {
				valid: false,
				errors: ['Terjadi kesalahan saat memvalidasi data pembayaran']
			};
		}
	}

	/**
	 * Handle keyboard navigation for payment method selection
	 */
	static handleKeyboardNavigation(event: KeyboardEvent): boolean {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				this.clearPaymentMethodSelection();
				return true;
			default:
				return false;
		}
	}

	/**
	 * Event handler for payment method selection from component
	 */
	static handlePaymentMethodSelected(event: CustomEvent<PaymentMethod>): void {
		const method = event.detail;
		this.handlePaymentMethodSelection(method);
	}

	/**
	 * Event handler for payment method deselection from component
	 */
	static handlePaymentMethodDeselected(): void {
		this.clearPaymentMethodSelection();
	}

	/**
	 * Callback wrapper for payment method selection (adapts callback props to event handlers)
	 */
	static handlePaymentMethodSelectedCallback(method: PaymentMethod): void {
		this.handlePaymentMethodSelected({ detail: method } as CustomEvent<PaymentMethod>);
	}

	/**
	 * Callback wrapper for payment method deselection (adapts callback props to event handlers)
	 */
	static handlePaymentMethodDeselectedCallback(): void {
		this.handlePaymentMethodDeselected();
	}

	/**
	 * Reset payment form
	 */
	static resetPaymentForm(): void {
		try {
			paymentFormStore.reset();
			console.log('Payment form reset');
		} catch (err) {
			console.error('Error resetting payment form:', err);
		}
	}
}

// Export interface objects for modular access
export const paymentInterface = {
	getSelectedPaymentMethod: PaymentService.getSelectedPaymentMethod.bind(PaymentService),
	selectPaymentMethod: PaymentService.selectPaymentMethod.bind(PaymentService),
	handleSelection: PaymentService.handlePaymentMethodSelection.bind(PaymentService),
	clearSelection: PaymentService.clearPaymentMethodSelection.bind(PaymentService)
};

export const paymentStateInterface = {
	getPaymentState: PaymentService.getPaymentState.bind(PaymentService),
	validate: PaymentService.validatePaymentMethodSelection.bind(PaymentService),
	getAvailablePaymentMethods: PaymentService.getAvailablePaymentMethods.bind(PaymentService),
	getPaymentMethodById: PaymentService.getPaymentMethodById.bind(PaymentService),
	validatePromoCode: PaymentService.validatePromoCode.bind(PaymentService),
	calculateTotalAmount: PaymentService.calculateTotalAmount.bind(PaymentService),
	formatCurrency: PaymentService.formatCurrency.bind(PaymentService)
};

export const paymentActionInterface = {
	handleKeyboard: PaymentService.handleKeyboardNavigation.bind(PaymentService),
	handlePaymentMethodSelected: PaymentService.handlePaymentMethodSelected.bind(PaymentService),
	handlePaymentMethodDeselected: PaymentService.handlePaymentMethodDeselected.bind(PaymentService),
	handlePaymentMethodSelectedCallback: PaymentService.handlePaymentMethodSelectedCallback.bind(PaymentService),
	handlePaymentMethodDeselectedCallback: PaymentService.handlePaymentMethodDeselectedCallback.bind(PaymentService),
	processPayment: PaymentService.processPayment.bind(PaymentService),
	validatePaymentData: PaymentService.validatePaymentData.bind(PaymentService),
	resetPaymentForm: PaymentService.resetPaymentForm.bind(PaymentService)
};

export default PaymentService;