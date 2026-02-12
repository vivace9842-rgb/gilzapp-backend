const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Opcional se for um contato já registrado
    phoneNumber: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    company: { type: String },
    value: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Prospecção', 'Qualificação', 'Orçamento', 'Negociação', 'Fechado', 'Perdido'],
        default: 'Prospecção'
    },
    notes: [{
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Admin/Atendente
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
