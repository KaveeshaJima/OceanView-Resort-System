import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  UserPlus, 
  Key, 
  CalendarCheck, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const guides = [
    {
      title: "How to Add a New Guest?",
      icon: <UserPlus className="text-blue-500" />,
      content: "Navigate to the 'Guests' menu from the sidebar. Click the 'Add New' button. Fill in the Guest Name, Address, and Contact Number. Always ensure the Contact Number is valid before saving."
    },
    {
      title: "Making a Room Reservation",
      icon: <CalendarCheck className="text-emerald-500" />,
      content: "Go to 'Reservations' and select 'New Booking'. Choose the Guest and the Room. Select Check-in and Check-out dates. The system will automatically check if the room is available for those dates."
    },
    {
      title: "Understanding Room Status",
      icon: <BookOpen className="text-orange-500" />,
      content: "Rooms can have different statuses: 'AVAILABLE' (ready to book), 'OCCUPIED' (guest currently staying), or 'MAINTENANCE'. You can only book rooms that are currently marked as AVAILABLE."
    },
    {
      title: "How to Cancel or Delete a Booking?",
      icon: <AlertCircle className="text-red-500" />,
      content: "If a guest cancels, find their booking in the Reservation List. You can either change the status to 'CANCELLED' or use the Delete button to permanently remove the record from the database."
    },
    {
      title: "Managing User Security",
      icon: <Key className="text-purple-500" />,
      content: "Each staff member has their own login. Never share your password. Always remember to 'Logout' when you are leaving the workstation to protect guest data."
    }
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
          <HelpCircle size={36} className="text-blue-600" /> System Guide
        </h1>
        <p className="text-slate-500 font-medium mt-2">Essential instructions for OceanView Resort staff members.</p>
      </div>

      <div className="max-w-4xl space-y-4">
        {guides.map((guide, index) => (
          <div key={index} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  {guide.icon}
                </div>
                <span className="font-bold text-slate-800 text-lg">{guide.title}</span>
              </div>
              {openIndex === index ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </button>

            {openIndex === index && (
              <div className="px-6 pb-6 pt-0">
                <div className="h-px bg-slate-100 mb-6" />
                <p className="text-slate-600 leading-relaxed font-medium">
                  {guide.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-xl font-bold mb-1">Still need help?</h4>
          <p className="text-slate-400 text-sm">Our technical team is available for urgent system issues.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs">
          Contact IT Support
        </button>
      </div>
    </div>
  );
}