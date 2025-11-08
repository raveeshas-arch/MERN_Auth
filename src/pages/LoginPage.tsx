import React from 'react';
import Login from '../components/ui/login';
import bg2 from '../assets/hero.jpg';

const LoginPage: React.FC = () => {
  return (
    <div
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center "
      style={{
        backgroundImage: `url(${bg2})`,
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative z-10"><Login /></div>
    </div>
  );
};

export default LoginPage;