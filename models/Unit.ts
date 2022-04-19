const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema(
  {
    dimensions: {
      type: {
        length: Number,
        width: Number,
      },
      required: [true, 'Unit must have dimensions.'],
    },
    price: {
      type: Number,
      required: [true, 'Unit must have a price.'],
    },
    climate: {
      type: Boolean,
      default: false,
    },
    promotion: {
      type: String,
    },
    description: {
      type: [String],
    },
    type: {
      type: String,
      enum: ['self storage', 'parking'],
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra large'],
    },
    amount_left: {
      type: String,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Unit must have an associated Facility.'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Unit', UnitSchema);
export {};
