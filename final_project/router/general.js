const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const register = req.params.username
  //Check if username is in request body
  if (req.body.username){
    //Create or update user's details based on provided information

  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Send JSON response with formatted book data
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Retrieve the book parameter from the ISBN and show corresponding book
  const isbn = req.params.isbn;
  res.send(isbn[books]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Retrieve the book parameter from the Author and show corresponding book
  const author = req.params.author;
  res.send(author[books]);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Retrieve the book parameter from the Title and show corresponding book(s)
  const title = req.params.title;
  res.send(title[books]);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Retrieve the Book parameter from the review and show corresponding information
  const review = req.params.review;
  res.send(review[books]);
});

module.exports.general = public_users;
