import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import bannerRoutes from './src/routes/bannerRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import filterRoutes from './src/routes/filterRoutes.js';
import settingsRoutes from './src/routes/settingsRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import wishlistRoutes from './src/routes/wishlistRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Candle Shop Backend is running' });
});

// Admin panel route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🕯️  Candle Shop Backend running on http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/health`);
});
