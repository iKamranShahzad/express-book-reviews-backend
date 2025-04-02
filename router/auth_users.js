const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return !!user; // Return true if a matching user is found, otherwise false
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; // Extract username and password from the request body

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Validate the user credentials
  if (authenticatedUser(username, password)) {
    // Generate a JWT token
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
  const isbn = req.params.isbn; // Extract the ISBN from the request parameters
  const { review } = req.body; // Extract the review from the request body
  const username = req.user.username; // Retrieve the username from the session (decoded JWT)

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if a review is provided
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Add or modify the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Extract the ISBN from the request parameters
  const username = req.user.username; // Retrieve the username from the session (decoded JWT)

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for the book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
