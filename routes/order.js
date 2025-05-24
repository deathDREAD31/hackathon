const express = require('express');
const router  = express.Router();
const { ensureStudent, ensureAuth, ensureVendor } = require('../middleware/auth');
const orderCtrl = require('../controllers/orderController');

// Students place order
router.post('/order/place', ensureStudent, orderCtrl.placeOrder);

// Confirmation page
router.get('/orders/:id/confirm', ensureStudent, orderCtrl.orderConfirmation);

// Student’s order history
router.get('/orders', ensureStudent, orderCtrl.listOrders);

// Optional: Vendors view orders to them
router.get('/vendor/orders', ensureVendor, async (req, res) => {
  const Order = require('../models/Order');
  const orders = await Order.find({ 'items.menuItem': { $exists: true } })
    .populate('student')
    .lean();
  res.render('orders/vendorList', { title: 'Vendor Orders', session: req.session, orders });
});

module.exports = router;
