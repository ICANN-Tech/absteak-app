<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Issue - {{ $companyName }}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header.medium-urgency {
            background: linear-gradient(135deg, #fd7e14 0%, #e55a00 100%);
        }
        .header.low-urgency {
            background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
            color: #212529;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .header .transaction-number {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 5px;
        }
        .urgency-badge {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 8px 16px;
            display: inline-block;
            margin-top: 10px;
            font-size: 14px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .alert-box {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #dc3545;
        }
        .alert-box.medium-urgency {
            background-color: #fff3cd;
            border-color: #ffeaa7;
            border-left-color: #fd7e14;
        }
        .alert-box.low-urgency {
            background-color: #fff3cd;
            border-color: #ffeaa7;
            border-left-color: #ffc107;
        }
        .alert-box h3 {
            color: #721c24;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .alert-box.medium-urgency h3 {
            color: #856404;
        }
        .alert-box.low-urgency h3 {
            color: #856404;
        }
        .transaction-details {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 25px;
            margin: 25px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        .detail-value {
            color: #212529;
        }
        .amount-highlight {
            font-size: 20px;
            font-weight: 700;
            color: #dc3545;
        }
        .retry-section {
            background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
            border: 1px solid #bbdefb;
            border-radius: 6px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .retry-section h3 {
            color: #1565c0;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .alternative-methods {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .payment-method {
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            padding: 15px;
            text-align: center;
            transition: all 0.3s ease;
        }
        .payment-method:hover {
            border-color: #007bff;
            background-color: #f0f8ff;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 10px 5px;
            transition: transform 0.2s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .btn-retry {
            background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
            font-size: 16px;
            padding: 15px 40px;
        }
        .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }
        .footer {
            background-color: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .social-links {
            margin: 15px 0;
        }
        .social-links a {
            color: #007bff;
            text-decoration: none;
            margin: 0 10px;
        }
        .expiration-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 20px 15px;
            }
            .header {
                padding: 20px 15px;
            }
            .alternative-methods {
                grid-template-columns: 1fr;
            }
            .btn {
                display: block;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header {{ $urgencyLevel }}-urgency">
            <h1>⚠️ Payment Issue</h1>
            <div class="transaction-number">Transaction #{{ $transactionId }}</div>
            <div class="urgency-badge">
                @if($urgencyLevel === 'high')
                    Urgent Action Required
                @elseif($urgencyLevel === 'medium')
                    Action Required
                @else
                    Payment Needed
                @endif
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $customerName }},
            </div>

            <!-- Alert Box -->
            <div class="alert-box {{ $urgencyLevel }}-urgency">
                <h3>🚫 Payment Could Not Be Processed</h3>
                <p><strong>Reason:</strong> {{ $declineReason }}</p>
                @if($declinedData['can_retry'])
                <p>Don't worry! You can easily retry your payment using the same or a different payment method.</p>
                @else
                <p>Please contact our support team for assistance with this transaction.</p>
                @endif
            </div>

            <!-- Transaction Details -->
            <div class="transaction-details">
                <div class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">{{ $transactionId }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value amount-highlight">{{ $amount }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">{{ $paymentMethod }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Retry Attempts:</span>
                    <span class="detail-value">{{ $declinedData['retry_attempts'] }} of {{ $declinedData['max_retry_attempts'] }}</span>
                </div>
                @if($declinedData['can_retry'])
                <div class="detail-row">
                    <span class="detail-label">Retry Deadline:</span>
                    <span class="detail-value">{{ $expirationDate }}</span>
                </div>
                @endif
            </div>

            @if($declinedData['can_retry'])
            <!-- Retry Section -->
            <div class="retry-section">
                <h3>💳 Retry Your Payment</h3>
                <p>You can retry your payment immediately. We recommend trying a different payment method if the issue persists.</p>
                
                <a href="{{ $retryUrl }}" class="btn btn-retry">🔄 Retry Payment Now</a>
                
                @if($alternativePaymentMethods && count($alternativePaymentMethods) > 0)
                <h4 style="margin-top: 25px; margin-bottom: 15px; color: #1565c0;">Try Alternative Payment Methods:</h4>
                <div class="alternative-methods">
                    @foreach($alternativePaymentMethods as $method => $label)
                    <div class="payment-method">
                        <strong>{{ $label }}</strong>
                    </div>
                    @endforeach
                </div>
                @endif
            </div>

            <!-- Expiration Warning -->
            @if($urgencyLevel === 'high')
            <div class="expiration-warning">
                <strong>⏰ Time Sensitive:</strong> Please complete your payment by <strong>{{ $expirationDate }}</strong> 
                to avoid any service interruptions or cancellation.
            </div>
            @endif
            @endif

            <!-- Common Issues & Solutions -->
            <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
                <h4 style="color: #495057; margin-top: 0;">💡 Common Issues & Solutions</h4>
                <ul style="margin: 10px 0; padding-left: 20px; color: #6c757d;">
                    <li><strong>Insufficient funds:</strong> Check your account balance or try a different card</li>
                    <li><strong>Expired card:</strong> Update your payment information with current card details</li>
                    <li><strong>Security block:</strong> Contact your bank to authorize the transaction</li>
                    <li><strong>Incorrect information:</strong> Verify your billing address and card details</li>
                </ul>
            </div>

            <!-- Support Information -->
            <div style="margin-top: 30px; padding: 20px; background-color: #e8f4fd; border-radius: 6px; border-left: 4px solid #007bff;">
                <h4 style="color: #0056b3; margin-top: 0;">🆘 Need Help?</h4>
                <p style="margin-bottom: 15px;">Our support team is here to help you resolve any payment issues:</p>
                <p style="margin: 5px 0;">📧 Email: <a href="mailto:{{ $supportEmail }}" style="color: #0056b3;">{{ $supportEmail }}</a></p>
                @if($supportPhone)
                <p style="margin: 5px 0;">📞 Phone: {{ $supportPhone }}</p>
                @endif
                <p style="margin: 5px 0;">🌐 Help Center: <a href="{{ $helpCenterUrl }}" style="color: #0056b3;">Visit our Help Center</a></p>
                <p style="margin: 5px 0;">💬 Payment Help: <a href="{{ $paymentHelpUrl }}" style="color: #0056b3;">Payment Troubleshooting Guide</a></p>
                
                <div style="text-align: center; margin-top: 20px;">
                    <a href="mailto:{{ $supportEmail }}" class="btn btn-secondary">📧 Contact Support</a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>{{ $companyName }}</strong></p>
            @if($companyAddress)
            <p>{{ $companyAddress }}</p>
            @endif
            <div class="social-links">
                @if($declinedData['can_retry'])
                <a href="{{ $retryUrl }}">Retry Payment</a> |
                @endif
                <a href="{{ $paymentHelpUrl }}">Payment Help</a>
            </div>
            <p style="font-size: 12px; margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>