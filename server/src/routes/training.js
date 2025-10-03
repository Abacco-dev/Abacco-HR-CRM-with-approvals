const router = require('express').Router();
const { authenticate, authorize, prisma } = require('../utils/auth');
router.use(authenticate);
router.post('/', authorize('ADMIN', 'MANAGER'), async (req, res, next) => { try { const t = await prisma.training.create({ data: req.body }); res.json(t); } catch (e) { next(e); } });
router.get('/', async (req, res, next) => { try { const list = await prisma.training.findMany({ include: { enrollments: true } }); res.json(list); } catch (e) { next(e); } });
router.post('/:id/enroll', async (req, res, next) => { try { const enroll = await prisma.enrollment.create({ data: { trainingId: req.params.id, userId: req.user.id } }); res.json(enroll); } catch (e) { next(e); } });
module.exports = router;
