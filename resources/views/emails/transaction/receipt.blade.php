<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt - {{ $companyName }}</title>
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
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .header .receipt-number {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 5px;
        }
        .success-badge {
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
        .receipt-details {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #28a745;
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
            font-size: 24px;
            font-weight: 700;
            color: #28a745;
        }
        .payment-summary {
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
            border: 1px solid #c3e6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
        }
        .payment-summary h3 {
            color: #155724;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
            color: #28a745;
            text-decoration: none;
            margin: 0 10px;
        }
        .refund-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
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
        <div class="header">
            <h1>✅ Payment Received</h1>
            <div class="receipt-number">Receipt #{{ $receiptNumber }}</div>
            <div class="success-badge">Payment Successful</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $customerName }},
            </div>

            <p>Great news! Your payment has been successfully processed. Thank you for your business!</p>

            <!-- Receipt Details -->
            <div class="receipt-details">
                <div class="detail-row">
                    <span class="detail-label">Receipt Number:</span>
                    <span class="detail-value">{{ $receiptNumber }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">{{ $transactionId }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Date:</span>
                    <span class="detail-value">{{ $paymentDate }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">{{ $paymentMethod }}</span>
                </div>
                @if($receiptData['payment_reference'])
                <div class="detail-row">
                    <span class="detail-label">Reference Number:</span>
                    <span class="detail-value">{{ $receiptData['payment_reference'] }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <span class="detail-label">Amount Paid:</span>
                    <span class="detail-value amount-highlight">{{ $amount }}</span>
                </div>
            </div>

            <!-- Payment Summary -->
            <div class="payment-summary">
                <h3>💰 Payment Summary</h3>
                <div class="detail-row">
                    <span class="detail-label">Subtotal:</span>
                    <span class="detail-value">{{ $amount }}</span>
                </div>
                @if($receiptData['transaction_fee'] > 0)
                <div class="detail-row">
                    <span class="detail-label">Transaction Fee:</span>
                    <span class="detail-value">${{ number_format($receiptData['transaction_fee'], 2) }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Net Amount:</span>
                    <span class="detail-value">${{ number_format($receiptData['net_amount'], 2) }}</span>
                </div>
                @endif
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $downloadReceiptUrl }}" class="btn">📄 Download Receipt</a>
                <a href="{{ $viewOnlineUrl }}" class="btn btn-secondary">👁️ View Online</a>
            </div>

            <!-- Refund Information -->
            @if($receiptData['is_refundable'])
            <div class="refund-info">
                <strong>Refund Policy:</strong> This transaction is eligible for refund within our standard refund period. 
                For refund requests, please contact our support team or visit our 
                <a href="{{ $receiptData['refund_policy_url'] }}" style="color: #856404;">refund policy page</a>.
            </div>
            @endif

            <!-- Additional Information -->
            <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
                <h4 style="color: #495057; margin-top: 0;">What's Next?</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Keep this receipt for your records</li>
                    <li>You will receive any additional updates via email</li>
                    <li>Contact us if you have any questions about your transaction</li>
                </ul>
            </div>

            <!-- Support Information -->
            <div style="margin-top: 30px; padding: 20px; background-color: #e8f5e8; border-radius: 6px; border-left: 4px solid #28a745;">
                <h4 style="color: #155724; margin-top: 0;">Need Help?</h4>
                <p style="margin-bottom: 10px;">If you have any questions about this transaction, we're here to help:</p>
                <p style="margin: 5px 0;">📧 Email: <a href="mailto:{{ $supportEmail }}" style="color: #155724;">{{ $supportEmail }}</a></p>
                <p style="margin: 5px 0;">🌐 Help Center: <a href="{{ $helpCenterUrl }}" style="color: #155724;">Visit our Help Center</a></p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>{{ $companyName }}</strong></p>
            @if($companyAddress)
            <p>{{ $companyAddress }}</p>
            @endif
            <div class="social-links">
                <a href="{{ $viewOnlineUrl }}">View Online</a> |
                <a href="{{ $downloadReceiptUrl }}">Download PDF</a>
            </div>
            <p style="font-size: 12px; margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
            <p style="font-size: 12px;">Receipt generated on {{ $receiptData['receipt_generated_at']->format('F j, Y \\a\\t g:i A') }}</p>
        </div>
    </div>
</body>
</html>