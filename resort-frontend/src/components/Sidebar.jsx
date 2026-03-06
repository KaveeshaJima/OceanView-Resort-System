import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // මේ import එක විතරක් තියන්න
import { LayoutDashboard, BedDouble, CalendarCheck, Users, LogOut } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth(); // useContext(AuthContext) පාවිච්චි කරන්න එපා
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-10 text-blue-400">OceanView</h2>
        <nav className="flex flex-col gap-2 text-white">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          
          {(user?.role === "ADMIN" || user?.role === "RECEPTIONIST" || user?.role === "MANAGER") && (
          <Link to="/guests" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
            <Users size={20} /> Guest Details
          </Link>
          )}
          
          {(user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "RECEPTIONIST")  && (
            <Link to="/rooms" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
              <BedDouble size={20} /> Rooms
            </Link>
          )}

          {(user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "RECEPTIONIST") && (
            <Link to="/reservations" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
              <CalendarCheck size={20} /> Reservations
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link to="/users" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
              <Users size={20} /> Staff Management
            </Link>
          )}

          {(user?.role === "MANAGER" || user?.role === "RECEPTIONIST") && (
            <Link to="/users" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
             <Users size={20} /> My Profile
            </Link>
          )}

          {(user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "RECEPTIONIST") && (
            <Link to="/help" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
             <Users size={20} /> System Guide
            </Link>
         )}
        </nav>
      </div>

      <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}