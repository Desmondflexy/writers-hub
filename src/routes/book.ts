import express from 'express';

import { authenticate as auth } from '../middleware/author';
import * as book from '../controller/book';

const router = express.Router();

// BOOK RESOURCES

router.use(auth);

router.get('/', book.index);
router.get('/all', book.all);

router.get('/add', book.add);
router.post('/', book.add);

router.get('/:id', book.getById);

router.get('/:id/update', book.updateById);
router.post('/:id/update', book.updateById);

router.post('/:id/delete', book.deleteById);

router.get('/author/:id', book.byAuthor);

export default router