import Admin from '../models/Admin.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const admin = await Admin.getByUsername(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await Admin.verifyPassword(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateToken = async (req, res) => {
  try {
    const admin = await Admin.getById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ valid: true, admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.getAll();
    const orders = await Order.getAll();
    const todayOrdersCount = await Order.getTodayOrdersCount();
    const totalUsers = await Order.getTotalUsers();
    
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);

    res.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      todayOrders: todayOrdersCount,
      totalUsers: totalUsers,
      totalRevenue: parseFloat(totalRevenue.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    // allow optional pagination query params
    let { page, limit } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    const result = await User.listPaginated(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
