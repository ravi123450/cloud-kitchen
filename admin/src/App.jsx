import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import AdminSubscriptions from './AdminSubscriptions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = "https://cloud-kitchen-9.onrender.com";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <Routes>
            <Route path="/Add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
            <Route path="/admin-home" element={<AdminSubscriptions url={url} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
