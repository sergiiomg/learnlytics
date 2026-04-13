const Exam = require('../models/Exam');
const Subject = require('../models/Subject');

const createExam = async (req, res) => {
  try {
    const { subject, title, date, score, notes } = req.body;

    if (!subject || !title || !date || score === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'Asignatura, título, fecha y calificación son obligatorios'
      });
    }

    const subjectExists = await Subject.findOne({
      _id: subject,
      user: req.user._id
    });

    if (!subjectExists) {
      return res.status(404).json({
        ok: false,
        message: 'La asignatura no existe o no pertenece al usuario'
      });
    }

    const exam = new Exam({
      subject,
      user: req.user._id,
      title: title.trim(),
      date,
      score,
      notes: notes?.trim() || ''
    });

    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
      .populate('subject', 'name color');

    return res.status(201).json({
      ok: true,
      message: 'Examen registrado correctamente',
      exam: populatedExam
    });
  } catch (error) {
    console.error('Error en createExam:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ user: req.user._id })
      .populate('subject', 'name color')
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      ok: true,
      count: exams.length,
      exams
    });
  } catch (error) {
    console.error('Error en getExams:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, title, date, score, notes } = req.body;

    const exam = await Exam.findOne({
      _id: id,
      user: req.user._id
    });

    if (!exam) {
      return res.status(404).json({
        ok: false,
        message: 'Examen no encontrado'
      });
    }

    if (!subject || !title || !date || score === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'Asignatura, título, fecha y calificación son obligatorios'
      });
    }

    const subjectExists = await Subject.findOne({
      _id: subject,
      user: req.user._id
    });

    if (!subjectExists) {
      return res.status(404).json({
        ok: false,
        message: 'La asignatura no existe o no pertenece al usuario'
      });
    }

    exam.subject = subject;
    exam.title = title.trim();
    exam.date = date;
    exam.score = score;
    exam.notes = notes?.trim() || '';

    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
      .populate('subject', 'name color');

    return res.status(200).json({
      ok: true,
      message: 'Examen actualizado correctamente',
      exam: populatedExam
    });
  } catch (error) {
    console.error('Error en updateExam:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findOne({
      _id: id,
      user: req.user._id
    });

    if (!exam) {
      return res.status(404).json({
        ok: false,
        message: 'Examen no encontrado'
      });
    }

    await exam.deleteOne();

    return res.status(200).json({
      ok: true,
      message: 'Examen eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteExam:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createExam,
  getExams,
  updateExam,
  deleteExam
};