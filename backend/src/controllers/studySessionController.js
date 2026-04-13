const StudySession = require('../models/StudySession');
const Subject = require('../models/Subject');

const createStudySession = async (req, res) => {
  try {
    const {
      subject,
      date,
      startTime,
      endTime,
      durationMinutes,
      studyMethod,
      concentrationLevel,
      notes
    } = req.body;

    if (
      !subject ||
      !date ||
      !startTime ||
      !endTime ||
      !durationMinutes ||
      !studyMethod ||
      !concentrationLevel
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos obligatorios deben estar informados'
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

    const studySession = new StudySession({
      subject,
      user: req.user._id,
      date,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      durationMinutes,
      studyMethod: studyMethod.trim(),
      concentrationLevel,
      notes: notes?.trim() || ''
    });

    await studySession.save();

    const populatedSession = await StudySession.findById(studySession._id)
      .populate('subject', 'name color');

    return res.status(201).json({
      ok: true,
      message: 'Sesión de estudio creada correctamente',
      studySession: populatedSession
    });
  } catch (error) {
    console.error('Error en createStudySession:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const getStudySessions = async (req, res) => {
  try {
    const studySessions = await StudySession.find({ user: req.user._id })
      .populate('subject', 'name color')
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      ok: true,
      count: studySessions.length,
      studySessions
    });
  } catch (error) {
    console.error('Error en getStudySessions:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createStudySession,
  getStudySessions
};