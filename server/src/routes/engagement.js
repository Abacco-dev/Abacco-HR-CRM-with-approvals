const router = require('express').Router();
const { authenticate, authorize, prisma } = require('../utils/auth');
router.use(authenticate);
router.post('/surveys', authorize('ADMIN', 'MANAGER'), async (req, res, next) => {
  try {
    const { title, questions } = req.body;
    const survey = await prisma.survey.create({ data: { title } });
    for (const q of questions || []) {
      await prisma.surveyQuestion.create({ data: { surveyId: survey.id, text: q.text, qtype: q.qtype || 'text' } });
    }
    const full = await prisma.survey.findUnique({ where: { id: survey.id }, include: { questions: true } });
    res.json(full);
  } catch (e) { next(e); }
});
router.get('/surveys', async (req, res, next) => { try { res.json(await prisma.survey.findMany({ include: { questions: true } })); } catch (e) { next(e); } });
router.post('/surveys/:id/respond', async (req, res, next) => { try { const surveyId = req.params.id; const { answers } = req.body; const resp = await prisma.surveyResponse.create({ data: { surveyId, userId: req.user.id } }); for (const a of answers || []) { await prisma.surveyAnswer.create({ data: { responseId: resp.id, questionId: a.questionId, value: a.value } }); } res.json({ ok: true }); } catch (e) { next(e); } });
router.post('/recognitions', async (req, res, next) => { try { const { toUserId, message, points } = req.body; const rec = await prisma.recognition.create({ data: { fromUserId: req.user.id, toUserId, message, points: points || 1 } }); res.json(rec); } catch (e) { next(e); } });
router.get('/recognitions', async (req, res, next) => { try { const list = await prisma.recognition.findMany({ include: { to: true, from: true }, orderBy: { createdAt: 'desc' } }); res.json(list); } catch (e) { next(e); } });
module.exports = router;
