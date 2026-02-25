import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// =============================
// CREATE TRANSPORTER
// =============================
const transporterOptions = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

if (process.env.NODE_ENV !== 'production') {
  transporterOptions.tls = { rejectUnauthorized: false };
}

const transporter = nodemailer.createTransport(transporterOptions);

transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

// =============================
// ORDER EMAIL TEMPLATES
// =============================
const emailTemplates = {
  pending: {
    subject: 'Order Placed - Candle Shop 🕯️',
    getHtml: (orderData) => `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
        <h2 style="color:#667eea;">Order Received</h2>
        <p>Dear ${orderData.customer_name},</p>
        <p>Thank you for your order! Your order has been received and is pending confirmation.</p>
        <div style="background:#f5f5f5; padding:15px; border-radius:5px; margin:20px 0;">
          <p><strong>Order ID:</strong> #${orderData.id}</p>
          <p><strong>Total Amount:</strong> $${parseFloat(orderData.total_amount).toFixed(2)}</p>
          <p><strong>Customer Name:</strong> ${orderData.customer_name}</p>
        </div>
        <p>We will confirm your order shortly and keep you updated on its status.</p>
        <p>Best regards,<br/>Candle Shop Team 🕯️</p>
      </div>
    `,
  },
  confirmed: {
    subject: 'Order Confirmed - Candle Shop 🕯️',
    getHtml: (orderData) => `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
        <h2 style="color:#667eea;">Order Confirmed</h2>
        <p>Dear ${orderData.customer_name},</p>
        <p>Your order has been confirmed and is being prepared for shipment.</p>
        <div style="background:#f5f5f5; padding:15px; border-radius:5px; margin:20px 0;">
          <p><strong>Order ID:</strong> #${orderData.id}</p>
          <p><strong>Total Amount:</strong> $${parseFloat(orderData.total_amount).toFixed(2)}</p>
          <p><strong>Customer Name:</strong> ${orderData.customer_name}</p>
        </div>
        <p>We'll notify you as soon as your order ships. Thank you for shopping with Candle Shop!</p>
        <p>Best regards,<br/>Candle Shop Team 🕯️</p>
      </div>
    `,
  },
  shipped: {
    subject: 'Order Shipped - Candle Shop 🕯️',
    getHtml: (orderData) => `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
        <h2 style="color:#667eea;">Order Shipped</h2>
        <p>Dear ${orderData.customer_name},</p>
        <p>Great news! Your order has shipped and is on its way to you.</p>
        <div style="background:#f5f5f5; padding:15px; border-radius:5px; margin:20px 0;">
          <p><strong>Order ID:</strong> #${orderData.id}</p>
          <p><strong>Total Amount:</strong> $${parseFloat(orderData.total_amount).toFixed(2)}</p>
          <p><strong>Shipping Address:</strong> ${orderData.customer_address || 'N/A'}</p>
        </div>
        <p>You should receive your order within 3-5 business days. Track your package and expect updates soon!</p>
        <p>Best regards,<br/>Candle Shop Team 🕯️</p>
      </div>
    `,
  },
  delivered: {
    subject: 'Order Delivered - Thank You! 🕯️',
    getHtml: (orderData) => `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
        <h2 style="color:#667eea;">Order Delivered</h2>
        <p>Dear ${orderData.customer_name},</p>
        <p>Your order has been delivered! We hope you enjoy your purchase.</p>
        <div style="background:#f5f5f5; padding:15px; border-radius:5px; margin:20px 0;">
          <p><strong>Order ID:</strong> #${orderData.id}</p>
          <p><strong>Total Amount:</strong> $${parseFloat(orderData.total_amount).toFixed(2)}</p>
          <p><strong>Delivered To:</strong> ${orderData.customer_address || 'N/A'}</p>
        </div>
        <p>If you have any questions about your order, please contact us.</p>
        <p>Best regards,<br/>Candle Shop Team 🕯️</p>
      </div>
    `,
  },
};

// =============================
// SEND EMAIL TO USER
// =============================
export const sendOrderStatusEmail = async (orderData, newStatus) => {
  try {
    const template = emailTemplates[newStatus];
    if (!template) return { success: false, message: 'No email template found' };

    const mailOptions = {
      from: `"Candle Shop 🕯️" <${process.env.EMAIL_USER}>`,
      to: orderData.customer_email,
      subject: template.subject,
      html: template.getHtml(orderData),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ User email sent: ${info.response}`);
    return { success: true, message: 'User email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending user email:', error.message);
    return { success: false, message: error.message };
  }
};

// =============================
// SEND EMAIL TO ADMIN (ORDER)
// =============================
export const sendAdminNewOrderEmail = async (orderData) => {
  try {
    const orderItemsHtml = orderData.items.map(item => `
      <tr style="border-bottom:1px solid #ddd;">
        <td style="padding:8px 0;">${item.product_name}</td>
        <td align="center">${item.quantity}</td>
        <td align="right">₹${parseFloat(item.price).toFixed(2)}</td>
        <td align="right">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Candle Shop 🕯️" <${process.env.EMAIL_USER}>`,
      to: 'candle.ora11@gmail.com',
      subject: `🆕 New Order Received (#${orderData.id})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:650px; margin:auto; padding:20px;">
          <h2 style="color:#333;">🆕 New Order Received</h2>
          <p><strong>Order ID:</strong> #${orderData.id}</p>
          <p><strong>Customer Name:</strong> ${orderData.customer_name}</p>
          <p><strong>Email:</strong> ${orderData.customer_email}</p>
          <p><strong>Shipping Address:</strong> ${orderData.customer_address}</p>
          <hr style="margin:20px 0;" />
          <h3>Order Details</h3>
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <thead style="background:#f5f5f5;">
              <tr>
                <th align="left">Product</th>
                <th align="center">Qty</th>
                <th align="right">Price</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          <div style="margin-top:20px; text-align:right;">
            <h3>Total Amount: ₹${parseFloat(orderData.total_amount).toFixed(2)}</h3>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin email sent: ${info.response}`);
  } catch (error) {
    console.error('❌ Error sending admin email:', error.message);
  }
};

