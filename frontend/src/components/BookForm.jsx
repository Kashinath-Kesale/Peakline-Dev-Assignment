import { useState, useEffect } from 'react';

const initialFormState = {
  title: '',
  author: '',
  year: new Date().getFullYear(),
  genre: 'Fiction',
  available: true,
  publisher: { name: 'Unknown', location: 'Unknown' }
};

function BookForm({ book, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year,
        genre: book.genre,
        available: book.available,
        publisher: book.publisher || { name: 'Unknown', location: 'Unknown' }
      });
    } else {
      setFormData(initialFormState);
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle normal fields
    if (name !== 'publisherName' && name !== 'publisherLocation') {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      publisher: {
        ...prev.publisher,
        [name === 'publisherName' ? 'name' : 'location']: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = {
      ...formData,
      year: parseInt(formData.year),
      publisher: formData.publisher
    };

    let success;
    if (book) {
      success = await onSubmit(book.id, submitData);
    } else {
      success = await onSubmit(submitData);
    }

    if (success) {
      setFormData(initialFormState);
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    onCancel();
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance',
    'Sci-Fi', 'Fantasy', 'Biography', 'History',
    'Dystopian', 'Uncategorized'
  ];

  return (
    <div className="book-form">
      <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1000"
            max="2099"
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* new Publisher Name */}
        <div className="form-group">
          <label htmlFor="publisherName">Publisher Name</label>
          <input
            type="text"
            id="publisherName"
            name="publisherName"
            value={formData.publisher.name}
            onChange={handleChange}
          />
        </div>

        {/* new Publisher Location */}
        <div className="form-group">
          <label htmlFor="publisherLocation">Publisher Location</label>
          <input
            type="text"
            id="publisherLocation"
            name="publisherLocation"
            value={formData.publisher.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            <label htmlFor="available">Available for borrowing</label>
          </div>
        </div>

        <div className="form-buttons">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (book ? 'Update Book' : 'Add Book')}
          </button>

          {book && (
            <button 
              type="button" 
              className="btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default BookForm;
