<?php

namespace App\Filament\Resources\Transactions\TransactionResource\Api\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTransactionRequest extends FormRequest
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
        return [
            'transaction_id' => 'required|string|unique:transactions,transaction_id|max:255',
            'type' => 'required|string|in:payment,refund,transfer,withdrawal',
            'status' => 'required|string|in:pending,processing,completed,failed,cancelled,expired',
            'amount' => 'required|numeric|min:0.01|max:999999999.99',
            'currency' => 'required|string|size:3|in:IDR,USD,EUR,SGD',
            'payment_method' => 'nullable|string|max:100',
            'payment_reference' => 'nullable|string|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'transaction_details' => 'nullable|json',
            'payment_details' => 'nullable|json',
            'paid_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:now',
            'notes' => 'nullable|string|max:1000',
            'payment_url' => 'nullable|url|max:500',
            'xendit_invoice_id' => 'nullable|string|max:255',
            'metadata' => 'nullable|json'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'transaction_id.unique' => 'Transaction ID already exists.',
            'type.in' => 'Transaction type must be one of: payment, refund, transfer, withdrawal.',
            'status.in' => 'Status must be one of: pending, processing, completed, failed, cancelled, expired.',
            'amount.min' => 'Amount must be at least 0.01.',
            'amount.max' => 'Amount cannot exceed 999,999,999.99.',
            'currency.in' => 'Currency must be one of: IDR, USD, EUR, SGD.',
            'customer_email.email' => 'Please provide a valid email address.',
            'expires_at.after' => 'Expiration date must be in the future.',
            'payment_url.url' => 'Payment URL must be a valid URL.',
        ];
    }
}
