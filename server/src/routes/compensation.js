const router = require('express').Router();
const { authenticate, authorize, prisma } = require('../utils/auth');
router.use(authenticate);
router.post('/', authorize('ADMIN', 'MANAGER'), async (req, res, next) => { try { res.json(await prisma.compensation.create({ data: req.body })); } catch (e) { next(e); } });
router.get('/', authorize('ADMIN', 'MANAGER'), async (req, res, next) => { try { res.json(await prisma.compensation.findMany({ where: { userId: req.query.userId } })); } catch (e) { next(e); } });
router.post('/payroll', authorize('ADMIN', 'MANAGER'), async (req, res, next) => { try { res.json(await prisma.payrollRecord.create({ data: req.body })); } catch (e) { next(e); } });
router.get('/payroll', authorize('ADMIN', 'MANAGER'), async (req, res, next) => { try { res.json(await prisma.payrollRecord.findMany({ where: { userId: req.query.userId } })); } catch (e) { next(e); } });
module.exports = router;
