import { NextFunction, Request, Response } from "express";
import { Book } from "../model/book";
import { Author } from "../model/author";

// CONTROLLERS TO BOOK RESOURCES

/**Index page when author logs in, like a dashboard, explore books in database */
export async function index(req: Request, res: Response) {
  console.log('-- INDEX --');
  const user = req.user;
  if (!user) return res.render('login');

  try {
    const books = await Book.find().populate('authorID', 'name id');
    const author = user;
    res.render('author-library', { author, books, user });
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
}

/**Get book details by id */
export async function getById(req: Request, res: Response) {
  console.log('-- GET BY ID --');
  const user = req.user;
  if (!user) {
    res.send("Please login");
    return;
  }

  try {
    const book = await Book.findById(req.params.id).populate('authorID', 'name');
    if (!book) throw new Error("Book not found!");

    const isAuthorized = user.books.includes(book.id);

    res.render('book-details', { user, book, isAuthorized });
    return;

  } catch (error: any) {
    res.render('error', { error, message: error.message });
    return;
  }
}

/**Delete a book by id */
export async function deleteById(req: Request, res: Response) {
  console.log('-- DELETE BOOK BY ID --');
  const user = req.user;
  if (!user) {
    res.send("Please login");
    return;
  }

  try {
    await Book.findByIdAndDelete(req.params.id);

    res.redirect('/books');
    return;

  } catch (error: any) {
    res.render('error', { error, message: error.message });
    return;
  }
}

/**Add a new book */
export async function add(req: Request, res: Response) {
  console.log('-- ADD A NEW BOOK --');
  const user = req.user;
  if (!user) {
    res.send("Please login");
    return;
  }

  if (req.method === 'GET') {
    res.render('add', { user });
    return;
  }

  req.body.authorID = req.user.id;

  try {
    const newBook = new Book(req.body);

    user.books.push(newBook._id);  // referenced by the book id
    await user.save();
    await newBook.save();

    res.redirect('/books');
    return;
  } catch (error: any) {
    res.status(500).send(error.message);
    return;
  }
}

/**Update a book by id -- books/:id/update */
export async function updateById(req: Request, res: Response) {
  console.log('-- UPDATE BOOK BY ID --');
  const author = req.user;
  const user = req.user;
  if (!author) return res.status(400).send("Please login");

  const id = req.params.id;
  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).send("Book not found!");

    if (req.method === 'GET') return res.render('update', { book, author, user });


    Object.assign(book, { ...book, ...req.body });
    await book.save();
    return res.redirect(`/books/${id}`);

  } catch (error: any) {
    return res.status(500).send(error.message);
  }
}

/**Get all books -- /books/all */
export async function all(req: Request, res: Response) {
  console.log('-- GET ALL BOOKS IN DATABASE --');

  try {
    const books = await Book.find().populate('authorID');
    res.json(books);

  } catch (error: any) {
    return res.status(500).send(error.message);
  }
}

/**Get all books by author */
export async function byAuthor(req: Request, res: Response) {
  console.log('-- GET ALL BOOKS BY AUTHOR --');
  const user = req.user;
  if (!user) return res.send("Please login");

  try {
    const books = await Book.find({ authorID: req.params.id }).populate('authorID', 'name id');
    const author = user;
    return res.render('author-library', { author, books, user });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}


