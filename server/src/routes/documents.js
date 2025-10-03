const router = require('express').Router();
const { authenticate, authorize, prisma } = require('../utils/auth');
router.use(authenticate);
router.post('/', async (req, res, next) => { try { const doc = await prisma.document.create({ data: { userId: req.body.userId || req.user.id, type: req.body.type, url: req.body.url } }); res.json(doc); } catch (e) { next(e); } });
router.get('/', async (req, res, next) => { try { const docs = await prisma.document.findMany({ where: { userId: req.query.userId || req.user.id } }); res.json(docs); } catch (e) { next(e); } });
module.exports = router;
