const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupPhoto: { type: String },
    groupAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
