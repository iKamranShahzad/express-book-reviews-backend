const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return !!user;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Validate the user credentials
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "1h",
    });

    // Save the token in the session
    req.session.token = token;

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