// =============================
// CONTACT PAGE EMAILS
// =============================

// Email to Admin when user submits contact
export const sendContactEmailToAdmin = async ({ fullName, email, phone, message }) => {
  try {
    const mailOptions = {
      from: `"Candle Shop 🕯️" <${process.env.EMAIL_USER}>`,
      to: 'candle.ora11@gmail.com',      // Admin email
      replyTo: email,                    // <-- Admin reply goes to user
      subject: `📩 New Contact Message from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:650px; margin:auto; padding:20px;">
          <h2>New Contact Message Received</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p style="background:#f5f5f5; padding:10px; border-radius:5px;">${message}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin contact email sent: ${info.response}`);
  } catch (error) {
    console.error('❌ Error sending admin contact email:', error.message);
  }
};

// Email to user confirming contact submission
export const sendContactReplyToUser = async ({ fullName, email }) => {
  try {
    const mailOptions = {
      from: `"Candle Shop 🕯️" <${process.env.EMAIL_USER}>`,
      to: email,                        // User email
      replyTo: 'candle.ora11@gmail.com', // <-- User can reply back to admin
      subject: `Thank you for contacting Candle Shop 🕯️`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h2>Hi ${fullName},</h2>
          <p>Thank you for reaching out to us! We have received your message and our team will get back to you shortly.</p>
          <p>Best regards,<br/>Candle Shop Team 🕯️</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ User contact confirmation email sent: ${info.response}`);
  } catch (error) {
    console.error('❌ Error sending user contact email:', error.message);
  }
};


// =============================
// CONTACT PAGE EMAILS
// =============================

// Email to Admin when user submits contact
// export const sendContactEmailToAdmin = async ({ fullName, email, phone, message }) => {
//   try {
//     const mailOptions = {
//       from: `"Candle Shop 🕯️" <${process.env.EMAIL_USER}>`,
//       to: 'candle.ora11@gmail.com',
//       subject: `📩 New Contact Message from ${fullName}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width:650px; margin:auto; padding:20px;">
//           <h2>New Contact Message Received</h2>
//           <p><strong>Name:</strong> ${fullName}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
//           <p><strong>Message:</strong></p>
//           <p style="background:#f5f5f5; padding:10px; border-radius:5px;">${message}</p>
//         </div>
//       `,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Admin contact email sent: ${info.response}`);
//   } catch (error) {
//     console.error('❌ Error sending admin contact email:', error.message);
//   }
// };

// Email to user confirming contact submission
// export const sendContactReplyToUser = async ({ fullName, email }) => {
//   try {
//     const mailOptions = {
//       from: `"Candle Shop 🕯️" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `Thank you for contacting Candle Shop 🕯️`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
//           <h2>Hi ${fullName},</h2>
//           <p>Thank you for reaching out to us! We have received your message and our team will get back to you shortly.</p>
//           <p>Best regards,<br/>Candle Shop Team 🕯️</p>
//         </div>
//       `,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ User contact confirmation email sent: ${info.response}`);
//   } catch (error) {
//     console.error('❌ Error sending user contact email:', error.message);
//   }
// };

// =============================
// PASSWORD RESET EMAILS
// =============================

// Send password reset email to user
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Candle Shop 🕯️" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Candle Shop 🕯️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
          <h2 style="color:#667eea;">Password Reset Request</h2>
          <p>Dear ${userName},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align:center; margin:30px 0;">
            <a href="${resetUrl}" style="background:#667eea; color:white; padding:12px 30px; text-decoration:none; border-radius:5px; display:inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break:break-all; color:#667eea;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>Best regards,<br/>Candle Shop Team 🕯️</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent: ${info.response}`);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return { success: false, message: error.message };
  }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmation = async (email, userName) => {
  try {
    const mailOptions = {
      from: `"Candle Shop 🕯️" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Changed Successfully - Candle Shop 🕯️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
          <h2 style="color:#667eea;">Password Changed Successfully</h2>
          <p>Dear ${userName},</p>
          <p>Your password has been changed successfully.</p>
          <p>If you didn't make this change, please contact us immediately.</p>
          <p>Best regards,<br/>Candle Shop Team 🕯️</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset confirmation email sent: ${info.response}`);
    return { success: true, message: 'Confirmation email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending password reset confirmation email:', error.message);
    return { success: false, message: error.message };
  }
};


