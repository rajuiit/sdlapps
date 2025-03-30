const Invoice = require('../models/Invoice');

// GET all invoices
exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find();
  res.json(invoices);
};

// POST new invoice
exports.createInvoice = async (req, res) => {
  const invoice = new Invoice(req.body);
  await invoice.save();
  res.status(201).json(invoice);
};

// PUT update invoice
exports.updateInvoice = async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(invoice);
};

// DELETE invoice
exports.deleteInvoice = async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
