import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import MergePDF from './pages/MergePDF';
import ImageToPDF from './pages/ImageToPDF';
import PageDeletor from './pages/PageDeletor';
import PDFProtection from './pages/PDFProtection';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/image-to-pdf" element={<ImageToPDF />} />
          <Route path="/page-deletor" element={<PageDeletor />} />
          <Route path="/pdf-protection" element={<PDFProtection />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
