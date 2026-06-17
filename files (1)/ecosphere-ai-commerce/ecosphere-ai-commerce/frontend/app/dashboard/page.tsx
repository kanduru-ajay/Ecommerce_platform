// frontend/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{ product: { title: string }; quantity: number }>;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState({
    totalSpent: 0,
    orderCount: 0,
    carbonSaved: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [ordersRes, analyticsRes] = await Promise.all([
        fetch(`${API_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/platform`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        // Calculate analytics
        const totalSpent = ordersData.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
        const carbonSaved = totalSpent * 0.1; // Mock calculation

        setAnalytics({
          totalSpent,
          orderCount: ordersData.length,
          carbonSaved,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">My Dashboard</h1>

        {/* Analytics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="text-slate-400 text-sm mb-2">Total Spent</div>
            <div className="text-3xl font-bold gradient-text">₹{analytics.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-slate-400 mt-2">Across {analytics.orderCount} orders</p>
          </div>

          <div className="card">
            <div className="text-slate-400 text-sm mb-2">Orders</div>
            <div className="text-3xl font-bold">
              {analytics.orderCount}
            </div>
            <p className="text-xs text-slate-400 mt-2">Total purchases</p>
          </div>

          <div className="card">
            <div className="text-slate-400 text-sm mb-2">🌱 Carbon Saved</div>
            <div className="text-3xl font-bold text-green-400">
              {analytics.carbonSaved.toFixed(1)} kg
            </div>
            <p className="text-xs text-slate-400 mt-2">Equivalent to {(analytics.carbonSaved / 20).toFixed(1)} trees</p>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400 mb-2">
                        {order.items.map((item) => item.product.title).join(', ')}
                      </p>

                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">₹{order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">No orders yet</p>
              <a href="/products" className="text-green-400 hover:text-green-300">
                Start shopping →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
