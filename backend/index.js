const express = require('express');
const axios = require('axios');
const cors = require('cors');
const db = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// Search Google Books API
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${q}`
    );
    const books = response.data.items.map((item) => {
      const info = item.volumeInfo;
      return {
        id: item.id,
        title: info.title,
        authors: info.authors || [],
        description: info.description || '',
        image: info.imageLinks?.thumbnail || '',
      };
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Save book to Firebase
app.post('/api/books', async (req, res) => {
  const book = req.body;
  try {
    const docRef = await db.collection('books').add(book);
    res.json({ id: docRef.id }); // ✅ return the real Firebase ID
  } catch (err) {
    res.status(500).json({ error: 'Error saving book' });
  }
});

// Get saved books
app.get('/api/books', async (req, res) => {
  try {
    const snapshot = await db.collection('books').get();
    const books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching saved books' });
  }
});

// Edit book note
app.put('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  const updated = req.body;
  try {
    await db.collection('books').doc(id).update(updated);
    res.sendStatus(200);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Error updating book' });
  }
});

// Delete book
app.delete('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.collection('books').doc(id).delete();
    res.sendStatus(200);
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Error deleting book' });
  }
});


app.listen(5000, () => console.log('Server running on port 5000'));
