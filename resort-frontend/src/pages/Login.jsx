import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext"; // useAuth විතරක් import කරන්න

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // useContext එක වෙනුවට මේක පාවිච්චි කරන්න
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;
      
      const base64Url = token.split('.')[1];
      const decodedData = JSON.parse(window.atob(base64Url));
      
      login({ email: decodedData.sub, role: decodedData.role, token });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid Email or Password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">OceanView Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" placeholder="Email" className="p-3 border rounded-lg focus:outline-blue-500 text-black"
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" className="p-3 border rounded-lg focus:outline-blue-500 text-black"
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}