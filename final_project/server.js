const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key_here';

// Middleware
app.use(express.json());

// Load books database
let books = require('./booksdb.json');

// Registered users
let registeredUsers = {};

// ==========================================
// Task 2: Get All Books
// ==========================================
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// ==========================================
// Task 3: Get Book by ISBN
// ==========================================
app.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  let foundBooks = [];
  
  for (let key in books) {
    if (books[key].isbn === isbn) {
      foundBooks.push({
        id: key,
        ...books[key]
      });
    }
  }
  
  if (foundBooks.length > 0) {
    res.status(200).json(foundBooks);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// ==========================================
// Task 4: Get Books by Author
// ==========================================
app.get('/author/:author', (req, res) => {
  const { author } = req.params;
  let foundBooks = [];
  
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      foundBooks.push({
        id: key,
        ...books[key]
      });
    }
  }
  
  if (foundBooks.length > 0) {
    res.status(200).json(foundBooks);
  } else {
    res.status(404).json({ message: 'No books found by this author' });
  }
});

// ==========================================
// Task 5: Get Books by Title
// ==========================================
app.get('/title/:title', (req, res) => {
  const { title } = req.params;
  let foundBooks = [];
  
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      foundBooks.push({
        id: key,
        ...books[key]
      });
    }
  }
  
  if (foundBooks.length > 0) {
    res.status(200).json(foundBooks);
  } else {
    res.status(404).json({ message: 'No books found with this title' });
  }
});

// ==========================================
// Task 6: Get Book Reviews
// ==========================================
app.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  
  for (let key in books) {
    if (books[key].isbn === isbn) {
      return res.status(200).json(books[key].reviews);
    }
  }
  
  res.status(404).json({ message: 'Book not found' });
});

// ==========================================
// Task 7: Register New User
// ==========================================
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  if (registeredUsers[username]) {
    return res.status(409).json({ message: 'User already exists' });
  }
  
  registeredUsers[username] = password;
  res.status(201).json({ message: 'User successfully registered' });
});

// ==========================================
// Task 8: Login User
// ==========================================
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  if (!registeredUsers[username]) {
    return res.status(401).json({ message: 'User does not exist' });
  }
  
  if (registeredUsers[username] !== password) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful', token });
});

// ==========================================
// Verify JWT Token
// ==========================================
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }
  
  try {
    const bearerToken = token.split(' ')[1];
    const decoded = jwt.verify(bearerToken, SECRET_KEY);
    req.user = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ==========================================
// Task 9: Add or Update Book Review
// ==========================================
app.put('/review/:isbn', verifyToken, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user;
  
  if (!review) {
    return res.status(400).json({ message: 'Review text is required' });
  }
  
  let bookFound = false;
  
  for (let key in books) {
    if (books[key].isbn === isbn) {
      books[key].reviews[username] = review;
      bookFound = true;
      
      fs.writeFileSync('./booksdb.json', JSON.stringify(books, null, 2));
      
      return res.status(200).json({
        message: 'Review successfully added/updated',
        reviews: books[key].reviews
      });
    }
  }
  
  if (!bookFound) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// ==========================================
// Task 10: Delete Book Review
// ==========================================
app.delete('/review/:isbn', verifyToken, (req, res) => {
  const { isbn } = req.params;
  const username = req.user;
  
  let bookFound = false;
  
  for (let key in books) {
    if (books[key].isbn === isbn) {
      if (books[key].reviews[username]) {
        delete books[key].reviews[username];
        
        fs.writeFileSync('./booksdb.json', JSON.stringify(books, null, 2));
        
        return res.status(200).json({
          message: 'Review successfully deleted',
          reviews: books[key].reviews
        });
      } else {
        return res.status(404).json({ message: 'Review not found' });
      }
    }
  }
  
  if (!bookFound) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});