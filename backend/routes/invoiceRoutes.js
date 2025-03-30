const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoiceController');

router.get('/', controller.getInvoices);
router.post('/', controller.createInvoice);
router.put('/:id', controller.updateInvoice);
router.delete('/:id', controller.deleteInvoice);

module.exports = router;
