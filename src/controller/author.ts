import { Request, Response } from "express";
import { Author } from "../model/author";
import { Book } from "../model/book";
import * as utils from "../utils";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";


/**Sign up a new user */
export async function signup(req: Request, res: Response) {
  if (req.method === 'GET'){
    res.render('signup');
    return;
  }

  // validate user req.body input
  const result = utils.registerValidator.validate(req.body, utils.options);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const { email, password } = req.body;

  // check if user email already exists in database
  let author = await Author.findOne({ email });
  if (author) {
    res.status(400).send("email already exists!");
    return;
  }

  try {
    const content = { ...req.body, password: await bcrypt.hash(password, 10) }
    author = new Author(content);
    await author.save();
    res.redirect('/login');
    return;
  }
  catch (error: any) {
    res.status(500).send(error);
    return;
  }
}

/**Login a user*/
export async function login(req: Request, res: Response) {
  if (req.url.split('?')[0] === '/auth/google/redirect'){
    // login with google
    giveToken(req.user, res);
    return;
  }
  if (req.cookies.token) {
    res.redirect('/books');
    return;
  }
  if (req.method === 'GET') {
    res.render('login');
    return;
  }

  try {
    const result = utils.loginValidator.validate(req.body, utils.options);
    if (result.error) {
      res.status(400).send("Invalid login details");
      return;
    }

    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
      res.status(400).send("Invalid login details");
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, author.password as string);
    if (!isValidPassword) {
      res.status(400).send("Invalid login details");
      return;
    }

    giveToken(author, res);
    return;

  }
  catch (error: any) {
    res.status(500);
    res.render('error', { error, message: error.message });
    return;
  }
}

/**Logout a user*/
export async function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.redirect('/');
}

/**Get all authors */
export async function all(req: Request, res: Response) {
  try {
    const authors = await Author.find()
      .select('name email phone books')
      .populate('books', 'title genre');
    res.json(authors);

  } catch (error: any) {
    res.status(500).json(error.message);
  }
}

/**Get author by id */
export async function getById(req: Request, res: Response) {
  console.log('-- GET AUTHOR BY ID --');
  try {
    const user = req.user;

    const author = await Author.findById(req.params.id)
      .select('name email phone books')
      .populate('books', 'title pageCount');

    if (!author) throw new Error("Author not found!");

    // whether or not to include the edit and delete button.
    const isAuthorized = user.id === author.id;

    res.render('author-details', { author, user, isAuthorized });

  } catch (error: any) {
    res.status(500).json(error.message);
  }
}

/**Update author by id */
export async function updateById(req: Request, res: Response) {
  const id = req.params.id;
  const user = req.user;
  try {
    const author = await Author.findById(id);
    if (!author) return res.status(404).send("Author not found!")

    if (req.method === 'GET') return res.render('author-update', { author, user });

    Object.assign(author, { ...author, ...req.body });
    await author.save();

    return res.redirect(`/authors/${id}/profile`);

  } catch (error: any) {
    return res.send(error.message);
  }
}

/**Delete an author by id */
export async function deleteById(req: Request, res: Response) {
  try {
    await Book.deleteMany({ authorID: req.params.id });
    await Author.findByIdAndDelete(req.params.id);
    res.clearCookie('token');
    return res.redirect('/signup');

  } catch (error: any) {
    return res.render('error', { error, message: error.message });
  }
}

/**Signup with google account */
export async function signupGoogle(req: Request, res: Response) {

}

/**Give user a token, save token in cookies and redirect to user dashboard */
function giveToken(user: any, res: Response) {
  const secretKey = process.env.JWT_SECRET as string;
  const expiresIn = 1 * 60 * 60;
  const token = Jwt.sign({ authorId: user._id }, secretKey, { expiresIn });
  // save token as a cookie
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: expiresIn * 1000,  // in milliseconds
  });
  res.redirect('/books');
  return;
}