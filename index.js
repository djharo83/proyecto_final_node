// Config .env
require("dotenv").config();

// Server creation and configuration
const http = require("node:http");
const app = require("./src/app");
const socketIO = require('socket.io'); 
const { allowedOrigins } = require('./src/app');


// Server creation
const server = http.createServer(app);


// Listeners
const PORT = process.env.PORT || 3000;
server.listen(PORT);



// Configuración del web socket
const io = socketIO(server, {
    cors: {
        // Ponemos los mismos orígenes que hay ahora mismo en  app.js
        origin: [
            'http://localhost:4200',                  
            'http://localhost:4000',                  
            'https://tu-proyecto-frontend.onrender.com'
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
});

// Escuchamos el evento de conexión
io.on('connection', (socket) => {
    console.log(`Se ha conectado un nuevo cliente con ID: ${socket.id}`);

    // Ponemos el mismo evento que en el front: chat_message
    socket.on('chat_message', (data) => {
        console.log(data); 
        io.emit('chat_message', data);
    });

    // Escuchamos cuando este cliente se desconecta
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});



// Listeners
server.on("listening", () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on("error", (error) => {
    console.log(error);
});
