// controllers/authController.js
const User = require('../models/user');

exports.getRegister = (req, res) => {
  res.render('register', { error: null });
};

exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.postRegister = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.render('register', { error: 'Email already in use.' });
    }
    await User.create({ name, email, password, role });
    return res.redirect('/login');
  } catch (err) {
    console.error(err);
    return res.render('register', { error: 'Registration failed.' });
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await user.matchPassword(password)) {
      return res.render('login', { error: 'Invalid credentials.' });
    }
    req.session.userId = user._id;
    req.session.role   = user.role;
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('login', { error: 'Login failed.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
