const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem'); // <-- Use MenuItem instead of Item
const { ensureStudent } = require('../middleware/auth');

// Add item to cart
router.post('/cart/add/:id', ensureStudent, async (req, res) => {
  const itemId = req.params.id;
  const item = await MenuItem.findById(itemId); // <-- Use MenuItem model here

  if (!item) return res.status(404).send('Item not found');

  // Init cart if it doesn't exist
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0
    };
  }

  const cart = req.session.cart;

  if (!cart.items[itemId]) {
    cart.items[itemId] = { item, quantity: 1 };
  } else {
    cart.items[itemId].quantity++;
  }

  cart.totalQty++;
  cart.totalPrice += item.price;

  res.redirect('/cart');
});

// Show cart
router.get('/cart', ensureStudent, (req, res) => {
  const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
  res.render('cart', {
    title: 'Your Cart',
    session: req.session,
    cart
  });
});

// Remove item from cart
router.post('/cart/remove/:id', ensureStudent, (req, res) => {
  const itemId = req.params.id;
  const cart = req.session.cart;

  if (!cart || !cart.items[itemId]) return res.redirect('/cart');

  const qty = cart.items[itemId].quantity;
  const price = cart.items[itemId].item.price;

  cart.totalQty -= qty;
  cart.totalPrice -= qty * price;

  delete cart.items[itemId];

  res.redirect('/cart');
});

module.exports = router;
