// frontend/app/layout.tsx
'use client';

import './globals.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    setIsLoggedIn(!!token);
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <html lang="en" className={darkMode ? 'dark' : 'light'}>
      <head>
        <title>EcoSphere AI Commerce</title>
        <meta name="description" content="AI-powered sustainable e-commerce platform" />
      </head>
      <body className={`${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} transition-colors duration-300`}>
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              EcoSphere
            </Link>
            
            <div className="flex gap-6 items-center">
              <Link href="/products" className="hover:text-green-400 transition">Products</Link>
              <Link href="/ai-assistant" className="hover:text-green-400 transition">AI Assistant</Link>
              
              {isLoggedIn ? (
                <>
                  <Link href="/cart" className="relative">
                    <span className="text-xl">🛒</span>
                  </Link>
                  <Link href="/dashboard" className="hover:text-green-400 transition">{userName}</Link>
                  <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-green-400 transition">Login</Link>
                  <Link href="/signup" className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    Sign Up
                  </Link>
                </>
              )}
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-xl"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'} border-t mt-16`}>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4">About</h3>
                <ul className="space-y-2 text-sm opacity-70">
                  <li><a href="#" className="hover:text-green-400">About Us</a></li>
                  <li><a href="#" className="hover:text-green-400">Careers</a></li>
                  <li><a href="#" className="hover:text-green-400">Press</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Support</h3>
                <ul className="space-y-2 text-sm opacity-70">
                  <li><a href="#" className="hover:text-green-400">Help Center</a></li>
                  <li><a href="#" className="hover:text-green-400">Contact</a></li>
                  <li><a href="#" className="hover:text-green-400">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm opacity-70">
                  <li><a href="#" className="hover:text-green-400">Privacy</a></li>
                  <li><a href="#" className="hover:text-green-400">Terms</a></li>
                  <li><a href="#" className="hover:text-green-400">Cookies</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Follow</h3>
                <ul className="space-y-2 text-sm opacity-70">
                  <li><a href="#" className="hover:text-green-400">Twitter</a></li>
                  <li><a href="#" className="hover:text-green-400">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-green-400">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-8 text-center text-sm opacity-50">
              © 2024 EcoSphere AI Commerce. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
