const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const basicAuth = require('basic-auth');

function requireAdmin(req, res, next){
  const user = basicAuth(req);
  const pass = process.env.ADMIN_PASS;
  if (!user || user.pass !== pass) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Create order
router.post('/orders', async (req, res) => {
  try {
    const { name, phone, address, product, quantity, note } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'Name and phone required' });
    const order = new Order({ name, phone, address, product, quantity, note });
    await order.save();
    // Respond with a WhatsApp link so frontend can redirect user to WhatsApp optionally
    const whatsappText = encodeURIComponent(
      `طلب جديد من ${name}%0Aمنتج: ${product || '-'}%0Aكمية: ${quantity}%0Aرقم: ${phone}%0Aالعنوان: ${address || '-'}%0Aملاحظات: ${note || '-'}`
    );
    res.json({ message: 'Order saved', order, whatsappLink: `https://wa.me/?text=${whatsappText}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders (admin)
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
