const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Get All Books
async function getAllBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    console.log('All Books:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all books:', error.message);
    throw error;
  }
}

// Get Books by ISBN
async function getBooksByISBN(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    console.log(`Books with ISBN ${isbn}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error.message);
    throw error;
  }
}

// Get Books by Author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    console.log(`Books by ${author}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
    throw error;
  }
}

// Get Books by Title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    console.log(`Books with title "${title}":`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
    throw error;
  }
}

// Get Book Reviews
async function getBookReviews(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/review/${isbn}`);
    console.log(`Reviews for ISBN ${isbn}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching book reviews:', error.message);
    throw error;
  }
}

// Register User
async function registerUser(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      username,
      password
    });
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response?.data || error.message);
    throw error;
  }
}

// Login User
async function loginUser(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      username,
      password
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw error;
  }
}

// Add/Update Book Review
async function addBookReview(isbn, review, token) {
  try {
    const response = await axios.put(`${BASE_URL}/review/${isbn}`, 
      { review },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Review added/updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding/updating review:', error.response?.data || error.message);
    throw error;
  }
}

// Delete Book Review
async function deleteBookReview(isbn, token) {
  try {
    const response = await axios.delete(`${BASE_URL}/review/${isbn}`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Review deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  getAllBooks,
  getBooksByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReviews,
  registerUser,
  loginUser,
  addBookReview,
  deleteBookReview
};