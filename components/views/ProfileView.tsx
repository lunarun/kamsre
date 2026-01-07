
import React, { useState } from 'react';
import { Booking, BookingStatus } from '../../types';

interface ProfileViewProps {
  bookings: Booking[];
  onTrack: (booking: Booking) => void;
  onCancel: (bookingId: string) => void;
  ReqTag: React.FC<{ id: string }>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ bookings, onTrack, onCancel, ReqTag }) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleConfirmCancel = () => {
    if (cancellingId) {
      onCancel(cancellingId);
      setCancellingId(null);
    }
  };

  return (
    <div className="p-4 relative min-h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Bookings <ReqTag id="FR-7.2.28" /></h1>
        <p className="text-gray-500 text-sm">Active and past services</p>
      </header>

      {/* Cancellation Confirmation Modal */}
      {cancellingId && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">⚠️</div>
            <h2 className="text-xl font-black text-center text-gray-900 mb-2">Cancel Service?</h2>
            <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">The worker will be notified immediately. This action cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmCancel}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-100 active:scale-95 transition-all"
              >
                Yes, Cancel Order
              </button>
              <button 
                onClick={() => setCancellingId(null)}
                className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold active:scale-95 transition-all"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-400">No bookings yet. Start by exploring services!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                  booking.status === BookingStatus.CANCELLED ? 'bg-gray-100' : 'bg-blue-50'
                }`}>
                  {booking.status === BookingStatus.PAYMENT_FAILED ? '❌' : 
                   booking.status === BookingStatus.CANCELLED ? '🚫' : '📦'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{booking.id}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{booking.date} • {booking.time}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    booking.status === BookingStatus.ASSIGNED || booking.status === BookingStatus.IN_PROGRESS ? 'bg-green-100 text-green-700' : 
                    booking.status === BookingStatus.CANCELLED ? 'bg-gray-100 text-gray-400' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {booking.status !== BookingStatus.PAYMENT_FAILED && booking.status !== BookingStatus.CANCELLED && (
                  <>
                    <button 
                      onClick={() => onTrack(booking)}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all"
                    >
                      Track
                    </button>
                    <button 
                      onClick={() => setCancellingId(booking.id)}
                      className="px-4 py-2 text-red-500 text-[10px] font-black uppercase tracking-tighter hover:bg-red-50 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileView;
