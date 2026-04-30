const Subject = require('../models/Subject');
const StudySession = require('../models/StudySession');
const Exam = require('../models/Exam');
const { analyzeStudyData } = require('../services/aiService');

const getAnalyticsSummaryData = async (userId) => {
  const [subjects, studySessions, exams] = await Promise.all([
    Subject.find({ user: userId }),
    StudySession.find({ user: userId }).populate('subject', 'name color'),
    Exam.find({ user: userId }).populate('subject', 'name color')
  ]);

  const totalSubjects = subjects.length;
  const totalStudySessions = studySessions.length;
  const totalExams = exams.length;

  const totalStudyMinutes = studySessions.reduce((acc, session) => {
    return acc + session.durationMinutes;
  }, 0);

  const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(2));

  const averageConcentration =
    totalStudySessions > 0
      ? Number(
          (
            studySessions.reduce((acc, session) => acc + session.concentrationLevel, 0) /
            totalStudySessions
          ).toFixed(2)
        )
      : 0;

  const studyMethodCountMap = {};

  for (const session of studySessions) {
    const method = session.studyMethod;
    studyMethodCountMap[method] = (studyMethodCountMap[method] || 0) + 1;
  }

  let mostUsedStudyMethod = null;
  let maxMethodCount = 0;

  for (const method in studyMethodCountMap) {
    if (studyMethodCountMap[method] > maxMethodCount) {
      maxMethodCount = studyMethodCountMap[method];
      mostUsedStudyMethod = method;
    }
  }

  const averageScore =
    totalExams > 0
      ? Number((exams.reduce((acc, exam) => acc + exam.score, 0) / totalExams).toFixed(2))
      : 0;

  const studyBySubjectMap = {};

  for (const session of studySessions) {
    const subjectId = session.subject?._id?.toString();
    if (!subjectId) continue;

    if (!studyBySubjectMap[subjectId]) {
      studyBySubjectMap[subjectId] = {
        subjectId,
        subjectName: session.subject.name,
        subjectColor: session.subject.color,
        totalMinutes: 0
      };
    }

    studyBySubjectMap[subjectId].totalMinutes += session.durationMinutes;
  }

  const studyHoursBySubject = Object.values(studyBySubjectMap).map((item) => ({
    ...item,
    totalHours: Number((item.totalMinutes / 60).toFixed(2))
  }));

  const scoresBySubjectMap = {};

  for (const exam of exams) {
    const subjectId = exam.subject?._id?.toString();
    if (!subjectId) continue;

    if (!scoresBySubjectMap[subjectId]) {
      scoresBySubjectMap[subjectId] = {
        subjectId,
        subjectName: exam.subject.name,
        subjectColor: exam.subject.color,
        totalScore: 0,
        examCount: 0
      };
    }

    scoresBySubjectMap[subjectId].totalScore += exam.score;
    scoresBySubjectMap[subjectId].examCount += 1;
  }

  const averageScoreBySubject = Object.values(scoresBySubjectMap).map((item) => ({
    subjectId: item.subjectId,
    subjectName: item.subjectName,
    subjectColor: item.subjectColor,
    averageScore: Number((item.totalScore / item.examCount).toFixed(2))
  }));

  return {
    totalSubjects,
    totalStudySessions,
    totalExams,
    totalStudyMinutes,
    totalStudyHours,
    averageConcentration,
    mostUsedStudyMethod,
    averageScore,
    studyHoursBySubject,
    averageScoreBySubject
  };
};

