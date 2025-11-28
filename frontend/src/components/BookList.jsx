function BookList({ books, loading, onEdit, onDelete, onToggleAvailability }) {
  if (loading) {
    return (
      <div className="book-list">
        <h2>Books</h2>
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="book-list">
        <h2>Books</h2>
        <div className="no-books">
          No books found. Add your first book!
        </div>
      </div>
    );
  }

  return (
    <div className="book-list">
      <h2>Books ({books.length})</h2>
      <div className="books-container">
        {books.map((book, index) => (
          <div key={index} className="book-card">
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <p className="publisher">Publisher: {book.publisher}</p>
            <div className="book-meta">
              <span className="genre">{book.genre}</span>
              <span className="year">{book.year}</span>
              <span className={`availability ${book.available ? 'available' : 'unavailable'}`}>
                {book.available ? 'Available' : 'Borrowed'}
              </span>
            </div>
            <div className="book-actions">
              <button 
                className="btn-edit"
                onClick={() => onEdit(book)}
              >
                Edit
              </button>
              <button 
                className="btn-toggle"
                onClick={() => onToggleAvailability(book.id)}
              >
                Toggle Status
              </button>
              <button 
                className="btn-delete"
                onClick={() => onDelete(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookList;

