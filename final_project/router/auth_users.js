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
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  }

  return res.status(400).json({ message: "Username and password are required" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
      // Extract email parameter from request URL
    const ISBN = req.params.isbn;
    let isbn = isbn[isbn];  // Retrieve isbn object associated with review
    if (isbn) {  // Check if friend exists
        let review = req.body.review;
        // Update review if provided in request body
        if (review) {
            isbn["Review"] = review;
        }
        isbn[review] = isbn;  // Update review in `isbn` object
        res.send(`Book review ${review} has been added.`);
    } else {
        // Respond if isbn for book is not found to make review
        res.send("Unable to add review!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
