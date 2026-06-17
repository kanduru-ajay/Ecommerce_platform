// frontend/app/cart/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
  };
  quantity: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const applyCoupon = () => {
    if (coupon === 'ECO10') {
      setDiscount(0.1);
    } else if (coupon === 'SAVE20') {
      setDiscount(0.2);
    } else {
      alert('Invalid coupon code');
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-slate-400 mb-8">Start shopping to fill your cart with amazing products</p>
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.subtotal;
  const discountAmount = subtotal * discount;
  const tax = (subtotal - discountAmount) * 0.18;
  const total = subtotal - discountAmount + tax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="card flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold mb-2">{item.product.title}</h3>
                  <p className="text-2xl font-bold gradient-text">₹{item.product.price}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-slate-700 rounded hover:bg-slate-600 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-slate-700 rounded hover:bg-slate-600 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-span-1">
            <div className="card sticky top-20">
              <h2 className="font-bold text-xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span>−₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="gradient-text">₹{total.toFixed(2)}</span>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className="block text-sm mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="ECO10, SAVE20"
                    className="flex-1"
                  />
                  <button onClick={applyCoupon} className="btn-secondary px-3">
                    Apply
                  </button>
                </div>
              </div>

              <button onClick={handleCheckout} className="w-full btn-primary">
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-green-400 hover:text-green-300 mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
