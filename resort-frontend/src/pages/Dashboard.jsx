import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Users, BedDouble, CalendarCheck, DollarSign, TrendingUp, Activity } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await api.get("/dashboard/stats", config);
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Backend 500 Error: Could not fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.token]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-blue-600 font-black uppercase tracking-widest italic">Loading Insights...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center min-h-screen flex flex-col justify-center items-center">
       <div className="bg-red-100 p-6 rounded-3xl border border-red-200">
          <p className="text-red-600 font-bold mb-2">⚠️ {error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold uppercase">Retry</button>
       </div>
    </div>
  );

  
  const pieData = [
    { name: "Available", value: stats?.availableRooms || 0 },
    { name: "Occupied", value: stats?.occupiedRooms || 0 },
  ];
  const COLORS = ["#10b981", "#ef4444"];

  
  const totalRooms = (stats?.availableRooms || 0) + (stats?.occupiedRooms || 0);
  const occupancyRate = totalRooms > 0 ? ((stats.occupiedRooms / totalRooms) * 100).toFixed(1) : 0;

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            OceanView <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 leading-none">Welcome, {user?.name}. Here's the live resort status.</p>
        </div>
        <div className="hidden md:block">
           <span className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" /> System Live
           </span>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Guests" value={stats?.totalGuests} icon={<Users />} color="bg-blue-600" />
        <StatCard title="Available Rooms" value={stats?.availableRooms} icon={<BedDouble />} color="bg-emerald-500" />
        <StatCard title="Total Bookings" value={stats?.totalReservations} icon={<CalendarCheck />} color="bg-orange-500" />
        <StatCard title="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString()}`} icon={<DollarSign />} color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- PIE CHART SECTION --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700 uppercase tracking-tight">
            <TrendingUp size={20} className="text-blue-500" /> Room Occupancy Ratio
          </h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- STATUS HIGHLIGHTS --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center gap-6">
          <div className="text-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Occupancy Rate</p>
            <h2 className="text-6xl font-black text-slate-900 leading-none">{occupancyRate}%</h2>
          </div>
          
          <div className="space-y-3">
             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Rooms in Use</span>
                <span className="font-black text-red-500">{stats?.occupiedRooms} Rooms</span>
             </div>
             <div className="flex justify-between items-center p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Total Capacity</span>
                <span className="font-black text-slate-900">{totalRooms} Rooms</span>
             </div>
             <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Quick Note</p>
                <p className="text-blue-800 text-sm font-medium">Your resort is currently at {occupancyRate < 50 ? 'low' : 'optimal'} occupancy.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300 group">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg shadow-${color.split('-')[1]}-200 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}