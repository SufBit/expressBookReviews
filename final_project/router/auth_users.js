const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const findUser = users.find(user => user.username === username);
    
    if (!findUser || findUser.password != password){
        return false
    }
    return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password){
    return res.status(404).json({error: "Username and password required"});
  }

  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password,
    },'access', {expiresIn: 60*60});

    req.session.authorization = {
        accessToken,username
    }

    return res.status(200).json({ message: "Login successful", token: accessToken });
  }

  return res.status(400).json({message: "Error"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username	
  console.log(username)
  const review = req.query.review
  console.log(review);

  let ISBN = req.params.isbn;
  if (!books[ISBN]){
    return res.status(401).json({error: "Book not found"});
  }

  books[ISBN].reviews[username] = review;
   return res.status(200).json({ message: "Review added/updated successfully", reviews: books[ISBN].reviews});
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
    //*Write your code here

    const username = req.session.authorization.username;
    const ISBN = req.params.isbn;
    console.log("Del:", username);
    if (!books[ISBN]) {
        return res.status(401).json({ error: "Book not found" });
    }

    if (books[ISBN].reviews && books[ISBN].reviews[username]) {
        // Delete the review for the given username
        delete books[ISBN].reviews[username];
        // Respond with a success message and the updated reviews
        return res.status(200).json({ message: "Review deleted successfully", reviews: books[ISBN].reviews });
      } else {
        // Respond with an error message if the review doesn't exist
        return res.status(404).json({ error: "Review not found for this user" });
      }
 

 });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
