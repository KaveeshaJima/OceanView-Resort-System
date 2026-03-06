import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Edit, Trash2, X, Search } from "lucide-react";

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    contactNo: ""
  });

  // ================= FETCH GUESTS =================
  const fetchGuests = async () => {
    if (!user?.token) return;
    try {
      const res = await api.get("/guests", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setGuests(res.data);
    } catch (err) {
      console.error("Error fetching guests:", err);
    }
  };

  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  // ================= SAVE / UPDATE =================
  const handleSave = async (e) => {
    e.preventDefault();
    const guestData = {
      name: formData.name,
      address: formData.address,
      contactNo: formData.contactNo
    };

    try {
      if (isEdit) {
        await api.put(`/guests/${formData.id}`, guestData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert("Guest Updated!");
      } else {
        await api.post("/guests", guestData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert("Guest Added Successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchGuests();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Operation failed! Please check your network or backend.");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await api.delete(`/guests/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setGuests(guests.filter(g => g.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Delete failed!");
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", address: "", contactNo: "" });
    setIsEdit(false);
  };

  // Search filter logic
  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.contactNo.includes(searchTerm)
  );

  // Permissions: Admin and Receptionist can Manage. Manager can only View.
  const canManage = user?.role === "ADMIN" || user?.role === "RECEPTIONIST";

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Guest Details</h1>
        {canManage && (
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-md">
            <UserPlus size={20} /> Add New Guest
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or phone..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-bold text-gray-700">Name</th>
              <th className="p-4 font-bold text-gray-700">Address</th>
              <th className="p-4 font-bold text-gray-700">Contact No</th>
              {canManage && <th className="p-4 text-center font-bold text-gray-700">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((g) => (
                <tr key={g.id} className="border-b hover:bg-emerald-50/30 transition">
                  <td className="p-4 font-semibold text-gray-800">{g.name}</td>
                  <td className="p-4 text-gray-600">{g.address}</td>
                  <td className="p-4 text-gray-600">{g.contactNo}</td>
                  {canManage && (
                    <td className="p-4 flex justify-center gap-4">
                      <button onClick={() => { setFormData(g); setIsEdit(true); setShowModal(true); }} className="text-blue-500 hover:bg-blue-100 p-1 rounded transition"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(g.id)} className="text-red-500 hover:bg-red-100 p-1 rounded transition"><Trash2 size={18} /></button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canManage ? 4 : 3} className="p-10 text-center text-gray-500 italic">No guests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{isEdit ? "Update Guest" : "Register New Guest"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black transition"><X size={28} /></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <input type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                <input type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition" value={formData.contactNo} onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })} required />
              </div>
              
              <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg text-lg mt-4">
                {isEdit ? "Update Guest" : "Save Guest"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}