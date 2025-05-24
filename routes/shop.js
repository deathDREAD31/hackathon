// routes/shop.js
const express = require('express');
const router  = express.Router();
const { ensureAuth } = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');

// GET /menu — student browsing page
router.get('/menu', ensureAuth, async (req, res) => {
  try {
    // only show available items
    const items = await MenuItem.find({ available: true }).lean();
    res.render('shop/menu', { title: 'Menu', items });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
