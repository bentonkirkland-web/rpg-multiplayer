require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Player schema
const playerSchema = new mongoose.Schema({
    username: String,
    faction: String,
    x: Number,
    y: Number,
    hp: Number,
    energy: Number
});
const Player = mongoose.model('Player', playerSchema);

// Serve the client folder
app.use(express.static('../client'));

// Multiplayer sockets
io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('newPlayer', async (data) => {
        const player = new Player({
            ...data,
            x: 100,
            y: 100,
            hp: 100,
            energy: 100
        });

        await player.save();

        socket.emit('playerData', player);
        socket.broadcast.emit('playerJoined', player);
    });

    socket.on('move', async (data) => {
        await Player.findByIdAndUpdate(data.id, { x: data.x, y: data.y });
        socket.broadcast.emit('playerMoved', data);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