const analyzeWithAI = async (req, res) => {
  try {
    const userId = req.user._id;

    const summary = await getAnalyticsSummaryData(userId);

    if (summary.totalStudySessions < 3 || summary.totalExams < 1) {
      return res.status(400).json({
        ok: false,
        message: 'Se necesitan al menos 3 sesiones de estudio y 1 examen para generar un análisis útil'
      });
    }

    const recentStudySessions = await StudySession.find({ user: userId })
      .populate('subject', 'name color')
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    const recentExams = await Exam.find({ user: userId })
      .populate('subject', 'name color')
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    const formattedRecentStudySessions = recentStudySessions.map((session) => ({
      subject: session.subject?.name || 'Sin asignatura',
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      durationMinutes: session.durationMinutes,
      studyMethod: session.studyMethod,
      concentrationLevel: session.concentrationLevel,
      notes: session.notes
    }));

    const formattedRecentExams = recentExams.map((exam) => ({
      subject: exam.subject?.name || 'Sin asignatura',
      title: exam.title,
      date: exam.date,
      score: exam.score,
      notes: exam.notes
    }));

    const analysis = await analyzeStudyData({
      summary,
      recentStudySessions: formattedRecentStudySessions,
      recentExams: formattedRecentExams
    });

    return res.status(200).json({
      ok: true,
      analysis
    });
  } catch (error) {
    console.error('Error en analyzeWithAI:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al generar el análisis con IA'
    });
  }
};

const analyzeSubjectWithAI = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subjectId } = req.params;

    const subject = await Subject.findOne({
      _id: subjectId,
      user: userId
    });

    if (!subject) {
      return res.status(404).json({
        ok: false,
        message: 'Asignatura no encontrada'
      });
    }

    const [studySessions, exams] = await Promise.all([
      StudySession.find({ user: userId, subject: subjectId })
        .populate('subject', 'name color')
        .sort({ date: -1, createdAt: -1 }),
      Exam.find({ user: userId, subject: subjectId })
        .populate('subject', 'name color')
        .sort({ date: -1, createdAt: -1 })
    ]);

    if (studySessions.length < 3 || exams.length < 1) {
      return res.status(400).json({
        ok: false,
        message:
          'Se necesitan al menos 3 sesiones de estudio y 1 examen en esta asignatura para generar un análisis útil'
      });
    }

    const totalStudyMinutes = studySessions.reduce((acc, session) => {
      return acc + session.durationMinutes;
    }, 0);

    const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(2));

    const averageConcentration = Number(
      (
        studySessions.reduce((acc, session) => acc + session.concentrationLevel, 0) /
        studySessions.length
      ).toFixed(2)
    );

    const studyMethodCountMap = {};

    for (const session of studySessions) {
      const method = session.studyMethod;
      studyMethodCountMap[method] = (studyMethodCountMap[method] || 0) + 1;
    }

    let mostUsedStudyMethod = null;
    let maxMethodCount = 0;

    for (const method in studyMethodCountMap) {
      if (studyMethodCountMap[method] > maxMethodCount) {
        maxMethodCount = studyMethodCountMap[method];
        mostUsedStudyMethod = method;
      }
    }

    const averageScore = Number(
      (exams.reduce((acc, exam) => acc + exam.score, 0) / exams.length).toFixed(2)
    );

    const summary = {
      analysisType: 'subject',
      subjectId: subject._id,
      subjectName: subject.name,
      subjectColor: subject.color,
      totalStudySessions: studySessions.length,
      totalExams: exams.length,
      totalStudyMinutes,
      totalStudyHours,
      averageConcentration,
      mostUsedStudyMethod,
      averageScore
    };

    const formattedRecentStudySessions = studySessions.slice(0, 5).map((session) => ({
      subject: session.subject?.name || subject.name,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      durationMinutes: session.durationMinutes,
      studyMethod: session.studyMethod,
      concentrationLevel: session.concentrationLevel,
      notes: session.notes
    }));

    const formattedRecentExams = exams.slice(0, 5).map((exam) => ({
      subject: exam.subject?.name || subject.name,
      title: exam.title,
      date: exam.date,
      score: exam.score,
      notes: exam.notes
    }));

    const analysis = await analyzeStudyData({
      summary,
      recentStudySessions: formattedRecentStudySessions,
      recentExams: formattedRecentExams
    });

    return res.status(200).json({
      ok: true,
      subject: {
        id: subject._id,
        name: subject.name,
        color: subject.color
      },
      analysis
    });
  } catch (error) {
    console.error('Error en analyzeSubjectWithAI:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al generar el análisis por asignatura'
    });
  }
};

module.exports = {
  analyzeWithAI,
  analyzeSubjectWithAI
};