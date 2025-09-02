INVOICE - {{ $companyName }}
=====================================

Invoice #{{ $transactionId }}

Hello {{ $customerName }},

Thank you for your business! We've generated an invoice for your recent transaction.

INVOICE DETAILS:
-----------------
Invoice Number: {{ $transactionId }}
Invoice Date: {{ $invoiceDate }}
Due Date: {{ $dueDate }}
Transaction Type: {{ $transactionType }}
@if($invoiceData['description'])
Description: {{ $invoiceData['description'] }}
@endif
Amount Due: {{ $amount }}

PAYMENT INSTRUCTIONS:
---------------------
Please complete your payment by {{ $dueDate }} to avoid any service interruptions.

@if($invoiceData['payment_methods'] && count($invoiceData['payment_methods']) > 0)
Accepted Payment Methods:
@foreach($invoiceData['payment_methods'] as $method => $label)
- {{ $label }}
@endforeach

@endif
Pay Online: {{ $paymentUrl }}

@if($invoiceData['terms'])
TERMS & CONDITIONS:
-------------------
{{ $invoiceData['terms'] }}

@endif
@if($invoiceData['notes'])
ADDITIONAL NOTES:
-----------------
{{ $invoiceData['notes'] }}

@endif
NEED HELP?
----------
If you have any questions about this invoice, please contact us:

Email: {{ $supportEmail }}
@if($invoiceData['support_phone'])
Phone: {{ $invoiceData['support_phone'] }}
@endif
Help Center: {{ $helpCenterUrl }}

View Online: {{ $viewOnlineUrl }}
Download PDF: {{ $downloadInvoiceUrl }}

{{ $companyName }}
@if($companyAddress)
{{ $companyAddress }}
@endif

This is an automated message. Please do not reply to this email.