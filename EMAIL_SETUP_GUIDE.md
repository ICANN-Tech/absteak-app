# Complete Email Solution Setup Guide

This guide provides step-by-step instructions for setting up a complete email solution for your Laravel application using Docker.

## 📧 Email System Overview

Your email system includes:
- **Dovecot**: IMAP/POP3 server for email storage and retrieval
- **Postfix**: SMTP server for sending outgoing emails
- **Mailpit**: Development email sandbox for testing
- **Laravel Integration**: Seamless email handling in your application

## 🚀 Quick Start

### 1. Environment Setup

#### For Development:
```bash
# Copy development email configuration
cp .env.email.development .env.email

# Add to your main .env file:
echo "\n# Email Configuration" >> .env
cat .env.email >> .env
```

#### For Production:
```bash
# Copy production email configuration
cp .env.email.production .env.email

# Add to your main .env file:
echo "\n# Email Configuration" >> .env
cat .env.email >> .env
```

### 2. Start Email Services

```bash
# Start all services including email
docker-compose up -d

# Check email services status
docker-compose ps | grep -E "dovecot|postfix|mailpit"

# View logs if needed
docker-compose logs dovecot
docker-compose logs postfix
docker-compose logs mailpit
```

### 3. Verify Email Services

#### Development (Mailpit):
- Web Interface: http://localhost:8025
- SMTP: localhost:1025

#### Production (Postfix + Dovecot):
- SMTP: localhost:587 (with auth)
- IMAP: localhost:143
- IMAPS: localhost:993
- POP3: localhost:110
- POP3S: localhost:995

## 🔧 Detailed Configuration

### Port Mapping

| Service | Port | Protocol | Purpose |
|---------|------|----------|----------|
| Mailpit | 8025 | HTTP | Web Interface |
| Mailpit | 1025 | SMTP | Development SMTP |
| Postfix | 25 | SMTP | Production SMTP |
| Postfix | 587 | SMTP | SMTP Submission |
| Dovecot | 143 | IMAP | Email Retrieval |
| Dovecot | 993 | IMAPS | Secure IMAP |
| Dovecot | 110 | POP3 | Email Retrieval |
| Dovecot | 995 | POP3S | Secure POP3 |

### Volume Mapping

| Volume | Purpose |
|--------|----------|
| `dovecot_data` | Email storage |
| `dovecot_config` | Dovecot configuration |
| `postfix_data` | Postfix mail queue |
| `postfix_config` | Postfix configuration |
| `mailpit_data` | Mailpit database |

## 🧪 Testing Email Functionality

### 1. Laravel Tinker Testing

```bash
# Access Laravel container
docker-compose exec app php artisan tinker

# Send test email
Mail::raw('This is a test email from Laravel!', function($message) {
    $message->to('test@example.com')
            ->subject('Laravel Email Test');
});

# Exit tinker
exit
```

### 2. Development Testing (Mailpit)

1. Send email using Laravel Tinker (above)
2. Open http://localhost:8025 in your browser
3. View captured emails in Mailpit interface
4. Check email content, headers, and attachments

### 3. Production Testing

```bash
# Test SMTP connection
docker-compose exec postfix telnet localhost 25

# Test IMAP connection
docker-compose exec dovecot telnet localhost 143

# Check mail logs
docker-compose logs postfix | tail -20
docker-compose logs dovecot | tail -20
```

## 📝 Laravel Integration

### 1. Install IMAP Package (Optional)

For reading emails in Laravel:

```bash
docker-compose exec app composer require webklex/laravel-imap
docker-compose exec app php artisan vendor:publish --provider="Webklex\IMAP\Providers\LaravelServiceProvider"
```

### 2. Email Service Provider Example

Create `app/Services/EmailService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    public function sendEmail($to, $subject, $content, $template = null)
    {
        try {
            if (config('app.env') === 'local' && config('mail.default') === 'smtp') {
                Log::info("Development: Email would be sent to {$to}");
            }
            
            Mail::send($template ?: 'emails.default', ['content' => $content], function($message) use ($to, $subject) {
                $message->to($to)->subject($subject);
            });
            
            return true;
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return false;
        }
    }
}
```

### 3. Email Template Example

Create `resources/views/emails/default.blade.php`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{ config('app.name') }}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>{{ config('app.name') }}</h2>
        <div>{!! $content !!}</div>
        <hr>
        <p><small>This email was sent from {{ config('app.name') }}</small></p>
    </div>
</body>
</html>
```

## 🔒 Security Considerations

### Development
- Mailpit captures all emails locally
- No external email sending
- Safe for testing with real email addresses

### Production
- Change default passwords immediately
- Use strong, unique passwords
- Enable SSL/TLS encryption
- Configure proper firewall rules
- Set up SPF, DKIM, and DMARC records
- Regular security updates

### Environment Variables Security

```bash
# Use Docker secrets for sensitive data
docker secret create postfix_password /path/to/password/file

# Or use external secret management
# MAIL_PASSWORD=${VAULT_MAIL_PASSWORD}
```

## 🌐 DNS Configuration (Production)

For production deployment, configure these DNS records:

```
# MX Record
MX    @    10 mail.yourdomain.com

# A Record
A     mail    YOUR_SERVER_IP

# SPF Record
TXT   @    "v=spf1 mx ~all"

# DMARC Record
TXT   _dmarc    "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"

# DKIM Record (generate with your mail server)
TXT   default._domainkey    "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Mailpit not accessible
```bash
# Check if container is running
docker-compose ps mailpit

# Check logs
docker-compose logs mailpit

# Restart service
docker-compose restart mailpit
```

#### 2. Emails not sending in production
```bash
# Check Postfix logs
docker-compose logs postfix

# Test SMTP connection
docker-compose exec app telnet postfix 587

# Check Laravel logs
docker-compose exec app tail -f storage/logs/laravel.log
```

#### 3. Permission issues
```bash
# Fix storage permissions
docker-compose exec app chown -R www-data:www-data storage/
docker-compose exec app chmod -R 775 storage/
```

### Health Checks

```bash
# Check all email services health
docker-compose exec dovecot doveadm who
docker-compose exec postfix nc -z localhost 25
wget --spider http://localhost:8025/api/v1/info
```

## 📊 Monitoring and Logs

### Log Locations

```bash
# Application logs
docker-compose logs app

# Email service logs
docker-compose logs postfix
docker-compose logs dovecot
docker-compose logs mailpit

# Laravel email logs
docker-compose exec app tail -f storage/logs/laravel.log
```

### Performance Monitoring

```bash
# Check email queue
docker-compose exec postfix mailq

# Monitor email traffic
docker-compose exec postfix tail -f /var/log/mail.log

# Check disk usage
docker system df
docker volume ls
```

## 🚀 Advanced Configuration

### Custom Postfix Configuration

Create `docker/postfix/main.cf` for custom Postfix settings:

```
# Custom Postfix configuration
myhostname = mail.absteak.local
mydomain = absteak.local
myorigin = $mydomain
inet_interfaces = all
inet_protocols = ipv4
```

### Custom Dovecot Configuration

Create `docker/dovecot/dovecot.conf` for custom Dovecot settings:

```
# Custom Dovecot configuration
protocols = imap pop3
listen = *
mail_location = maildir:/var/mail/%u
```

## 📚 Additional Resources

- [Laravel Mail Documentation](https://laravel.com/docs/mail)
- [Postfix Documentation](http://www.postfix.org/documentation.html)
- [Dovecot Documentation](https://doc.dovecot.org/)
- [Mailpit Documentation](https://github.com/axllent/mailpit)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Need Help?** Check the troubleshooting section or review the service logs for detailed error information.