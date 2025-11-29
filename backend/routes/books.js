const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/books.json');

// Helper function to read books from JSON file
const readBooks = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write books to JSON file
const writeBooks = (books) => {
  fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));
};

// GET all books with optional search and pagination
router.get('/', (req, res) => {
  try {
    let books = readBooks();
    let { search, page = 1, limit = 10 } = req.query;

    // Normalize pagination params
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    // Filter by search term (searches in title OR author)
    if (search) {
      const searchLower = search.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = books.slice(startIndex, endIndex);

    res.json({
      books: paginatedBooks,
      total: books.length,
      page,
      totalPages: Math.ceil(books.length / limit),
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET single book by ID
router.get('/:id', (req, res) => {
  try {
    const books = readBooks();
    const id = parseInt(req.params.id, 10);
    const book = books.find((b) => b.id === id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST create new book
router.post('/', (req, res) => {
  try {
    const books = readBooks();
    const { title, author, year, genre, available, publisher } = req.body;

    // Validation
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    // Generate new ID
    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;

    const newBook = {
      id: newId,
      title,
      author,
      year: year || new Date().getFullYear(),
      genre: genre || 'Uncategorized',
      available: available !== undefined ? available : true,
      publisher:
        publisher && publisher.name && publisher.location
          ? publisher
          : {
              name: 'Unknown',
              location: 'Unknown',
            },
    };

    books.push(newBook);
    writeBooks(books);

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// PUT update book
router.put('/:id', (req, res) => {
  try {
    const books = readBooks();
    const id = parseInt(req.params.id, 10);
    const bookIndex = books.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author, year, genre, available, publisher } = req.body;
    const book = books[bookIndex];

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (year !== undefined) book.year = year;
    if (genre !== undefined) book.genre = genre;
    if (available !== undefined) book.available = available;

    if (publisher && publisher.name && publisher.location) {
      book.publisher = {
        name: publisher.name,
        location: publisher.location,
      };
    }

    books[bookIndex] = book;
    writeBooks(books);

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE book
router.delete('/:id', (req, res) => {
  try {
    const books = readBooks();
    const id = parseInt(req.params.id, 10);
    const bookIndex = books.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    writeBooks(books);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// PATCH toggle availability
router.patch('/:id/toggle-availability', (req, res) => {
  try {
    const books = readBooks();
    const id = parseInt(req.params.id, 10);
    const book = books.find((b) => b.id === id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    book.available = !book.available; 
    writeBooks(books);

    res.json(book);
  } catch (error) {
    console.error('Error toggling availability:', error);
    res.status(500).json({ error: 'Failed to toggle availability' });
  }
});

module.exports = router;
