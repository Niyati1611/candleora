import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json({ site_title: (settings && settings.site_title) || 'Candle.ora' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { site_title } = req.body;
    const updated = await Settings.update({ site_title });
    res.json({ message: 'Settings updated', settings: { site_title: updated.site_title } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
