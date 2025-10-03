const router = require('express').Router();
const { authenticate, authorize, prisma } = require('../utils/auth');
router.use(authenticate);
router.post('/', authorize('ADMIN', 'MANAGER'), async (req, res, next) => {
  try { const { title, period, value, dueDate, userId, teamId } = req.body; const t = await prisma.target.create({ data: { title, period, value, dueDate: dueDate ? new Date(dueDate) : null, userId, teamId } }); res.json(t); } catch (e) { next(e); }
});
router.get('/', async (req, res, next) => { try { const where = {}; if (req.query.period) where.period = req.query.period; if (req.query.userId) where.userId = req.query.userId; if (req.query.teamId) where.teamId = req.query.teamId; const list = await prisma.target.findMany({ where }); res.json(list); } catch (e) { next(e); } });
router.put('/:id/progress', authorize('ADMIN', 'MANAGER'), async (req, res, next) => { try { const { achieved, status } = req.body; const t = await prisma.target.update({ where: { id: req.params.id }, data: { achieved, status } }); res.json(t); } catch (e) { next(e); } });
module.exports = router;
