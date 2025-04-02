const express = require("express");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const fetchBooks = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };

    const bookList = await fetchBooks();

    return res.status(200).json(bookList);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN using async-await
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const fetchBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        }, 100);
      });
    };

    const book = await fetchBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author using async-await
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;

    const fetchBooksByAuthor = (authorName) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByAuthor = [];

          for (const isbn in books) {
            if (books[isbn].author === authorName) {
              booksByAuthor.push(books[isbn]);
            }
          }

          if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
          } else {
            reject(new Error("No books found by this author"));
          }
        }, 100);
      });
    };

    const authorBooks = await fetchBooksByAuthor(author);
    return res.status(200).json(authorBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title using async-await
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;

    const fetchBooksByTitle = (bookTitle) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByTitle = [];

          for (const isbn in books) {
            if (books[isbn].title === bookTitle) {
              booksByTitle.push(books[isbn]);
            }
          }

          if (booksByTitle.length > 0) {
            resolve(booksByTitle);
          } else {
            reject(new Error("No books found with this title"));
          }
        }, 100);
      });
    };

    const titleBooks = await fetchBooksByTitle(title);
    return res.status(200).json(titleBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 2));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
