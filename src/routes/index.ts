import express, { Request, Response } from 'express';
import * as author from '../controller/author';
import passport from 'passport';

const router = express.Router();

router.get('/', async function (req: Request, res: Response) {
  return res.render('index', { title: `The Authors' Library`, token: req.cookies.token });
})

router.post('/signup', author.signup);
router.get('/signup', author.signup);

router.post('/login', author.login);
router.get('/login', author.login);

router.post("/logout", author.logout);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));
router.get('/auth/google/redirect', passport.authenticate('google'), author.login);

export default router