function ensureAuth(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

function ensureVendor(req, res, next) {
  if (req.session.userId && req.session.role === 'vendor') {
    return next();
  }
  res.status(403).send('Access denied: Vendors only');
}

function ensureStudent(req, res, next) {
  if (req.session.userId && req.session.role === 'student') {
    return next();
  }
  res.status(403).send('Access denied: Students only');
}

module.exports = { ensureAuth, ensureVendor, ensureStudent };
