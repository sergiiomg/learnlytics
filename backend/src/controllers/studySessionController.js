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

const updateStudySession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await StudySession.findOne({
      _id: id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        ok: false,
        message: 'Sesión no encontrada'
      });
    }

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

    session.subject = subject;
    session.date = date;
    session.startTime = startTime.trim();
    session.endTime = endTime.trim();
    session.durationMinutes = durationMinutes;
    session.studyMethod = studyMethod.trim();
    session.concentrationLevel = concentrationLevel;
    session.notes = notes?.trim() || '';

    await session.save();

    const populatedSession = await StudySession.findById(session._id)
      .populate('subject', 'name color');

    return res.status(200).json({
      ok: true,
      message: 'Sesión actualizada correctamente',
      studySession: populatedSession
    });
  } catch (error) {
    console.error('Error en updateStudySession:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const deleteStudySession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await StudySession.findOne({
      _id: id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        ok: false,
        message: 'Sesión no encontrada'
      });
    }

    await session.deleteOne();

    return res.status(200).json({
      ok: true,
      message: 'Sesión eliminada correctamente'
    });
  } catch (error) {
    console.error('Error en deleteStudySession:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
    createStudySession,
    getStudySessions,
    updateStudySession,
    deleteStudySession
};