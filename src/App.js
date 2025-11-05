// src/App.js
import React, { useState, useEffect } from 'react';
import BookSearchUI from './BookSearchUI';

const MAX_RESULTS = 12; // Google allows up to 40 per request

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Triggered when the child component submits a new query
  const handleSearch = (query) => {
    setSearchQuery(query);
    setStartIndex(0); // reset pagination on new search
  };

  // Fetch whenever query or startIndex changes
  useEffect(() => {
    const fetchBooks = async () => {
      if (!searchQuery) return;
      setLoading(true);
      setError('');
      try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();

        const items = Array.isArray(data.items) ? data.items : [];
        setBooks(items);
        setTotal(typeof data.totalItems === 'number' ? data.totalItems : 0);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery, startIndex]);

  const hasPrev = startIndex > 0;
  const hasNext = startIndex + MAX_RESULTS < total;

  return (
    <div style={{ padding: 16, maxWidth: 900, margin:'auto' }}>
      <h1>Find Books That Make You Think Beyond the Words</h1>
      <BookSearchUI onSearch={handleSearch} />

      {loading && <p>Loading results...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && searchQuery && (
        <p>
          Showing {books.length} of {total} results for <strong>{searchQuery}</strong>
        </p>
      )}

      {/* Results grid */}
      <div style={gridStyles.container}>
        {books.map((item) => {
          const id = item.id;
          const info = item.volumeInfo || {};
          const title = info.title || 'Untitled';
          const authors = Array.isArray(info.authors) ? info.authors.join(', ') : 'Unknown';
          const thumb =
            info.imageLinks?.thumbnail ||
            info.imageLinks?.smallThumbnail ||
            '';
          const infoLink = info.infoLink || '#';
          const categories = Array.isArray(info.categories) ? info.categories.join(', ') : '';

          return (
            <div key={id} style={gridStyles.card}>
              {thumb ? (
                <img
                  src={thumb}
                  alt={title}
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
                  loading="lazy"
                />
              ) : (
                <div style={gridStyles.placeholder}>No Image</div>
              )}
              <div style={{ marginTop: 8 }}>
                <h3 style={{ margin: '4px 0', fontSize: 16 }}>{title}</h3>
                <p style={{ margin: '4px 0', color: '#555' }}>{authors}</p>
                {categories && <p style={{ margin: '4px 0', color: '#777' }}>{categories}</p>}
                <a href={infoLink} target="_blank" rel="noreferrer">
                  View details
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {!loading && !error && total > 0 && (
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            onClick={() => setStartIndex(Math.max(0, startIndex - MAX_RESULTS))}
            disabled={!hasPrev}
          >
            Previous
          </button>
          <button
            onClick={() => setStartIndex(startIndex + MAX_RESULTS)}
            disabled={!hasNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const gridStyles = {
  container: {
    marginTop: 16,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  },
  card: {
    border: '1px solid #eee',
    borderRadius: 10,
    padding: 10,
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  placeholder: {
    width: '100%',
    height: 180,
    background: '#f3f3f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    color: '#777',
  },
};


export default App;
