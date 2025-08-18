# PRZMO Admin System Setup Guide

## 🔐 Admin Authentication

The PRZMO admin system uses secure token-based authentication with the following credentials:

**Admin Login:**
- **Email:** `przmo.official@gmail.com`
- **Password:** `Dhuruv099`

## 📧 Gmail SMTP Configuration

To enable email functionality, you need to set up Gmail App Password:

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to **Security** → **App passwords**
2. Select **Mail** as the app
3. Generate a new App Password
4. Copy the 16-character password

### Step 3: Set Environment Variable
Set the following environment variable in your deployment:
```
GMAIL_APP_PASSWORD=your_16_character_app_password_here
```

## 🛡️ Security Features

The admin system includes:

- ✅ JWT Token Authentication
- ✅ Rate Limiting (5 login attempts per 15 minutes)
- ✅ Session Management with 24-hour timeout
- ✅ Encrypted credential storage
- ✅ Login attempt monitoring and IP blocking
- ✅ Secure HTTP-only cookies
- ✅ CSRF protection
- ✅ Input validation and sanitization

## 🔧 SMTP Configuration

Once App Password is configured, the system will automatically use:

```
Host: smtp.gmail.com
Port: 587
Security: STARTTLS
Username: przmo.official@gmail.com
Password: [Your App Password]
```

## 📋 Admin Panel Features

- SMTP server configuration and testing
- Email API key management
- Email sending diagnostics
- Security monitoring and session management
- Rate limiting configuration
- Email template management

## 🚀 Access

The admin panel is available at:
- `/admin` - Main admin interface
- `/smtp-admin` - SMTP-specific administration

## 🔍 Troubleshooting

**Gmail Authentication Fails:**
- Ensure 2-Step Verification is enabled
- Use App Password, not regular password
- Check GMAIL_APP_PASSWORD environment variable

**Login Issues:**
- Check if IP is rate-limited (wait 15 minutes)
- Verify admin credentials are correct
- Check browser console for authentication errors

**SMTP Connection Issues:**
- Verify App Password is correct
- Ensure port 587 is accessible
- Check Gmail account security settings

## 📝 Environment Variables

Required for production:
```
GMAIL_APP_PASSWORD=your_app_password
JWT_SECRET=your_secure_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

## 🔄 Regular Maintenance

- Monitor login attempts and failed authentications
- Regularly review active admin sessions
- Update App Password if compromised
- Review email sending logs and diagnostics