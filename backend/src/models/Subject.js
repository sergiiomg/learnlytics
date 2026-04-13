const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la asignatura es obligatorio'],
      trim: true
    },
    color: {
      type: String,
      default: '#3b82f6',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Subject', subjectSchema);