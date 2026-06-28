// Config .env
require("dotenv").config();

// Server creation and configuration
const http = require("node:http");
const { app, allowedOrigins } = require("./src/app");
const socketIO = require('socket.io'); 
const MessagesModel = require('./src/models/messages.model');


// Server creation
const server = http.createServer(app);

// Listeners
server.on("listening", () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on("error", (error) => {
    console.error("Error en el servidor:", error);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Configuración del web socket
const io = socketIO(server, {
    cors: {
        // Ponemos los mismos orígenes que hay ahora mismo en  app.js
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
});

// Notificaciones Moderador Compartimos la instancia de socket.io con Express.
app.set('io', io);

// Eventos socket
const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN_CHAT: 'join_chat',
    PRIVATE_MESSAGE: 'private_message',
    NEW_MESSAGE: 'new_message',
    JOIN_USER_ROOM: 'join_user_room' // Notificaciones Evento para la sala del usuario
};



// Escuchamos el evento de conexión
io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`Se ha conectado un nuevo cliente: ${socket.id}`);

    // Notificaciones - Escuchar cuando un usuario se conecta a su canal de notificaciones único .
    socket.on(SOCKET_EVENTS.JOIN_USER_ROOM, (userId) => {
        const userRoom = `user_${userId}`;
        socket.join(userRoom);
        console.log(`Usuario con ID ${userId} se ha unido a su sala de notificaciones: ${userRoom}`);
    });

    // 1. Unirse a la sala
    socket.on(SOCKET_EVENTS.JOIN_CHAT, (conversationId) => {
        const roomName = `room_conversation_${conversationId}`;
        socket.join(roomName);
        console.log(`Usuario unido a la sala: ${roomName}`);
    });

    // 2. Recibir mensaje, guardarlo en MySQL y retransmitirlo
    socket.on(SOCKET_EVENTS.PRIVATE_MESSAGE, async (data) => {
        try {
            const insertId = await MessagesModel.insert({
                conversation_id: data.conversation_id,
                sender_id: data.sender_id,
                content: data.content
            });

            // B. Recuperamos el mensaje completo (con su fecha de MySQL, id, etc.)
            const savedMessage = await MessagesModel.getById(insertId);

            // C. Lo emitimos SOLO a los que estén en la sala de esta conversación
            const roomName = `room_conversation_${data.conversation_id}`;
            io.to(roomName).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);
            
        } catch (error) {
            console.error('Error guardando el mensaje en BD:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

