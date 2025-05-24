const MenuItem = require('../models/MenuItem');

exports.list = async (req, res) => {
  const items = await MenuItem.find({ vendor: req.session.userId });
  res.render('vendor/items', { items, title: 'My Menu' });
};

exports.getNew = (req, res) => {
  res.render('vendor/newItem', { error: null, title: 'Add Item' });
};

exports.postNew = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    await MenuItem.create({
      vendor: req.session.userId,
      name, description, price, imageUrl
    });
    res.redirect('/vendor/items');
  } catch (err) {
    console.error(err);
    res.render('vendor/newItem', { error: 'Failed to add item.', title: 'Add Item' });
  }
};

exports.getEdit = async (req, res) => {
  const item = await MenuItem.findOne({ _id: req.params.id, vendor: req.session.userId });
  if (!item) return res.redirect('/vendor/items');
  res.render('vendor/editItem', { item, error: null, title: 'Edit Item' });
};

// Handle “Edit Item”
exports.postEdit = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      available: !!req.body.available
    };
    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
    await MenuItem.updateOne(
      { _id: req.params.id, vendor: req.session.userId },
      updates
    );
    res.redirect('/vendor/items');
  } catch (err) {
    console.error(err);
    res.render('vendor/editItem', { item: { _id: req.params.id, ...req.body }, error: 'Update failed.', title: 'Edit Item' });
  }
};

// Handle “Delete Item”
exports.delete = async (req, res) => {
  await MenuItem.deleteOne({ _id: req.params.id, vendor: req.session.userId });
  res.redirect('/vendor/items');
};
