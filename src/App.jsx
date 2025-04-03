import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import TaleSpire from '@/pages/TaleSpire';
import MyStories from '@/pages/MyStories';
import Templates from '@/pages/Templates';
import Collaborators from '@/pages/Collaborators';
import About from '@/pages/About';
import UserProfile from '@/pages/UserProfile';
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TaleSpire />} />
          <Route path="stories" element={<MyStories />} />
          <Route path="templates" element={<Templates />} />
          <Route path="collaborators" element={<Collaborators />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthProvider>
  );
}

export default App; 