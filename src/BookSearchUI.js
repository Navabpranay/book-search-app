import React, { useState } from 'react';

function BookSearchUI({ onSearch }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('intitle'); // default to search by title

  // Handle form submission and call onSearch with user inputs
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    onSearch(`${filter}:${query.trim()}`);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Search books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.select}
        >
          <option value="intitle">Title</option>
          <option value="inauthor">Author</option>
          <option value="subject">Domain</option>
        </select>
        <button type="submit" style={styles.button}>Search</button>
      </form>
      <div style={styles.results}>
        {/* Results will be displayed here by parent component */}
      </div>
    </div>
  );
}

// Simple inline styles (you can use CSS separately)
const styles = {
  container: {
    width: '100%',
    maxWidth: 600,
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '1rem',
  },
  select: {
    padding: '10px',
    fontSize: '1rem',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  results: {
    marginTop: '20px',
  },
};

export default BookSearchUI;
