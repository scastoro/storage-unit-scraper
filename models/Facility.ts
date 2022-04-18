const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required.'],
    },
    address: {
      type: {
        street: {
          type: String,
          required: [true, 'Facility street address is required.'],
        },
        city: { String, required: [true, 'Facility address is required.'] },
        postal_code: {
          Number,
          required: [true, 'Facility address is required.'],
        },
        state: { String, required: [true, 'Facility address is required.'] },
        country: { String, required: [true, 'Facility address is required.'] },
        area: String,
        lat: Number,
        long: Number,
      },
    },
    phone: { type: Number },
    hours: {
      type: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String,
      },
      required: [true, 'Facility hours are required.'],
    },
    access_hours: {
      type: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String,
      },
      required: [true, 'Access hours are required.'],
    },
    features: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Facility', FacilitySchema);
