import { useEffect, useState } from "react"; 
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Edit, Trash2, X, ShieldCheck, Mail, UserCircle } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth(); 
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "RECEPTIONIST"
  });

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    if (currentUser?.role !== "ADMIN" || !currentUser?.token) return;
    try {
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.token]); 

  // ================= SAVE/UPDATE =================
  const handleSave = async (e) => {
  e.preventDefault();

  
  const userRequestData = {
    name: formData.name,
    email: formData.email,
    password: formData.password || null, 
    role: formData.role
  };

  try {
    if (isEdit) {
      
      await api.put(`/users/${formData.id}`, userRequestData, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      alert("User Updated!");
    } else {
      // POST Request
      await api.post("/users", userRequestData, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      alert("User Created!");
    }
    setShowModal(false);
    resetForm();
    fetchUsers();
  } catch (error) {
   
    console.error("Backend Error Response:", error.response?.data);
    alert(error.response?.data?.message || "Operation failed!");
  }
};

  const handleDelete = async (id, name) => {
    if (id === currentUser.id) {
      alert("You cannot delete yourself!");
      return;
    }
    if (window.confirm(`Delete user ${name}?`)) {
      try {
        await api.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch {
        alert("Delete failed!");
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", email: "", password: "", role: "RECEPTIONIST" });
    setIsEdit(false);
  };

  // --- Profile View (Manager & Receptionist) ---
  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="p-10 flex justify-center">
        <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-blue-600"></div>
          <div className="relative pt-10 flex flex-col items-center">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <UserCircle size={80} className="text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold mt-4 text-gray-800">{currentUser.name}</h2>
            <p className="text-blue-600 font-semibold mb-6 italic">{currentUser.role}</p>
            
            <div className="w-full space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <Mail className="text-gray-400" size={20} />
                <span className="text-gray-700">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <ShieldCheck className="text-gray-400" size={20} />
                <span className="text-gray-700">Account Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Admin View ---
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 italic">Staff Management</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition hover:bg-blue-700">
          <UserPlus size={20} /> Add Member
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => { setFormData({...u, password:""}); setIsEdit(true); setShowModal(true); }} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(u.id, u.name)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">{isEdit ? "Update Staff" : "Add Staff"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" placeholder="Name" className="w-full p-2 border rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              {!isEdit && (
                <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              )}
              <select className="w-full p-2 border rounded" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                {isEdit ? "Update Member" : "Create Member"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}