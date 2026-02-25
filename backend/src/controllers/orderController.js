import Order from '../models/Order.js';
import { sendOrderStatusEmail, sendAdminNewOrderEmail } from '../services/emailService.js';

export const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, customer_address, total_amount, items } = req.body;
    
    if (!customer_name || !customer_email || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create order in DB
    const orderId = await Order.create({
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      total_amount,
      items
    });

    // Fetch the full order details for emails
    const newOrder = await Order.getById(orderId);

    // =========================
    // SEND EMAILS
    // =========================
    // 1️⃣ Send email to admin
    await sendAdminNewOrderEmail(newOrder);

    // 2️⃣ Send initial pending email to user
    await sendOrderStatusEmail(newOrder, 'pending');

    res.status(201).json({ 
      id: orderId, 
      message: 'Order created successfully and emails sent' 
    });
  } catch (error) {
    console.error('❌ Error in createOrder:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get order details before updating
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update status in database
    const success = await Order.updateStatus(req.params.id, status);
    if (!success) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`✅ Order #${req.params.id} status updated to: ${status}`);

    // Send email notification for pending, confirmed, shipped, or delivered
    let emailResult = { success: true, message: 'No email needed' };
    if (['pending', 'confirmed', 'shipped', 'delivered'].includes(status)) {
      console.log(`📧 Sending ${status} email notification to user...`);
      emailResult = await sendOrderStatusEmail(order, status);
    }

    res.json({ 
      id: req.params.id, 
      status,
      message: `Order status updated to ${status}`,
      email: emailResult
    });
  } catch (error) {
    console.error('❌ Error in updateOrderStatus:', error);
    res.status(500).json({ error: error.message });
  }
};


