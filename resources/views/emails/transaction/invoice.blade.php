<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {{ $companyName }}</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .header .invoice-number {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 5px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .invoice-details {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #667eea;
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
        .payment-instructions {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
        }
        .payment-instructions h3 {
            color: #856404;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .payment-methods {
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
            border-color: #667eea;
            background-color: #f0f2ff;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
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
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
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
            .payment-methods {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Invoice</h1>
            <div class="invoice-number">Invoice #{{ $transactionId }}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $customerName }},
            </div>

            <p>Thank you for your business! We've generated an invoice for your recent transaction. Please find the details below:</p>

            <!-- Invoice Details -->
            <div class="invoice-details">
                <div class="detail-row">
                    <span class="detail-label">Invoice Number:</span>
                    <span class="detail-value">{{ $transactionId }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Invoice Date:</span>
                    <span class="detail-value">{{ $invoiceDate }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Due Date:</span>
                    <span class="detail-value">{{ $dueDate }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Transaction Type:</span>
                    <span class="detail-value">{{ $transactionType }}</span>
                </div>
                @if($invoiceData['description'])
                <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">{{ $invoiceData['description'] }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <span class="detail-label">Amount Due:</span>
                    <span class="detail-value amount-highlight">{{ $amount }}</span>
                </div>
            </div>

            <!-- Payment Instructions -->
            <div class="payment-instructions">
                <h3>💳 Payment Instructions</h3>
                <p>Please complete your payment by <strong>{{ $dueDate }}</strong> to avoid any service interruptions.</p>
                
                @if($invoiceData['payment_methods'] && count($invoiceData['payment_methods']) > 0)
                <div class="payment-methods">
                    @foreach($invoiceData['payment_methods'] as $method => $label)
                    <div class="payment-method">
                        <strong>{{ $label }}</strong>
                    </div>
                    @endforeach
                </div>
                @endif

                <div style="text-align: center; margin-top: 25px;">
                    <a href="{{ $paymentUrl }}" class="btn">Pay Now</a>
                </div>
            </div>

            <!-- Additional Information -->
            @if($invoiceData['terms'] || $invoiceData['notes'])
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                @if($invoiceData['terms'])
                <h4 style="color: #495057; margin-bottom: 10px;">Terms & Conditions:</h4>
                <p style="font-size: 14px; color: #6c757d; margin-bottom: 15px;">{{ $invoiceData['terms'] }}</p>
                @endif
                
                @if($invoiceData['notes'])
                <h4 style="color: #495057; margin-bottom: 10px;">Additional Notes:</h4>
                <p style="font-size: 14px; color: #6c757d;">{{ $invoiceData['notes'] }}</p>
                @endif
            </div>
            @endif

            <!-- Support Information -->
            <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
                <h4 style="color: #495057; margin-top: 0;">Need Help?</h4>
                <p style="margin-bottom: 10px;">If you have any questions about this invoice, please don't hesitate to contact us:</p>
                <p style="margin: 5px 0;">📧 Email: <a href="mailto:{{ $supportEmail }}" style="color: #667eea;">{{ $supportEmail }}</a></p>
                @if($invoiceData['support_phone'])
                <p style="margin: 5px 0;">📞 Phone: {{ $invoiceData['support_phone'] }}</p>
                @endif
                <p style="margin: 5px 0;">🌐 Help Center: <a href="{{ $helpCenterUrl }}" style="color: #667eea;">Visit our Help Center</a></p>
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
                <a href="{{ $downloadInvoiceUrl }}">Download PDF</a>
            </div>
            <p style="font-size: 12px; margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>