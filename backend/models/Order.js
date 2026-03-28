// ============================================
// Order Model - Order Management & Tracking
// ============================================
const mongoose = require('mongoose');

// Auto-increment counter for invoice numbers
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', counterSchema);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready for Pickup', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    deliveryAddress: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'COD',
    },
    // Track status changes over time for delivery tracking
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Generate invoice number before saving
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'invoiceNumber',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      this.invoiceNumber = `INV-${dateStr}-${String(counter.seq).padStart(4, '0')}`;
    } catch (err) {
      // Fallback: use timestamp-based ID
      this.invoiceNumber = `INV-${Date.now()}`;
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
