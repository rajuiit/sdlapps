import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import { useState } from 'react';

// This is part of feature/invoice-ui branch

function App() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={
            <>
              <h1>Billing & Invoice System</h1>
              <InvoiceForm
                selectedInvoice={selectedInvoice}
                onSuccess={() => {
                  setRefresh(!refresh);
                  setSelectedInvoice(null);
                }}
              />
              <hr />
              <InvoiceList key={refresh} onEdit={setSelectedInvoice} />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
