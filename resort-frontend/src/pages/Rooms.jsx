import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit, Trash2, X } from "lucide-react";
import noImage from "../assets/no-image.jpeg";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    roomNo: "",
    roomType: "STANDARD",
    pricePerNight: "",
    status: "AVAILABLE",
    capacity: 2,
    description: ""
  });

  const IMAGE_BASE_URL = "http://localhost:8081/resort-management-ee/uploads/";

  const fetchRooms = async () => {
    if (!user?.token) return;
    try {
      const res = await api.get("/rooms", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const handleSave = async (e) => {
    e.preventDefault();

    const roomData = {
      roomNo: parseInt(formData.roomNo),
      roomType: formData.roomType,
      pricePerNight: parseFloat(formData.pricePerNight),
      status: formData.status,
      capacity: parseInt(formData.capacity),
      description: formData.description
    };

    try {
      if (isEdit) {
        await api.put(`/rooms/${formData.roomNo}`, roomData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert("Room Updated!");
      } else {
        await api.post("/rooms", roomData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert("Room Added!");
      }
      setShowModal(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      alert(error.response?.data || "Operation failed!");
    }
  };

  const handleDelete = async (roomNo) => {
    if (window.confirm(`Delete Room ${roomNo}?`)) {
      try {
        await api.delete(`/rooms/${roomNo}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setRooms((prev) => prev.filter((r) => r.roomNo !== roomNo));
      } catch (error) { // මෙතන error පාවිච්චි කරනවා
        console.error("Delete failed:", error); // අන්න දැන් warning එක එන්නේ නැහැ
        alert("Delete failed!");
      }
    }
  };

  const handleEditClick = (room) => {
    setFormData({
      roomNo: room.roomNo,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      status: room.status,
      capacity: room.capacity,
      description: room.description
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      roomNo: "",
      roomType: "STANDARD",
      pricePerNight: "",
      status: "AVAILABLE",
      capacity: 2,
      description: ""
    });
    setIsEdit(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Room Management</h1>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} /> Add New Room
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Preview</th>
              <th className="p-4">Room No</th>
              <th className="p-4">Type</th>
              <th className="p-4">Price ($)</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.roomNo} className="border-b">
                <td className="p-4">
                  <img src={room.imageUrl ? `${IMAGE_BASE_URL}${room.imageUrl}` : noImage} alt="room" className="w-16 h-12 object-cover rounded" />
                </td>
                <td className="p-4 font-bold">{room.roomNo}</td>
                <td className="p-4">{room.roomType}</td>
                <td className="p-4">${room.pricePerNight}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {room.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => handleEditClick(room)} className="text-blue-500"><Edit size={18} /></button>
                  {user?.role === "ADMIN" && <button onClick={() => handleDelete(room.roomNo)} className="text-red-500"><Trash2 size={18} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-4">{isEdit ? "Update Room" : "Add New Room"}</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <input type="number" placeholder="Room Number" disabled={isEdit} className="w-full p-2 border rounded bg-gray-50" value={formData.roomNo} onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })} required />
              
              <select className="w-full p-2 border rounded" value={formData.roomType} onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}>
                <option value="STANDARD">Standard</option>
                <option value="DELUXE">Deluxe</option>
                <option value="SUITE">Suite</option>
              </select>

              <input type="number" placeholder="Price Per Night" className="w-full p-2 border rounded" value={formData.pricePerNight} onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })} required />
              
              <input type="number" placeholder="Capacity (e.g. 2)" className="w-full p-2 border rounded" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
              
              <textarea placeholder="Description" className="w-full p-2 border rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

              <select className="w-full p-2 border rounded" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
              </select>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">{isEdit ? "Update Room" : "Save Room"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}