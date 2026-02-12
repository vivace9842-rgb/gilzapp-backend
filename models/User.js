const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    name: { type: String, default: '' },
    photo: { type: String, default: '' },
    bio: { type: String, default: 'Olá! Eu estou usando o GilZapp.' },
    statusOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Hash da senha antes de salvar
UserSchema.pre('save', async function () {
    console.log('--- EXECUTANDO HOOK PRE-SAVE ---');
    if (!this.isModified('password')) {
        console.log('Senha não modificada, pulando hash.');
        return;
    }
    console.log('Gerando hash para a senha...');
    this.password = await bcrypt.hash(this.password, 10);
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
