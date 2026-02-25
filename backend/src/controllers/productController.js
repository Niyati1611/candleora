import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.getByCategory(req.params.category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products marked as new arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.getNewArrivals();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get recently added products (auto-detect based on days)
export const getRecentlyAdded = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const products = await Product.getRecentlyAdded(days);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount_price, category, image_url, images, stock, is_new_arrival, new_arrival_expires_at, filter_selections } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    const id = await Product.create({ name, description, price, discount_price, category, image_url, images, stock, is_new_arrival, new_arrival_expires_at, filter_selections });
    res.status(201).json({ id, name, description, price, discount_price, category, image_url, images, stock, is_new_arrival, new_arrival_expires_at, filter_selections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, discount_price, category, image_url, images, stock, is_new_arrival, new_arrival_expires_at, filter_selections } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    const success = await Product.update(req.params.id, { name, description, price, discount_price, category, image_url, images, stock, is_new_arrival, new_arrival_expires_at, filter_selections });
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ id: req.params.id, name, description, price, discount_price, category, image_url, images, stock, is_new_arrival, new_arrival_expires_at, filter_selections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const success = await Product.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
