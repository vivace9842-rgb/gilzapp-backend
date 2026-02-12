const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');

router.post('/leads', crmController.createLead);
router.get('/leads', crmController.getLeads);
router.patch('/leads/:id/status', crmController.updateLeadStatus);
router.post('/leads/:id/notes', crmController.addNote);

module.exports = router;
