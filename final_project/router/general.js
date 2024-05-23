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
   
   if (isValid(username)){
    return res.status(400).json({ error: 'Username already exists' });
   }

   users.push({ username, password });

   return res.status(200).json({message: 'Username successful'});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    
    new Promise((resolve, reject) => {
        // Simulate asynchronous behavior
        setTimeout(() => {
          resolve(books);
        }, 1000); // Resolve the promise after 1 second
      })
      .then((data) => {
        // Return the book data as JSON response
        return res.status(200).json(data);
      })
      .catch((error) => {
        // Handle any errors that occur
        console.error('Error fetching book list:', error);
        return res.status(500).json({ error: error.message });
      });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
    
    // Simulate asynchronous behavior using a Promise
    new Promise((resolve, reject) => {
        // Check if the book with the specified ISBN exists
        if (books[ISBN]) {
            resolve(books[ISBN]); // Resolve the promise with book details
        } else {
            reject(new Error('Book with specified ISBN does not exist')); // Reject the promise if book not found
        }
    })
    .then((bookDetails) => {
        // Return the book details as JSON response
        return res.status(200).json(bookDetails);
    })
    .catch((error) => {
        // Handle any errors that occur
        console.error('Error fetching book details:', error);
        return res.status(401).json({ error: error.message });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let getAuthor = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === getAuthor);
  new Promise((resolve, reject) => {
    if (booksByAuthor.length > 0){
        resolve(booksByAuthor);
    } else{
        reject(new Error('Book with specified author does not exist'));
    }
    })
    .then((bookDetails) => {
        return res.status(200).json(bookDetails)
    })
    .catch((error) => {
        return res.status(401).json({error: error.message});
    })
//   let getAuthor = req.params.author;
//   const booksByAuthor = Object.values(books).filter(book => book.author === getAuthor);

//   if (booksByAuthor.length > 0){
//     return res.status(200).json({booksByAuthor});
//   }
//   return res.status(404).json({ error: 'No books found for the author' });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let getTitle = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === getTitle);

  new Promise((resolve, reject) => {
    if (booksByTitle.length > 0){
        resolve(booksByTitle);
    } else{
        reject(new Error('Book with specified title does not exist'));
    }
    })
    .then((bookDetails) => {
        return res.status(200).json(bookDetails)
    })
    .catch((error) => {
        return res.status(401).json({error: error.message});
    })

//   if (booksByTitle.length > 0){
//     res.status(200).json(booksByTitle);
//   }
//   return res.status(400).json({error: 'No books found for the author'});
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
