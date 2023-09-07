import express from 'express';
import { authenticate as auth } from '../middleware/author';
import * as author from '../controller/author';

const router = express.Router();

router.use(auth);

router.get('/all', author.all);
router.get('/:id/profile', author.getById);
router.get('/:id/update', author.updateById);
router.post('/:id/update', author.updateById);
router.post('/:id/delete', author.deleteById);

// router.get('/:id/books', author.getBooks);

export default router
