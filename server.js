// imports
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const path = require('path');
const fs = require('fs');

const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.

app.post('/api/notes', (req, res) => {
    let notesData = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const { title, text } = req.body;

    if(title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };
        notesData.push(newNote);
        fs.writeFileSync('./db/db.json', JSON.stringify(notesData));
        res.json(notesData);
    } else {
        res.json('Error in posting note');
    }
});

//GET /api/notes/:id should return a single note based on id.
app.get('/api/notes/:id', (req, res) => {
    if(req.params.id) {
        const noteId = req.params.id;
        const currentNote = notes.find((note) => note.id === noteId);
        res.json(currentNote);
    }
});

// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    if(req.params.id) {
        for(let i = 0; i < notes.length; i++) {
            const currentNote = notes[i];
            if(currentNote.id === req.params.id) {
                notes.splice(i, 1);
                fs.writeFileSync('./db/db.json', JSON.stringify(notes));
            }
        }
        res.json(notes);
    }
});

// GET * should return the index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT} `);
});

