const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({message: "Enter username and password"});
    }
  
    if (isValid(username)) {
      return res.status(409).json({message: "User already exists"});
    }
  
    users.push({username, password});
  
    return res.status(200).json({message: "User successfully registered"});
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
  });
  
  public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let result = {};
  
    for (let isbn in books) {
      if (books[isbn].author === author) {
        result[isbn] = books[isbn];
      }
    }
  
    return res.status(200).json(result);
  });

  public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let result = {};
  
    for (let isbn in books) {
      if (books[isbn].title === title) {
        result[isbn] = books[isbn];
      }
    }
  
    return res.status(200).json(result);
  });

  public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
  });

  async function getAllBooks() {
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  async function getBookByISBN(isbn) {
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
module.exports.general = public_users;
