import { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(inputValue.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);   

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search books by title or author..."
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
