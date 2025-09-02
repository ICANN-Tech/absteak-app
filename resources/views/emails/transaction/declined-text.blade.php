PAYMENT ISSUE - {{ $companyName }}
===================================

⚠️ PAYMENT COULD NOT BE PROCESSED
Transaction #{{ $transactionId }}

@if($urgencyLevel === 'high')
🚨 URGENT ACTION REQUIRED
@elseif($urgencyLevel === 'medium')
⚠️ ACTION REQUIRED
@else
💳 PAYMENT NEEDED
@endif

Hello {{ $customerName }},

PAYMENT ISSUE:
--------------
Reason: {{ $declineReason }}

@if($declinedData['can_retry'])
Don't worry! You can easily retry your payment using the same or a different payment method.
@else
Please contact our support team for assistance with this transaction.
@endif

TRANSACTION DETAILS:
--------------------
Transaction ID: {{ $transactionId }}
Amount: {{ $amount }}
Payment Method: {{ $paymentMethod }}
Retry Attempts: {{ $declinedData['retry_attempts'] }} of {{ $declinedData['max_retry_attempts'] }}
@if($declinedData['can_retry'])
Retry Deadline: {{ $expirationDate }}
@endif

@if($declinedData['can_retry'])
RETRY YOUR PAYMENT:
-------------------
You can retry your payment immediately. We recommend trying a different payment method if the issue persists.

Retry Payment: {{ $retryUrl }}

@if($alternativePaymentMethods && count($alternativePaymentMethods) > 0)
Alternative Payment Methods:
@foreach($alternativePaymentMethods as $method => $label)
- {{ $label }}
@endforeach

@endif
@if($urgencyLevel === 'high')
⏰ TIME SENSITIVE: Please complete your payment by {{ $expirationDate }} to avoid any service interruptions or cancellation.

@endif
@endif
COMMON ISSUES & SOLUTIONS:
---------------------------
- Insufficient funds: Check your account balance or try a different card
- Expired card: Update your payment information with current card details
- Security block: Contact your bank to authorize the transaction
- Incorrect information: Verify your billing address and card details

NEED HELP?
----------
Our support team is here to help you resolve any payment issues:

Email: {{ $supportEmail }}
@if($supportPhone)
Phone: {{ $supportPhone }}
@endif
Help Center: {{ $helpCenterUrl }}
Payment Help: {{ $paymentHelpUrl }}

@if($declinedData['can_retry'])
Retry Payment: {{ $retryUrl }}
@endif

{{ $companyName }}
@if($companyAddress)
{{ $companyAddress }}
@endif

This is an automated message. Please do not reply to this email.