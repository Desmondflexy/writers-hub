import { Schema, model } from "mongoose";

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
    // required: true,
  },
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
}, {
  timestamps: true
});


export const Author = model("Author", authorSchema);
