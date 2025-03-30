import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InvoiceList({ onEdit }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error('Error fetching invoices:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await axios.delete(`http://localhost:5001/api/invoices/${id}`);
      fetchInvoices();
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Invoice List</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice.customerName}</td>
              <td>${invoice.amount}</td>
              <td>{invoice.status}</td>
              <td>{new Date(invoice.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => onEdit(invoice)}>Edit</button>{' '}
                <button onClick={() => handleDelete(invoice._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceList;
