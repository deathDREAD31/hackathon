// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const studentEmailRegex = /^u\d+@student\.cuet\.ac\.bd$/;
const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(val) {
        // enforce CUET student email for students
        if (this.role === 'student') {
          return studentEmailRegex.test(val);
        }
        // allow general emails for vendors
        return generalEmailRegex.test(val);
      },
      message: props => {
        if (props.instance && props.instance.role === 'student') {
          return 'Please use a valid CUET student email (e.g. u2204031@student.cuet.ac.bd)';
        }
        return 'Please use a valid email address.';
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student','vendor'],
    default: 'student'
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare helper
userSchema.methods.matchPassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
