import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InvoiceForm({ selectedInvoice, onSuccess }) {
  const [form, setForm] = useState({
    customerName: '',
    amount: '',
    status: 'unpaid',
  });

  useEffect(() => {
    if (selectedInvoice) {
      setForm({
        customerName: selectedInvoice.customerName,
        amount: selectedInvoice.amount,
        status: selectedInvoice.status,
      });
    }
  }, [selectedInvoice]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedInvoice) {
      await axios.put(`http://localhost:5001/api/invoices/${selectedInvoice._id}`, form);
    } else {
      await axios.post('http://localhost:5001/api/invoices', form);
    }

    setForm({ customerName: '', amount: '', status: 'unpaid' });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
      <input
        type="text"
        name="customerName"
        placeholder="Customer Name"
        value={form.customerName}
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <br />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="unpaid">Unpaid</option>
        <option value="paid">Paid</option>
      </select>
      <br />
      <button type="submit">{selectedInvoice ? 'Update' : 'Create'}</button>
    </form>
  );
}

export default InvoiceForm;
