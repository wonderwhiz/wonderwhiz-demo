
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient">
      <Helmet>
        <title>Login to WonderWhiz</title>
        <meta name="description" content="Log in to your WonderWhiz account to access your child's learning journey." />
      </Helmet>
      
      <Navbar />
      <main className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Login</h1>
          <p className="text-xl text-gray-200 mb-8 text-center">
            Coming soon! We're working on this page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
