const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: [true, 'La fecha es obligatoria']
    },
    startTime: {
      type: String,
      required: [true, 'La hora de inicio es obligatoria']
    },
    endTime: {
      type: String,
      required: [true, 'La hora de fin es obligatoria']
    },
    durationMinutes: {
      type: Number,
      required: [true, 'La duración es obligatoria'],
      min: [1, 'La duración debe ser mayor que 0']
    },
    studyMethod: {
      type: String,
      required: [true, 'El método de estudio es obligatorio'],
      trim: true
    },
    concentrationLevel: {
      type: Number,
      required: [true, 'El nivel de concentración es obligatorio'],
      min: 1,
      max: 5
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

module.exports = mongoose.model('StudySession', studySessionSchema);