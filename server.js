require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./database/db');
const admin = require('firebase-admin');
const fs = require('fs');

// Inicializar Firebase apenas se o arquivo de credenciais existir
if (fs.existsSync('./serviceAccountKey.json')) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin inicializado');
} else {
    console.log('Firebase Admin não inicializado (serviceAccountKey.json não encontrado)');
}

const app = express();
connectDB();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rotas
const authRoutes = require('./routes/auth');
const crmRoutes = require('./routes/crm');
app.use('/api/auth', authRoutes);
app.use('/api/crm', crmRoutes);

app.get('/', (req, res) => {
    res.send('GilZapp Backend rodando com sucesso');
});

// WebSockets
require('./sockets/chatHandler')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT} (Acessível em toda a rede)`);
});
