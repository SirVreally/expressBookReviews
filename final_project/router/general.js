const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Promise example same as above
let myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved");
  }, 6000);
});

console.log("Before calling promise");

async function fetchBooks() {
  try {
    const successMessage = await myPromise;
    console.log("From Async-Await " + successMessage);

    const response = await axios.get('http://localhost:5000/books');
    console.log("Books list (Async-Await):", response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

fetchBooks();

console.log("After calling promise");

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const doesExist = (username) => {
        return users.some(user => user.username === username);
      };
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Send JSON response with formatted book data
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Since books keys are numbers as strings, directly access the book by key
  const book = books[isbn];

  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: "Book not found for the given ISBN." });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  // Convert books object to array
  const booksArray = Object.values(books);

  // Filter books by author (case-insensitive)
  const filtered_books = booksArray.filter(book => 
    book.author.toLowerCase() === author
  );

  if (filtered_books.length > 0) {
    res.send(filtered_books);
  } else {
    res.status(404).send({ message: "No books found for the given author." });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  // Convert books object to an array
  const booksArray = Object.values(books);

  // Filter books by title (case-insensitive)
  const filtered_books = booksArray.filter(book => 
    book.title.toLowerCase() === title
  );

  if (filtered_books.length > 0) {
    res.send(filtered_books);
  } else {
    res.status(404).send({ message: "No books found for the given title." });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const book = books[isbn];
  
    if (book) {
      res.send(book.reviews);
    } else {
      res.status(404).send({ message: "Book not found for the given ISBN." });
    }
  });

  // Post book Review
  

module.exports.general = public_users;
