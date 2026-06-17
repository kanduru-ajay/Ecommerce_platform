// frontend/app/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'AI Shopping Assistant',
      description: 'Get personalized recommendations powered by advanced machine learning',
    },
    {
      icon: '🌱',
      title: 'Sustainability Scores',
      description: 'Make eco-conscious choices with carbon and sustainability metrics',
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Track your spending, savings, and environmental impact',
    },
    {
      icon: '⚡',
      title: 'Real-time Insights',
      description: 'Get demand forecasting and inventory predictions',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Eco-conscious Shopper',
      text: 'EcoSphere AI Commerce changed how I shop. The sustainability scores help me make better choices!',
      avatar: '👩‍💼',
    },
    {
      name: 'Rajesh Patel',
      role: 'Small Business Owner',
      text: 'The seller dashboard analytics give me insights I never had before. Absolutely game-changing!',
      avatar: '👨‍💼',
    },
    {
      name: 'Maya Gupta',
      role: 'Sustainability Advocate',
      text: 'Finally, a platform that takes environmental impact seriously. Love the carbon tracking feature!',
      avatar: '👩',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Products' },
    { value: '50K+', label: 'Happy Users' },
    { value: '100K+', label: 'Carbon Saved' },
    { value: '$5M+', label: 'Total Revenue' },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              The Future of
              <span className="gradient-text"> Sustainable Shopping</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              AI-powered recommendations, real-time insights, and environmental awareness. Shop smart, save more, help Earth.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="btn-primary">
                Start Shopping →
              </Link>
              <Link href="/ai-assistant" className="btn-outline">
                Try AI Assistant
              </Link>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-3xl opacity-20"></div>
              <div className="glass rounded-2xl p-8 relative">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-center text-slate-400 mb-12 text-lg">Everything you need for smart, sustainable shopping</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card hover:border-green-500/50"
                style={{ animation: `fadeIn 0.6s ease-out ${i * 0.1}s both` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Users Say</h2>
          
          <div className="grid grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop Smarter?</h2>
          <p className="text-slate-300 mb-8">Join thousands of users making sustainable choices with AI-powered insights</p>
          <Link href="/signup" className="btn-primary">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
