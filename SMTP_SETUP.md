# PRZMO Secure SMTP Server Setup Guide

## Overview

PRZMO now uses a highly secure, self-hosted SMTP server instead of SendGrid. This provides better control, security, and cost-effectiveness for email communications.

## Features

### 🔒 Security Features
- **JWT-based authentication** with rotating API keys
- **Rate limiting** (100 emails/hour, 10 emails/minute burst protection)
- **Input validation and sanitization** using Zod schemas
- **HTML content filtering** to prevent XSS attacks
- **TLS encryption** with SSL/TLS support
- **IP-based rate limiting** for API endpoints

### 📊 Management Features
- **Real-time statistics** tracking emails sent and API key usage
- **API key management** with domain-based restrictions
- **Connection pooling** for optimal performance
- **Comprehensive logging** and error handling
- **Admin dashboard** for server management

### 🚀 Performance Features
- **Connection pooling** with configurable limits
- **Automatic retry** mechanisms
- **Optimized transporter** configuration
- **Memory-based rate limiting** for fast response times

## Quick Setup

### 1. Environment Variables

Create or update your `.env` file with SMTP configuration:

```env
# SMTP Server Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# Optional: Pre-configured API key
SMTP_API_KEY=your-generated-api-key
SMTP_DOMAIN=przmo.app

# JWT Secret for API key generation
JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production
```

### 2. Common SMTP Providers

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
```

**Note:** Use Gmail App Passwords, not your regular password.

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_SECURE=false
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
```

#### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=465
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_SECURE=true
```

## API Usage

### 1. Configure SMTP Server

```http
POST /api/smtp/configure
Content-Type: application/json

{
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false,
  "auth": {
    "user": "your-email@gmail.com",
    "pass": "your-app-password"
  },
  "pool": true,
  "maxConnections": 5,
  "maxMessages": 100
}
```

### 2. Generate API Key

```http
POST /api/smtp/generate-key
Content-Type: application/json

{
  "domain": "przmo.app"
}
```

Response:
```json
{
  "success": true,
  "message": "API key generated successfully",
  "data": {
    "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "keyId": "smtp_1640995200_abc123def"
  }
}
```

### 3. Send Email

```http
POST /api/smtp/send
Content-Type: application/json

{
  "to": "recipient@example.com",
  "from": "sender@przmo.app",
  "subject": "Test Email from PRZMO",
  "text": "This is a test email",
  "html": "<h1>This is a test email</h1>",
  "apiKey": "your-api-key",
  "domain": "przmo.app"
}
```

### 4. Check Server Status

```http
GET /api/smtp/status
```

Response:
```json
{
  "success": true,
  "data": {
    "isConnected": true,
    "config": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false
    },
    "stats": {
      "totalKeys": 3,
      "totalEmailsSent": 42
    }
  }
}
```

## Admin Panel

Access the SMTP Admin Panel at `/smtp-admin` to:

- Configure SMTP server settings
- Generate and manage API keys
- View server statistics
- Send test emails
- Monitor email activity

## Security Best Practices

### 1. API Key Management
- **Rotate API keys regularly**
- **Use domain-specific keys** for different applications
- **Revoke unused keys** immediately
- **Store keys securely** (environment variables, not code)

### 2. Rate Limiting
- Default: 100 emails/hour per API key
- Burst protection: 10 emails/minute
- **Monitor usage** through the admin panel

### 3. Content Security
- **HTML content is automatically sanitized**
- **Script tags and dangerous content removed**
- **Email headers validated**

### 4. Network Security
- **TLS encryption enforced**
- **Connection timeout limits**
- **IP-based rate limiting**

## Migration from SendGrid

### 1. Update Code

The SMTP service provides the same interface as SendGrid:

```typescript
// Before (SendGrid)
import { sendEmail } from './sendgrid';

// After (SMTP)
import { sendEmail } from './smtp-service';

// Usage remains the same
await sendEmail({
  to: 'user@example.com',
  from: 'noreply@przmo.app',
  subject: 'Welcome to PRZMO',
  html: '<h1>Welcome!</h1>'
});
```

### 2. Environment Variables

Replace SendGrid variables:

```env
# Remove these SendGrid variables
# SENDGRID_API_KEY=SG.xxx
# SENDGRID_FROM_EMAIL=noreply@przmo.app

# Add SMTP variables
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Test Migration

1. Configure SMTP server
2. Generate API key
3. Send test email
4. Verify email delivery
5. Update production environment

## Monitoring & Maintenance

### 1. Log Monitoring

Check server logs for:
- Email delivery status
- Rate limit violations
- Authentication failures
- Connection issues

### 2. Performance Monitoring

Track metrics:
- Email delivery rate
- Response times
- Connection pool usage
- API key usage

### 3. Regular Maintenance

- **Rotate JWT secret** periodically
- **Clean up old API keys**
- **Monitor rate limit thresholds**
- **Update SMTP credentials** as needed

## Troubleshooting

### Common Issues

#### 1. Authentication Failed
- Verify SMTP credentials
- Use app passwords for Gmail
- Check 2FA settings

#### 2. Connection Timeout
- Verify SMTP host and port
- Check firewall settings
- Test network connectivity

#### 3. Rate Limit Exceeded
- Monitor API key usage
- Increase rate limits if needed
- Use multiple API keys for high volume

#### 4. Email Not Delivered
- Check spam folders
- Verify sender reputation
- Review email content

### Support

For technical support or questions:
1. Check server logs
2. Use the admin panel diagnostics
3. Test with different SMTP providers
4. Verify API key validity

## Advanced Configuration

### Custom Rate Limits

Modify rate limits in `smtp-server.ts`:

```typescript
// Rate limiting: 200 emails per hour
private rateLimiter = new RateLimiterMemory({
  keyPrefix: 'smtp_rate_limit',
  points: 200, // Number of emails
  duration: 3600, // Per hour
});
```

### Connection Pool Settings

Adjust connection pool in configuration:

```json
{
  "pool": true,
  "maxConnections": 10,
  "maxMessages": 500
}
```

### Security Headers

Custom security headers are automatically added:

```
X-Mailer: PRZMO Secure SMTP v1.0
X-Priority: 3
```

---

**PRZMO Secure SMTP Server** - Professional email delivery without third-party dependencies.