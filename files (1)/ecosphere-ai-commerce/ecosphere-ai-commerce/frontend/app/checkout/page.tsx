// frontend/app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const shippingAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        alert('Failed to place order');
        return;
      }

      const order = await response.json();
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        {/* Steps */}
        <div className="flex gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                step === s
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {s === 1 ? '📍 Address' : s === 2 ? '💳 Payment' : '✓ Confirm'}
            </button>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="card space-y-4">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Street Address</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                placeholder="123 Main Street"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="Mumbai"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="Maharashtra"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={address.zip}
                  onChange={handleAddressChange}
                  placeholder="400001"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select name="country" value={address.country} onChange={handleAddressChange} className="w-full">
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!address.street || !address.city || !address.zip}
              className="w-full btn-primary disabled:opacity-50 mt-6"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="card space-y-4">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

            <div className="space-y-3">
              {['credit-card', 'upi', 'netbanking'].map((method) => (
                <label key={method} className="flex items-center p-4 border border-slate-700 rounded-lg cursor-pointer hover:border-green-500/50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4"
                  />
                  <span className="font-medium capitalize">
                    {method === 'credit-card' ? '💳 Credit/Debit Card' : method === 'upi' ? '📱 UPI' : '🏦 Net Banking'}
                  </span>
                </label>
              ))}
            </div>

            {paymentMethod === 'credit-card' && (
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    name="number"
                    value={cardData.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength="3"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 btn-secondary">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 btn-primary">
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              <div>
                <h3 className="font-bold mb-2">Shipping Address</h3>
                <p className="text-slate-400">
                  {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Payment Method</h3>
                <p className="text-slate-400 capitalize">
                  {paymentMethod === 'credit-card' ? '💳 Credit/Debit Card' : paymentMethod === 'upi' ? '📱 UPI' : '🏦 Net Banking'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 btn-secondary">
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
