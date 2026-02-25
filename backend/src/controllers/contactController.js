import Contact from '../models/Contact.js';
import { sendContactEmailToAdmin, sendContactReplyToUser } from '../services/emailService.js';

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body || {};
    
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'fullName, email and message are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (phone && !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone must be 10-15 digits' });
    }

    // Save contact message to DB
    const id = await Contact.add({ fullName, email, phone, message });

    // Send email to admin
    await sendContactEmailToAdmin({ fullName, email, phone, message });

    // Send confirmation email to user
    await sendContactReplyToUser({ fullName, email });

    res.status(201).json({ id, message: 'Contact message submitted and emails sent' });
  } catch (err) {
    console.error('Contact submit failed:', err);
    res.status(500).json({ error: 'Failed to save contact message' });
  }
}

export const listContacts = async (req, res) => {
  try {
    const rows = await Contact.getAll();
    res.json({ messages: rows });
  } catch (err) {
    console.error('List contacts failed:', err);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
}

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.remove(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete contact failed:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
}

