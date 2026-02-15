import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import AuthModal from '../components/AuthModal/AuthModal.jsx';

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};

export default MainLayout;