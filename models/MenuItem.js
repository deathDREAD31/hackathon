const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name:       { type: String,  required: true },
  description:{ type: String,  default: '' },
  price:      { type: Number,  required: true },
  imageUrl:   { type: String,  default: '' },
  available:  { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
