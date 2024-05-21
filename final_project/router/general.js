const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
   // Format the books array with indentation
   if (!username || !password){
    return res.status(400).json({error: 'Username, password required'})
   }
   
   if (users.hasOwnProperty(username)){
    return res.status(400).json({ error: 'Username already exists' });
   }

   users[username] = password;

   return res.status(200).json({message: 'Username successful'});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let ISBN1 = req.params.isbn;
  if (books[ISBN1]){
    return res.status(200).json(books[ISBN1]);
  }
  return res.status(401).json({error:'Error ISBN does not exist'});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let getAuthor = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === getAuthor);

  if (booksByAuthor.length > 0){
    return res.status(200).json({booksByAuthor});
  }
  return res.status(404).json({ error: 'No books found for the author' });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let getTitle = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === getTitle);
  if (booksByTitle.length > 0){
    res.status(200).json(booksByTitle);
  }
  return res.status(400).json({error: 'No books found for the author'});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let reviews1 = []
  let ISBN = req.params.isbn;
  console.log(ISBN);
  for (let i in books){
    console.log(i);
    if (i == ISBN){
        reviews1.push(books[i].reviews);
        console.log(books[i].reviews);
        return res.status(200).json(reviews1);
    }
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
