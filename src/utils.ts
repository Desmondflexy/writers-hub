import Joi from "joi";
import { Author } from "./model/author";
import { Book } from "./model/book";

export const registerValidator = Joi.object().keys({
  name: Joi.string().lowercase().required(),
  email: Joi.string().lowercase().required(),
  password: Joi.string().min(6).max(15).required(),
  phone: Joi.string().required(),
});

export const loginValidator = Joi.object().keys({
  email: Joi.string().lowercase().required(),
  password: Joi.string().min(6).max(35).required(),
});

export const bookValidator = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  genre: Joi.string().required(),
  publisher: Joi.string().required(),
  datePublished: Joi.date().required(),
});

/**validation options*/
export const options = {
  abortEarly: false,
  errors: { wrap: { label: "" } }
};


/**Get all books by an author */


/**Get author by id */
export async function getAuthorById(id: string) {
  const author = await Author.findOne({_id: id});
  return author;
}

/**Get all authors */


