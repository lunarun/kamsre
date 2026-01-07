
import React, { useState } from 'react';
import { Booking, BookingStatus } from '../../types';

interface ProfileViewProps {
  bookings: Booking[];
  onTrack: (booking: Booking) => void;
  onCancel: (bookingId: string) => void;
  onViewDetail: (booking: Booking) => void;
  ReqTag: React.FC<{ id: string }>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ bookings, onTrack, onCancel, onViewDetail, ReqTag }) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleConfirmCancel = () => {
    if (cancellingId) {
      onCancel(cancellingId);
      setCancellingId(null);
    }
  };

  const getStatusStyles = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.IN_PROGRESS:
        return {
          container: 'bg-blue-100 text-blue-700',
          dot: 'bg-blue-500 animate-pulse'
        };
      case BookingStatus.ARRIVED:
        return {
          container: 'bg-emerald-100 text-emerald-700',
          dot: 'bg-emerald-500 animate-pulse'
        };
      case BookingStatus.ASSIGNED:
        return {
          container: 'bg-indigo-50 text-indigo-600',
          dot: 'bg-indigo-400'
        };
      case BookingStatus.CANCELLED:
        return {
          container: 'bg-slate-100 text-slate-400',
          dot: 'bg-slate-300'
        };
      case BookingStatus.COMPLETED:
        return {
          container: 'bg-green-50 text-green-600',
          dot: 'bg-green-500'
        };
      default:
        return {
          container: 'bg-slate-50 text-slate-500',
          dot: 'bg-slate-300'
        };
    }
  };

  return (
    <div className="p-4 relative min-h-full bg-white">
      <header className="mb-6 px-2">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Bookings</h1>
        <p className="text-slate-400 font-bold text-xs mt-0.5">Active and past services</p>
      </header>

      {/* Cancellation Modal */}
      {cancellingId && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl mx-auto mb-4">⚠️</div>
            <h2 className="text-lg font-black text-center text-gray-900 mb-1">Cancel Service?</h2>
            <p className="text-center text-slate-500 text-xs mb-6 leading-relaxed">This action will notify the worker immediately.</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={handleConfirmCancel} className="w-full py-3.5 bg-red-600 text-white rounded-xl font-black shadow-lg shadow-red-100 active:scale-95 transition-all">Yes, Cancel</button>
              <button onClick={() => setCancellingId(null)} className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold active:scale-95 transition-all">Keep It</button>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-100 mx-2">
          <p className="text-slate-400 font-bold text-sm">No history found</p>
        </div>
      ) : (
        <div className="space-y-3 px-1">
          {bookings.map((booking) => {
            const isActive = booking.status === BookingStatus.IN_PROGRESS || booking.status === BookingStatus.ASSIGNED || booking.status === BookingStatus.ARRIVED;
            const isCancelled = booking.status === BookingStatus.CANCELLED;
            const isCompleted = booking.status === BookingStatus.COMPLETED;
            const styles = getStatusStyles(booking.status);

            return (
              <div 
                key={booking.id} 
                onClick={() => onViewDetail(booking)}
                className="bg-white p-3.5 rounded-[1.25rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0 ${
                    isCancelled ? 'bg-orange-50/50' : 
                    isCompleted ? 'bg-green-50/50' : 'bg-blue-50/50'
                  }`}>
                    {isCancelled ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    ) : isCompleted ? (
                      <span className="text-green-500">✅</span>
                    ) : (
                      <span className="text-xl drop-shadow-sm">📦</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm tracking-tight">{booking.id}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {booking.date} • {booking.time}
                    </p>
                    
                    <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full ${styles.container}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                  {isActive ? (
                    <>
                      <button 
                        onClick={() => onTrack(booking)}
                        className="px-5 py-2 bg-blue-600 text-white text-[11px] font-black rounded-lg shadow-lg shadow-blue-50 active:scale-95 transition-all"
                      >
                        Track
                      </button>
                      <button 
                        onClick={() => setCancellingId(booking.id)}
                        className="text-red-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md transition-all"
                      >
                        CANCEL
                      </button>
                    </>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center text-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileView;
