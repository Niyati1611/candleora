## 📧 Email Configuration Guide

### ⚠️ IMPORTANT: Gmail Setup Required

For the email functionality to work, you need to:

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Scroll to "How you sign into Google"
4. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/AppPasswords
2. Select "Mail" and "Windows Computer"
3. Google will generate a 16-character password
4. Copy this password

### Step 3: Update .env File
Open `backend/.env` and add:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

**Example:**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Test the Setup
1. Restart your backend server: `npm start`
2. Check the console for: ✅ Email service is ready to send messages
3. Update an order status to "confirmed" and check if email is sent

### 🔍 Troubleshooting

If emails are not being sent:

1. **Check Console Logs** - Look for error messages in the terminal running your backend
2. **Verify Credentials** - Make sure EMAIL_USER and EMAIL_PASSWORD are correct
3. **Check 2FA** - Ensure 2-Step Verification is enabled on your Gmail account
4. **App Password** - App password must be exactly 16 characters (without spaces when pasting)

### Alternative: Using Different Email Service

If you don't want to use Gmail, you can modify `backend/src/services/emailService.js`:

**For Outlook/Hotmail:**
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

**For Custom SMTP Server:**
Replace the host and port with your provider's details.

### 📝 What Happens When Status Changes

1. Admin selects new status (confirmed, shipped, or delivered)
2. Order status is updated in database ✅
3. Customer receives email notification 📧
4. Admin sees confirmation message

---

**Questions?** Check the backend console logs for detailed error messages.
