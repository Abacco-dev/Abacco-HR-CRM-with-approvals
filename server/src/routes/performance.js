const router = require('express').Router();
const { authenticate, authorize, prisma } = require('../utils/auth');
router.use(authenticate);
router.post('/reviews', authorize('ADMIN', 'MANAGER'), async (req, res, next) => { try { const { userId, reviewerId, period, rating, feedback, goalsJson } = req.body; const review = await prisma.performanceReview.create({ data: { userId, reviewerId, period, rating, feedback, goalsJson } }); res.json(review); } catch (e) { next(e); } });
router.get('/reviews', async (req, res, next) => { try { const where = {}; if (req.query.userId) where.userId = req.query.userId; const reviews = await prisma.performanceReview.findMany({ where, include: { reviewer: true, user: true } }); res.json(reviews); } catch (e) { next(e); } });
module.exports = router;
