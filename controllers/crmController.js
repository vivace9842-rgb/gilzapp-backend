const Lead = require('../models/Lead');

exports.createLead = async (req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json(lead);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar lead' });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ updatedAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar leads' });
    }
};

exports.updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar status' });
    }
};

exports.addNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const lead = await Lead.findById(id);
        lead.notes.push({ content });
        await lead.save();
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao adicionar nota' });
    }
};
