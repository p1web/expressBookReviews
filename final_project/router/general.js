const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();

const doesExist = (username) => {
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

public_users.post("/register", (req,res) => {

    const username = req.body.username?.trim();
    const password = req.body.password?.trim();
    
    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }else{
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     // return res.send(JSON.stringify(books))
//     return res.status(200).json(books);
// });

public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                resolve(books);
            });
        };

        const allBooks = await getBooks();
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   const result = books[isbn];
//   return res.status(200).json({data: result});
//  });

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        });
    };

    try {
        const bookDetails = await getBookByISBN(isbn);
        return res.status(200).json(bookDetails);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author.toLowerCase();
//     const results = [];
//     for (let key in books) {
//         if (books[key].author.toLowerCase() === author) {
//             results.push({ id: key, ...books[key] });
//         }
//     }
//     if (results.length > 0) {
//         return res.status(200).json(results);
//     } else {
//     return res.status(404).json({ message: "Author not found" });
//     }
// });

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
    const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
            const results = [];
            for (let key in books) {
                if (books[key].author.toLowerCase() === author) {
                    results.push({ id: key, ...books[key] });
                }
            }
            if (results.length > 0) {
                resolve(results);
            } else {
                reject("Author not found");
            }
        });
    };

    try {
        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title.toLowerCase();
//     const results = [];
//     for (let key in books) {
//         if (books[key].title.toLowerCase() === title) {
//             results.push({ id: key, ...books[key] });
//         }
//     }
//     if (results.length > 0) {
//         return res.status(200).json(results);
//     } else {
//     return res.status(404).json({ message: "Title not found" });
//     }
// });

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
    const getBooksByTitle = (title) => {
        return new Promise( (resolve, reject)=>{
            const results = [];
            for (let key in books) {
                if (books[key].title.toLowerCase() === title) {
                    results.push({ id: key, ...books[key] });
                }
            }
            if (results.length > 0) {
                resolve(results)
            } else {
                reject("Title not found")
            }
        })
    }
    try {
        const booksByTitle = await getBooksByTitle(title);
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const reviews = books[isbn].reviews;

    if (!reviews || Object.keys(reviews).length === 0) {
      return res.status(200).json({ message: "No reviews available for this book." });
    }

    return res.status(200).json(reviews);
});

module.exports.general = public_users;
