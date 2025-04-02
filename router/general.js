const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from the request body

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password }); // Add the user to the users array
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters

  if (books[isbn]) {
    // If the book with the given ISBN exists, return its details
    return res.status(200).send(JSON.stringify(books[isbn], null, 2));
  } else {
    // If the book with the given ISBN does not exist, return a 404 error
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author; // Retrieve the author from the request parameters
  const booksByAuthor = []; // Initialize an array to store books by the given author

  // Iterate through the books object
  for (const isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]); // Add the book to the array if the author matches
    }
  }

  if (booksByAuthor.length > 0) {
    // If books by the given author are found, return them
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
  } else {
    // If no books by the given author are found, return a 404 error
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title; // Retrieve the title from the request parameters
  const booksByTitle = []; // Initialize an array to store books with the given title

  // Iterate through the books object
  for (const isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]); // Add the book to the array if the title matches
    }
  }

  if (booksByTitle.length > 0) {
    // If books with the given title are found, return them
    return res.status(200).send(JSON.stringify(booksByTitle, null, 2));
  } else {
    // If no books with the given title are found, return a 404 error
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters

  if (books[isbn]) {
    // If the book with the given ISBN exists, return its reviews
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 2));
  } else {
    // If the book with the given ISBN does not exist, return a 404 error
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
