import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import BookList from './components/BookList';
import SavedBooks from './components/SavedBooks';
import './App.css'; // make sure this file exists

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const searchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
      setBooks(res.data);
    } catch (err) {
      console.error('Search error:', err.message);
    }
  };

  return (
    <Router>
    <div className="App">
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo">BookApp</span>
        </div>
        <div className="navbar-right">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/saved">Saved Books</NavLink>
        </div>
      </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Book Search</h1>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for books..."
                />
                <button onClick={searchBooks}>Search</button>
                <BookList books={books} />
              </>
            }
          />
          <Route path="/saved" element={<SavedBooks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

