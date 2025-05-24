const Order    = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Place a new order
exports.placeOrder = async (req, res) => {
  const cart = req.session.cart;
  if (!cart || cart.totalQty === 0) {
    return res.redirect('/cart');
  }

  // Build items array from session cart
  const orderItems = Object.values(cart.items).map(ci => ({
    menuItem: ci.item._id,
    name:     ci.item.name,
    price:    ci.item.price,
    quantity: ci.quantity
  }));

  try {
    const order = await Order.create({
      student:    req.session.userId,
      items:      orderItems,
      totalQty:   cart.totalQty,
      totalPrice: cart.totalPrice
    });

    // Clear the cart
    delete req.session.cart;

    // Redirect to confirmation
    res.redirect(`/orders/${order._id}/confirm`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to place order');
  }
};

// Show order confirmation
exports.orderConfirmation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem')
      .lean();
    if (!order) return res.redirect('/orders');
    res.render('orders/confirm', { title: 'Order Confirmed', session: req.session, order });
  } catch (err) {
    console.error(err);
    res.redirect('/orders');
  }
};

// List student’s past orders
exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.session.userId })
      .sort('-createdAt')
      .lean();
    res.render('orders/list', { title: 'My Orders', session: req.session, orders });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};
