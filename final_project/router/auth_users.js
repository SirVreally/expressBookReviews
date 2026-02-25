const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Find user with matching username and password
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      // Generate JWT token signed with secret key "access"
      const accessToken = jwt.sign({ username: user.username }, "access", { expiresIn: '1h' });

      // Store the token in session
      req.session.authorization = { 
        accessToken,
        username 
        };

      return res.status(200).json({ message: "Login successful", accessToken });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  }

  return res.status(400).json({ message: "Username and password are required" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;  // review from query string
    const username = req.session?.authorization?.username;
  
    if (!review) {
      return res.status(400).json({ message: "Review query parameter is required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: `Review for book ${isbn} by user ${username} added/updated.` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;
    console.log(req.session);
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review by user not found for this book" });
    }
  
    // Delete the review for this user
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: `Review by user ${username} for book ${isbn} deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
