PAYMENT RECEIPT - {{ $companyName }}
====================================

✅ PAYMENT SUCCESSFUL
Receipt #{{ $receiptNumber }}

Hello {{ $customerName }},

Great news! Your payment has been successfully processed. Thank you for your business!

RECEIPT DETAILS:
-----------------
Receipt Number: {{ $receiptNumber }}
Transaction ID: {{ $transactionId }}
Payment Date: {{ $paymentDate }}
Payment Method: {{ $paymentMethod }}
@if($receiptData['payment_reference'])
Reference Number: {{ $receiptData['payment_reference'] }}
@endif
Amount Paid: {{ $amount }}

PAYMENT SUMMARY:
----------------
Subtotal: {{ $amount }}
@if($receiptData['transaction_fee'] > 0)
Transaction Fee: ${{ number_format($receiptData['transaction_fee'], 2) }}
Net Amount: ${{ number_format($receiptData['net_amount'], 2) }}
@endif

DOWNLOAD OPTIONS:
-----------------
Download Receipt: {{ $downloadReceiptUrl }}
View Online: {{ $viewOnlineUrl }}

@if($receiptData['is_refundable'])
REFUND POLICY:
--------------
This transaction is eligible for refund within our standard refund period.
For refund requests, please contact our support team or visit:
{{ $receiptData['refund_policy_url'] }}

@endif
WHAT'S NEXT?
-------------
- Keep this receipt for your records
- You will receive any additional updates via email
- Contact us if you have any questions about your transaction

NEED HELP?
----------
If you have any questions about this transaction, we're here to help:

Email: {{ $supportEmail }}
Help Center: {{ $helpCenterUrl }}

{{ $companyName }}
@if($companyAddress)
{{ $companyAddress }}
@endif

This is an automated message. Please do not reply to this email.
Receipt generated on {{ $receiptData['receipt_generated_at']->format('F j, Y \\a\\t g:i A') }}