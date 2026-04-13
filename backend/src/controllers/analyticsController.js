const Subject = require('../models/Subject');
const StudySession = require('../models/StudySession');
const Exam = require('../models/Exam');

const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user._id;

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
        ? Number(
            (exams.reduce((acc, exam) => acc + exam.score, 0) / totalExams).toFixed(2)
          )
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

    return res.status(200).json({
      ok: true,
      summary: {
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
      }
    });
  } catch (error) {
    console.error('Error en getAnalyticsSummary:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAnalyticsSummary
};