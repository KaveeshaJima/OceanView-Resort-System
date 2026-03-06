import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit, FileText, UserPlus, Calculator, Calendar, Trash2, Search, X } from "lucide-react";

export default function Reservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    guestId: "", roomNo: "", checkIn: "", checkOut: ""
  });

  const [newGuest, setNewGuest] = useState({ name: "", address: "", contactNo: "" });

  // ================= DATA FETCHING =================
  useEffect(() => {
    const loadData = async () => {
      if (!user?.token) return;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      try {
        const [resRes, guestRes, roomRes] = await Promise.all([
          api.get("/reservations", config),
          api.get("/guests", config),
          api.get("/rooms", config)
        ]);
        setReservations(resRes.data);
        setGuests(guestRes.data);
        setRooms(roomRes.data);
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };
    loadData();
  }, [user?.token]);

  // ================= SEARCH LOGIC =================
  const filteredReservations = reservations.filter((res) =>
    res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.roomNo.toString().includes(searchTerm)
  );

  // ================= ACTIONS =================
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // 1. Backend එකට delete request එක යවනවා (දැන් backend එක room එකත් update කරනවා)
        await api.delete(`/reservations/${id}`, config);
        
        alert("Reservation Deleted Successfully!");

        // 2. UI එකේ පේන Reservations list එකෙන් මේක අයින් කරනවා
        setReservations(prev => prev.filter(res => res.resId !== id));

        // 3. වැදගත්ම දේ: අලුත් Room Status ටික දැනගන්න rooms list එක refresh කරනවා
        const roomRes = await api.get("/rooms", config);
        setRooms(roomRes.data);

    } catch (error) {
        console.error("Delete error:", error);
    }
};

  const handleSave = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const payload = {
      ...formData,
      guestId: parseInt(formData.guestId),
      roomNo: parseInt(formData.roomNo)
    };

    try {
      if (isEdit) {
        await api.put(`/reservations/${editId}`, payload, config);
        alert("Reservation Updated!");
      } else {
        await api.post("/reservations", payload, config);
        alert("Reservation Successful!");
      }
      setShowModal(false);
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Action Failed!");
    }
  };

  const handleQuickGuestAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/guests", newGuest, { 
        headers: { Authorization: `Bearer ${user.token}` } 
      });
      setGuests(prev => [...prev, res.data]);
      setFormData(prev => ({ ...prev, guestId: res.data.id }));
      setShowGuestModal(false);
      setNewGuest({ name: "", address: "", contactNo: "" });
    } catch (err) {
      console.error(err);
      alert("Guest Add Failed!");
    }
  };

  // ================= HELPERS =================
  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.roomNo) return { nights: 0, total: 0 };
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const selectedRoom = rooms.find(r => r.roomNo === parseInt(formData.roomNo));
    
    if (end > start && selectedRoom) {
      const diffTime = Math.abs(end - start);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { nights, total: nights * selectedRoom.pricePerNight };
    }
    return { nights: 0, total: 0 };
  };

  const { nights, total } = calculateTotal();
  const downloadInvoice = (id) => {
    window.open(`http://localhost:8081/resort-management-ee/api/reservations/${id}/invoice`, '_blank');
  };

  const canEdit = user?.role === "ADMIN" || user?.role === "RECEPTIONIST";

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3 italic uppercase tracking-tighter">
          <Calendar className="text-blue-600" size={32} /> Reservations
        </h1>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by guest or room..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {canEdit && (
          <button onClick={() => { setIsEdit(false); setFormData({guestId:"", roomNo:"", checkIn:"", checkOut:""}); setShowModal(true); }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all font-bold uppercase tracking-wider text-xs">
            <Plus size={18} /> New Booking
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-[2rem] overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-widest text-gray-400 font-black">
            <tr>
              <th className="p-5">Guest</th>
              <th className="p-5">Room</th>
              <th className="p-5">Stay Dates</th>
              <th className="p-5 text-center">Total Price</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700">
            {filteredReservations.length > 0 ? (
              filteredReservations.map(res => (
                <tr key={res.resId} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-5 font-bold text-gray-800">{res.guestName}</td>
                  <td className="p-5 font-medium"><span className="bg-slate-100 px-3 py-1 rounded-lg">Room {res.roomNo}</span></td>
                  <td className="p-5 text-sm font-medium">
                    <div className="text-blue-600">In: {res.checkIn}</div>
                    <div className="text-gray-400">Out: {res.checkOut}</div>
                  </td>
                  <td className="p-5 text-center font-black text-emerald-600">${res.totalPrice}</td>
                  <td className="p-5 flex justify-center gap-2">
                    <button onClick={() => downloadInvoice(res.resId)} className="text-blue-500 hover:bg-blue-50 p-2.5 rounded-xl transition"><FileText size={20} /></button>
                    {canEdit && (
                      <>
                        <button onClick={() => { setIsEdit(true); setEditId(res.resId); setFormData({guestId: res.guestId, roomNo: res.roomNo, checkIn: res.checkIn, checkOut: res.checkOut}); setShowModal(true); }} className="text-orange-500 hover:bg-orange-50 p-2.5 rounded-xl transition"><Edit size={20} /></button>
                        <button onClick={() => handleCancel(res.resId)} className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition"><Trash2 size={20} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest">No matching records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Main Booking Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tight">{isEdit ? "Update Booking" : "New Booking"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Guest Selection</label>
                  <select className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-700" value={formData.guestId || ""} onChange={e => setFormData({...formData, guestId: e.target.value})} required>
                    <option value="">Choose Guest</option>
                    {guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                {!isEdit && (
                  <button type="button" onClick={() => setShowGuestModal(true)} className="bg-blue-600 p-4 rounded-2xl text-white hover:bg-blue-700 shadow-lg"><UserPlus size={22}/></button>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Room Selection</label>
                <select className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-700" value={formData.roomNo || ""} onChange={e => setFormData({...formData, roomNo: e.target.value})} required>
                  <option value="">Select Room</option>
                  {rooms.map(r => (r.status === "AVAILABLE" || r.roomNo === parseInt(formData.roomNo)) && (
                    <option key={r.roomNo} value={r.roomNo}>Room {r.roomNo} - ${r.pricePerNight}/night</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Check-In</label>
                  <input type="date" className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 font-bold" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Check-Out</label>
                  <input type="date" className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 font-bold" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} required />
                </div>
              </div>
              
              <div className="bg-slate-900 p-6 rounded-[2rem] flex justify-between items-center text-white mt-4">
                <div className="flex items-center gap-4">
                  <Calculator size={24} className="text-blue-400"/>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Nights</p>
                    <p className="text-xl font-black">{nights}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-black">Estimated Total</p>
                  <p className="text-3xl font-black text-blue-400">${total.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 shadow-xl transition-all">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Quick Add Guest Modal --- */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative">
            <h3 className="text-2xl font-black mb-6 text-gray-800 uppercase italic">Add Guest</h3>
            <form onSubmit={handleQuickGuestAdd} className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 font-bold" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} required />
              <input type="text" placeholder="Address" className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 font-bold" value={newGuest.address} onChange={e => setNewGuest({...newGuest, address: e.target.value})} required />
              <input type="text" placeholder="Contact No" className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 font-bold" value={newGuest.contactNo} onChange={e => setNewGuest({...newGuest, contactNo: e.target.value})} required />
              <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setShowGuestModal(false)} className="flex-1 bg-gray-100 py-4 rounded-2xl font-black uppercase text-xs text-gray-400">Cancel</button>
                 <button type="submit" className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg">Save Guest</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}