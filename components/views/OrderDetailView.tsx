
import React from 'react';
import { Booking, BookingStatus } from '../../types';
import { MOCK_SERVICES, MOCK_WORKERS, ICONS } from '../../constants';

interface OrderDetailViewProps {
  booking: Booking;
  onBack: () => void;
  onTrack: (booking: Booking) => void;
  onCancel: (bookingId: string) => void;
  ReqTag: React.FC<{ id: string }>;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ booking, onBack, onTrack, onCancel, ReqTag }) => {
  const service = MOCK_SERVICES.find(s => s.id === booking.serviceId);
  const worker = MOCK_WORKERS.find(w => w.id === booking.workerId);

  const isActive = [BookingStatus.PENDING, BookingStatus.ASSIGNED, BookingStatus.IN_PROGRESS, BookingStatus.ARRIVED].includes(booking.status);
  
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
      case BookingStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Sticky Header */}
      <header className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Order #{booking.id}</h1>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
          {booking.status}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Service Section */}
        <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Service Information</h2>
          <div className="flex gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-inner shrink-0">
              <img src={service?.image || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=200'} className="w-full h-full object-cover" alt="Service" />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{service?.type}</span>
              <h3 className="text-lg font-black text-slate-900 leading-tight mt-1">{service?.title || 'Unknown Service'}</h3>
              <p className="text-xl font-black text-slate-900 mt-2">${booking.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </section>

        {/* Worker Section */}
        <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Assigned Professional</h2>
          {worker ? (
            <div className="flex items-center gap-4">
              <img src={worker.photo} className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-50" alt={worker.name} />
              <div className="flex-1">
                <h4 className="font-black text-slate-900 leading-none">{worker.name}</h4>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-xs font-bold text-slate-600">{worker.rating}</span>
                </div>
              </div>
              <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 py-2">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center animate-pulse border-2 border-slate-100">
                <span className="text-slate-300">⏳</span>
              </div>
              <p className="text-sm font-bold text-slate-500 italic">Assigning a professional...</p>
            </div>
          )}
        </section>

        {/* User & Schedule Info */}
        <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 space-y-6">
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Schedule Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                <p className="text-sm font-black text-slate-900">{booking.date}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot</p>
                <p className="text-sm font-black text-slate-900">{booking.time}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Delivery Address</h2>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{booking.fullName}</p>
                <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">{booking.address}</p>
                <p className="text-xs font-bold text-blue-600 mt-1">{booking.phone}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Summary */}
        <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
           <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Payment Breakdown</h2>
           <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold">
               <span className="text-slate-400">Service Fee</span>
               <span className="text-slate-900">${booking.totalPrice.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-xs font-bold">
               <span className="text-slate-400">Platform Fee</span>
               <span className="text-slate-900">$1.50</span>
             </div>
             <div className="pt-3 border-t-2 border-dashed border-slate-50 flex justify-between items-center">
               <span className="text-sm font-black text-slate-900 uppercase">Total Paid</span>
               <span className="text-xl font-black text-blue-600">${(booking.totalPrice + 1.5).toFixed(2)}</span>
             </div>
           </div>
        </section>

        {/* Action Buttons */}
        <div className="py-4 space-y-4">
          {isActive && (
            <>
              <button 
                onClick={() => onTrack(booking)}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 active:scale-[0.98] transition-all"
              >
                Live Tracking
              </button>
              {/* Cancel button upgraded with light gray background */}
              <button 
                onClick={() => onCancel(booking.id)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98]"
              >
                Cancel Booking
              </button>
            </>
          )}
          
          <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span>Contact Community Help</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
