import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SavedBooks() {
  const [saved, setSaved] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  const fetchSaved = async () => {
    const res = await axios.get('http://localhost:5000/api/books');
    setSaved(res.data); // book.id is now the Firebase doc ID
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      console.log(`Deleted book with id: ${id}`);
      fetchSaved();
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
    }
  };

  const startEdit = (id, currentNote) => {
    setEditingNoteId(id);
    setNoteInput(currentNote || '');
  };

  const saveNote = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/books/${id}`, { userNote: noteInput });
      setEditingNoteId(null);
      setNoteInput('');
      fetchSaved();
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <div>
      <h2>Saved Book List</h2>
      {saved.map((book) => (
        <div key={book.id} style={{ border: '1px solid gray', padding: '10px' }}>
          <img src={book.image} alt={book.title} style={{ width: '100px' }} />
          <h3>{book.title}</h3>
          <p><strong>Author(s):</strong> {book.authors.join(', ')}</p>
          <p>{book.description}</p>
          {editingNoteId === book.id ? (
            <div style={{ display: 'flex', gap: '10px'}}>
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add or edit a note"
              />
              <button onClick={() => saveNote(book.id)}>Save Note</button>
              <button className="btn-delete" onClick={() => setEditingNoteId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p><strong>Note:</strong> {book.userNote || 'No note yet.'}</p>
              <div className="book-actions">
                <button className="btn-edit" onClick={() => startEdit(book.id, book.userNote)}>Edit Note</button>
                <button className="btn-delete" onClick={() => deleteBook(book.id)}>Delete Book</button>
              </div>
            </div>
          )}
        </div>
        
      ))}
    </div>
  );
}

export default SavedBooks;
