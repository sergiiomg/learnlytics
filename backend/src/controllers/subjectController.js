const Subject = require('../models/Subject');

const createSubject = async (req, res) => {
  try {
    const { name, color, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'El nombre de la asignatura es obligatorio'
      });
    }

    const existingSubject = await Subject.findOne({
      name: name.trim(),
      user: req.user._id
    });

    if (existingSubject) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una asignatura con ese nombre'
      });
    }

    const subject = new Subject({
      name: name.trim(),
      color: color?.trim() || '#3b82f6',
      description: description?.trim() || '',
      user: req.user._id
    });

    await subject.save();

    return res.status(201).json({
      ok: true,
      message: 'Asignatura creada correctamente',
      subject
    });
  } catch (error) {
    console.error('Error en createSubject:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      count: subjects.length,
      subjects
    });
  } catch (error) {
    console.error('Error en getSubjects:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, description } = req.body;

    const subject = await Subject.findOne({
      _id: id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        ok: false,
        message: 'Asignatura no encontrada'
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'El nombre de la asignatura es obligatorio'
      });
    }

    const duplicateSubject = await Subject.findOne({
      _id: { $ne: id },
      name: name.trim(),
      user: req.user._id
    });

    if (duplicateSubject) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe otra asignatura con ese nombre'
      });
    }

    subject.name = name.trim();
    subject.color = color?.trim() || subject.color;
    subject.description = description?.trim() || '';

    await subject.save();

    return res.status(200).json({
      ok: true,
      message: 'Asignatura actualizada correctamente',
      subject
    });
  } catch (error) {
    console.error('Error en updateSubject:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findOne({
      _id: id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        ok: false,
        message: 'Asignatura no encontrada'
      });
    }

    await subject.deleteOne();

    return res.status(200).json({
      ok: true,
      message: 'Asignatura eliminada correctamente'
    });
  } catch (error) {
    console.error('Error en deleteSubject:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
};