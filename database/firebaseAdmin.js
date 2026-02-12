const admin = require('firebase-admin');

// Você deve baixar o arquivo de chave privada (JSON) do console do Firebase:
// Configurações do Projeto -> Contas de Serviço -> Gerar nova chave privada
// Salve como 'serviceAccountKey.json' na pasta backend.

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "seu-projeto.appspot.com" // Substitua pelo seu bucket
});

module.exports = admin;
