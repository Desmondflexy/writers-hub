import { Schema, model } from "mongoose";

export const Book = model("Book", new Schema({
  title: {
    type: String,
    required: true,
  },
  datePublished: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  pageCount: {
    type: Number,
  },
  genre: {
    type: String,
  },
  publisher: {
    type: String,
  },
  authorID: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
}, {
  timestamps: true
}));
