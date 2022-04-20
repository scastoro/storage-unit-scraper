import mongoose, { Schema, Types } from 'mongoose';

interface Unit {
  dimensions: {
    length: number;
    width: number;
  };
  price: number;
  climate: boolean;
  promotion?: string;
  description?: string[];
  type?: 'self storage' | 'parking';
  size?: 'small' | 'medium' | 'large' | 'extra large';
  amount_left?: string;
  facility: Types.ObjectId;
}

const UnitSchema = new Schema<Unit>(
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

UnitSchema.virtual('getUnitSize').get(function () {
  return `${this.dimensions.length}' x ${this.dimensions.width}'`;
});

export default mongoose.model('Unit', UnitSchema);
