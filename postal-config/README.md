# Postal Mail Service Setup

This directory contains the configuration for the Postal mail service integrated into the ABSteak application.

## Initial Setup

After starting the services with `docker-compose up`, you need to initialize Postal:

1. **Initialize the database:**
   ```bash
   docker-compose exec postal postal initialize
   ```

2. **Create the first admin user:**
   ```bash
   docker-compose exec postal postal make-user
   ```
   Follow the prompts to create your admin user.

3. **Access the Postal web interface:**
   - URL: http://localhost:5000
   - Login with the credentials you created in step 2

## Configuration

- **Web Interface:** http://localhost:5000
- **SMTP Server:** localhost:25
- **Database:** Uses the same PostgreSQL instance as the main app (postal_db database)
- **Redis:** Uses the same Redis instance as the main app

## Usage

1. **Create a Mail Server:**
   - Log into the web interface
   - Create a new mail server
   - Configure domains and routes

2. **Send Mail:**
   - Use SMTP: localhost:25
   - Configure your application to use Postal for outgoing mail

3. **Monitor:**
   - View delivery statistics in the web interface
   - Check logs and bounce handling

## Integration with Laravel

To use Postal with your Laravel application, update your `.env` file:

```env
MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=25
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Security Notes

- The signing key in this directory is for development only
- In production, generate a proper RSA key pair
- Configure proper authentication and SSL/TLS
- Set up proper DNS records for your mail domains

## Troubleshooting

- Check container logs: `docker-compose logs postal`
- Verify database connection: `docker-compose exec postal postal status`
- Check Redis connection in the Postal web interface