const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Conectado...');
        isConnected = true;
    } catch (err) {
        console.error('Erro na conexão com MongoDB:', err.message);
        console.log('--- AVISO: Entrando em MODO MOCK (Sem Banco de Dados) ---');
        isConnected = false;
    }
};

module.exports = { connectDB, isConnected: () => isConnected };
