import Banner from '../models/Banner.js';

export const listBanner = async (req, res) => {
  try {
    const images = await Banner.getAll();
    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    // Validate file presence
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Validate file type (only allow png, jpg, jpeg)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only PNG and JPG are allowed.' });
    }
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({ error: 'File too large. Max size is 2MB.' });
    }
    // store url relative to public folder
    const url = `/uploads/banners/${req.file.filename}`;
    // Get text from request body (optional)
    const text = req.body.text || '';
    const id = await Banner.add(url, text);
    res.status(201).json({ id, url, text });
  } catch (err) {
    // More specific error message for database issues
    if (err.message.includes('Unknown column')) {
      return res.status(500).json({ error: 'Database schema error: Please ensure the banner_images table has a position column.' });
    }
    res.status(500).json({ error: err.message });
  }
};

export const updateBannerText = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (text === undefined) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    await Banner.updateText(id, text);
    res.json({ message: 'Banner text updated', id, text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    // attempt to remove database record
    await Banner.remove(id);
    res.json({ message: 'Image removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const reorderImages = async (req, res) => {
  try {
    const { order } = req.body; // expect array of ids
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'Order must be an array of image IDs' });
    }
    await Banner.reorder(order);
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
