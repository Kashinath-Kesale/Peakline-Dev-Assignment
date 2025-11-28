import { useState, useEffect } from 'react';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import SearchBar from './components/SearchBar';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, available: 0 });

  const fetchBooks = async (search = '') => {
    try {
      setLoading(true);
      const url = search 
        ? `/api/books?search=${encodeURIComponent(search)}`
        : '/api/books';
      
      const response = await fetch(url);
      const data = await response.json();
      
      setBooks(data?.books);
      updateStats(data.books);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (booksList) => {
    const available = booksList.filter(book => book.available === true);
    setStats({
      total: available.length,
      available: available.length
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchBooks(term);
  };

  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.status === 201) {
        fetchBooks(searchTerm);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to add book');
      return false;
    }
  };

  const handleUpdateBook = async (id, bookData) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        setEditingBook(null);
        fetchBooks(searchTerm);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update book');
      return false;
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBooks(searchTerm);
      }
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const response = await fetch(`/api/books/${id}/toggle-availability`, {
        method: 'PATCH',
      });

      if (response.ok) {
        fetchBooks(searchTerm);
      }
    } catch (err) {
      setError('Failed to toggle availability');
    }
  };

  const handleEdit = async (book) => {
    try {
      // Fetch fresh book data before editing
      const response = await fetch(`/api/books/${book.id}`);
      if (response.ok) {
        const freshBook = await response.json();
        setEditingBook(freshBook);
      } else {
        setError('Failed to load book for editing');
      }
    } catch (err) {
      setError('Failed to load book for editing');
    }
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Book Library</h1>
        <p>Manage your book collection with ease</p>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Books</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.available}</div>
            <div className="stat-label">Available</div>
          </div>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="main-content">
        <div className="left-section">
          <SearchBar onSearch={handleSearch} />
          <BookList
            books={books}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteBook}
            onToggleAvailability={handleToggleAvailability}
          />
        </div>

        <div className="right-section">
          <BookForm
            book={editingBook}
            onSubmit={editingBook ? handleUpdateBook : handleAddBook}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

