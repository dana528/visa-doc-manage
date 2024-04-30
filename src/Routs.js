// Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import UserProfile from './UserProfile';
import EmailVerification from './EmailVerification';

const Routs = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:userId' element={<EmailVerification /> } />
      <Route path="/:userId/:email" element={<UserProfile /> } />
      
    </Routes>
  );
}

export default Routs;
