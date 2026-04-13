const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'La asignatura es obligatoria']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'El nombre del examen es obligatorio'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'La fecha del examen es obligatoria']
    },
    score: {
      type: Number,
      required: [true, 'La calificación es obligatoria'],
      min: [0, 'La calificación no puede ser menor que 0'],
      max: [10, 'La calificación no puede ser mayor que 10']
    },
    notes: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Exam', examSchema);