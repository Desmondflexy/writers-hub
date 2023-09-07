import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getAuthorById } from "../utils";

/**Authenticates user's token */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  console.log('calling author authenticate middleware function...')
  const secretKey = process.env.JWT_SECRET as string;
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.redirect('/login');
    }
    const decodedToken: any = jwt.verify(token, secretKey);
    req.user = await getAuthorById(decodedToken.authorId);
    next();

  } catch (error: any) {
    return res.render('error', { error, message: error.message });
  }
}


declare global {
  namespace Express {
    interface Request {
      userKey?: any;
      adminKey?: any;
      user?: any
    }
  }
}