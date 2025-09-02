<?php

namespace App\Filament\Resources\Transactions\TransactionResource\Api\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $transactionId = $this->route('id');
        
        return [
            'transaction_id' => 'sometimes|string|max:255|unique:transactions,transaction_id,' . $transactionId,
            'type' => 'sometimes|string|in:payment,refund,transfer,withdrawal',
            'status' => 'sometimes|string|in:pending,processing,completed,failed,cancelled,expired',
            'amount' => 'sometimes|numeric|min:0.01|max:999999999.99',
            'currency' => 'sometimes|string|size:3|in:IDR,USD,EUR,SGD',
            'payment_method' => 'sometimes|string|max:100',
            'payment_reference' => 'sometimes|string|max:255',
            'customer_name' => 'sometimes|string|max:255',
            'customer_email' => 'sometimes|email|max:255',
            'customer_phone' => 'sometimes|string|max:20',
            'transaction_details' => 'sometimes|array',
            'payment_details' => 'sometimes|array',
            'paid_at' => 'sometimes|date',
            'expires_at' => 'sometimes|date|after:now',
            'notes' => 'sometimes|string|max:1000',
            'payment_url' => 'sometimes|url|max:500',
            'xendit_invoice_id' => 'sometimes|string|max:255'
        ];
    }
    
    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'transaction_id.unique' => 'This transaction ID is already in use.',
            'type.in' => 'Transaction type must be one of: payment, refund, transfer, withdrawal.',
            'status.in' => 'Transaction status must be one of: pending, processing, completed, failed, cancelled, expired.',
            'amount.min' => 'Amount must be at least 0.01.',
            'amount.max' => 'Amount cannot exceed 999,999,999.99.',
            'currency.size' => 'Currency code must be exactly 3 characters.',
            'currency.in' => 'Currency must be one of: IDR, USD, EUR, SGD.',
            'customer_email.email' => 'Please provide a valid email address.',
            'expires_at.after' => 'Expiration date must be in the future.',
            'payment_url.url' => 'Payment URL must be a valid URL.'
        ];
    }
}
