import React from 'react';
import axios from 'axios';

function BookList({ books }) {
const saveBook = async (book) => {
  try {
    const { id, ...bookData } = book; // strip Google Books ID
    const response = await axios.post('http://localhost:5000/api/books', {
      ...bookData,
      userNote: ''
    });
    console.log('Saved to Firebase with ID:', response.data.id);
    alert('Book saved!');
  } catch (err) {
    console.error('Save failed:', err.message);
  }
};


  return (
    <div>
      <h2>Search Results</h2>
      {books.map((book) => (
        <div key={book.id} style={{border: '1px solid gray', padding: '10px'}}>
          <img src={book.image} alt={book.title} style={{ width: '100px'}} />
          <h3>{book.title}</h3>
          <p>{book.authors.join(', ')}</p>
          <p>{book.description}</p>
          <button onClick={() => saveBook(book)}>Save</button>
        </div>
      ))}
      </div>
  );
}

export default BookList;
