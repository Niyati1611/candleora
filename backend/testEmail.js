// Test email service
import { sendOrderStatusEmail } from './src/services/emailService.js';

const testOrder = {
  id: 1,
  customer_name: 'Test User',
  customer_email: 'candle.ora11@gmail.com',
  total_amount: 99.99,
  customer_address: '123 Test St'
};

console.log('Testing email service...');
console.log('Sending test email to:', testOrder.customer_email);

sendOrderStatusEmail(testOrder, 'confirmed')
  .then(result => {
    console.log('Email test result:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error('Email test failed:', err);
    process.exit(1);
  });
