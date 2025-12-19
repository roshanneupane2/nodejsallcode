const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const Note = require('./models/Note');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// REST API Routes
app.get('/', (req, res) => res.send('Real-time Note Sharing API'));

// Get all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a note
app.post('/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title, content });
        await newNote.save();

        // Emit new note to all connected clients
        io.emit('noteCreated', newNote);

        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a note
app.put('/notes/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );

        if (!updatedNote) return res.status(404).json({ error: 'Note not found' });

        // Emit updated note
        io.emit('noteUpdated', updatedNote);

        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) return res.status(404).json({ error: 'Note not found' });

        // Emit deletion event
        io.emit('noteDeleted', req.params.id);

        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Socket.io connection
io.on('connection', socket => {
    console.log('New user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
