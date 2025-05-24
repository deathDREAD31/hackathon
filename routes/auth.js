const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');

router.get('/', (req, res) => {
  return res.redirect('/login');
});

// Public
router.get('/register', auth.getRegister);
router.post('/register', auth.postRegister);

router.get('/login', auth.getLogin);
router.post('/login', auth.postLogin);

// Logout
router.get('/logout', auth.logout);

// Dashboard (protected)
function ensureAuth(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}
const User = require('../models/user');

router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) throw new Error('User not found');
    res.render('dashboard', {
      title: 'Dashboard',
      user
    });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});


module.exports = router;
