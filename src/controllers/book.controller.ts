import { Request, Response } from "express";
import Book from "../models/book.model";
import Chapter from "../models/chapter.model";
import { Types } from "mongoose";
import User from "../models/user.model";

export function getAllBook(req: Request, res: Response) {
  Book.find()
    .then((books) => {
      res.json({ status: "ok", payload: books });
    })
    .catch(() => {
      res.json({ status: "err" });
    });
}

export function addBook(req: Request, res: Response) {
  if (
    !req.body.name ||
    !req.body.author ||
    !req.body.description ||
    !req.body.image ||
    !req.body.categories ||
    req.body.price === undefined ||
    req.body.price === null
  )
    return res.json({ status: "err", msg: "add book unsuccessful" });
  new Book({
    name: req.body.name,
    author: req.body.author,
    description: req.body.description,
    image: req.body.image,
    categories: req.body.categories.map((x: string) => Types.ObjectId(x)),
    price: req.body.price,
  })
    .save()
    .then(() => {
      res.json({ status: "ok", msg: "add book successful" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: "err", msg: "add book unsuccessful" });
    });
}

export function addChapter(req: Request, res: Response) {
  if (!req.body.name || !req.body.bookId || !req.body.content)
    return res.json({ status: "err", msg: "add chapter unsuccessful" });
  new Chapter({ name: req.body.name, bookId: req.body.bookId, content: req.body.content })
    .save()
    .then(() => {
      res.json({ status: "ok", msg: "add chapter successful" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: "err", msg: "add chapter unsuccessful" });
    });
}

export function getBook(req: Request, res: Response) {
  Book.findById(req.params.id)
    .then(async (book) => {
      if (!book) return res.json({ status: "er", msg: "bookId not found" });
      let user = await User.findById(req.user.id);
      if (!user!.books.includes(Types.ObjectId(req.params.id)))
        return res.json({ status: "er", msg: "user doesn't own this book" });
      res.json({ status: "ok", payload: book });
    })
    .catch(() => res.json({ status: "er", msg: "bookId not found" }));
}

export const getChapter = (req: Request, res: Response) => {
  Chapter.findById(req.params.id)
    .then(async (chapter) => {
      if (!chapter) return res.json({ status: "er", msg: "Id not found" });
      let user = await User.findById(req.user.id);
      if (!user!.books.includes(Types.ObjectId(chapter.bookId)))
        return res.json({ status: "er", msg: "user doesn't own this book" });
      return res.json({ status: "ok", payload: chapter });
    })
    .catch(() => res.json({ status: "er", msg: "Id not found" }));
};
