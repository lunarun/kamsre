
import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../../types';

interface OrderTrackingViewProps {
  booking: Booking;
  onBack: () => void;
  onComplete: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  ReqTag: React.FC<{ id: string }>;
}

const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ booking, onBack, onComplete, onCancel, ReqTag }) => {
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(BookingStatus.IN_PROGRESS);
  const [workerPos, setWorkerPos] = useState({ top: 75, left: 20 });
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  
  // Simulation switches: NONE | GPS_DENIED | LOCATION_LOST | TRAFFIC_DELAY
  const [activeErrors, setActiveErrors] = useState<Set<'GPS_DENIED' | 'LOCATION_LOST' | 'TRAFFIC_DELAY'>>(new Set());

  useEffect(() => {
    // Only move if we are in progress and no blocking errors
    if (currentStatus !== BookingStatus.IN_PROGRESS || activeErrors.size > 0) return;

    const interval = setInterval(() => {
      setWorkerPos(prev => {
        // Total distance: top (75-25=50), left (65-20=45)
        const nextTop = Math.max(25, prev.top - 10);
        const nextLeft = Math.min(65, prev.left + 9);
        
        if (nextTop <= 25 && nextLeft >= 65) {
          setCurrentStatus(BookingStatus.ARRIVED);
          return { top: 25, left: 65 };
        }
        
        return { top: nextTop, left: nextLeft };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStatus, activeErrors]);

  const toggleError = (err: 'GPS_DENIED' | 'LOCATION_LOST' | 'TRAFFIC_DELAY') => {
    const next = new Set(activeErrors);
    if (next.has(err)) next.delete(err);
    else next.add(err);
    setActiveErrors(next);
  };

  const GpsPermissionModal = () => {
    if (!activeErrors.has('GPS_DENIED')) return null;

    return (
      <div className="absolute inset-0 z-[100] bg-[#1e293b] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div className="relative">
          <button 
            onClick={() => toggleError('GPS_DENIED')}
            className="absolute -right-24 top-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-900 active:scale-90 transition-transform pointer-events-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>

          <div className="w-28 h-28 bg-[#f8717133] rounded-full flex items-center justify-center border-2 border-red-400/20 mb-10 mx-auto">
            <div className="w-20 h-20 bg-red-500/80 rounded-full flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">GPS Permission Denied</h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-[280px] mx-auto mb-10">
            We need location access to show the worker's distance from your home accurately.
          </p>

          <button 
            onClick={() => toggleError('GPS_DENIED')}
            className="px-10 py-4 bg-[#2563eb] text-white rounded-2xl font-black shadow-xl shadow-blue-900/20 active:scale-95 transition-all text-sm uppercase tracking-wider"
          >
            Allow Location Access
          </button>
        </div>
      </div>
    );
  };

  const NotificationBanners = () => {
    const showLocationError = activeErrors.has('LOCATION_LOST');
    const showTrafficError = activeErrors.has('TRAFFIC_DELAY');

    return (
      <div className="absolute top-0 left-0 w-full z-[60] flex flex-col pointer-events-none">
        {showLocationError && (
          <div className="w-full bg-[#cc1d24] py-3 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300 pointer-events-auto shadow-md">
            <div className="w-5 h-5 rounded-full bg-white/20"></div>
            <span className="text-white font-black text-sm tracking-[0.1em] uppercase">GPS CONNECTION LOST...</span>
          </div>
        )}

        {showTrafficError && (
          <div className="w-full bg-[#fff9e6] p-2 flex items-center gap-4 animate-in slide-in-from-top duration-300 pointer-events-auto border-b border-amber-100 shadow-md">
            <div className="w-10 h-10 bg-[#fff1c2] rounded-full flex items-center justify-center shrink-0">
               <span className="text-2xl">🚧</span>
            </div>
            <div className="flex-1">
              <h4 className="text-[#7a4100] font-black text-base leading-tight">Heads up: Traffic is slow!</h4>
              <p className="text-[#a66d1f] font-black text-[10px] uppercase tracking-wider mt-0.5">AHMAD IS DOING HIS BEST TO REACH YOU SOON.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* Cancellation Confirmation Overlay */}
      {isConfirmingCancel && (
        <div className="absolute inset-0 z-[110] bg-black/50 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs text-center shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🛑</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Cancel Tracking?</h3>
            <p className="text-slate-500 text-xs mb-8 leading-relaxed">
              Professional is only <span className="font-bold text-blue-600">1 min away</span>. Are you sure you want to cancel the service?
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => onCancel(booking.id)}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-100 active:scale-95 transition-all"
              >
                Yes, Cancel Order
              </button>
              <button 
                onClick={() => setIsConfirmingCancel(false)}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold active:scale-95 transition-all"
              >
                Nevermind
              </button>
            </div>
          </div>
        </div>
      )}

      <GpsPermissionModal />

      <header className="p-4 bg-white/90 backdrop-blur-md border-b flex items-center gap-4 z-40 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-900 leading-none">Live Tracking</h1>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Order #{booking.id}</p>
        </div>
      </header>

      <div className="flex-1 relative bg-[#f1f5f9] overflow-hidden">
        <NotificationBanners />

        {/* Simulator controls */}
        <div className="absolute top-20 left-4 z-[70] flex flex-col gap-2 pointer-events-auto">
          <button onClick={() => toggleError('GPS_DENIED')} className={`px-3 py-1.5 ${activeErrors.has('GPS_DENIED') ? 'bg-red-700 ring-2 ring-white' : 'bg-red-500'} text-white text-[9px] font-black rounded-lg shadow-lg uppercase transition-all`}>SIM: GPS DENIED</button>
          <button onClick={() => toggleError('LOCATION_LOST')} className={`px-3 py-1.5 ${activeErrors.has('LOCATION_LOST') ? 'bg-orange-700 ring-2 ring-white' : 'bg-orange-500'} text-white text-[9px] font-black rounded-lg shadow-lg uppercase transition-all`}>SIM: LOCATION LOST</button>
          <button onClick={() => toggleError('TRAFFIC_DELAY')} className={`px-3 py-1.5 ${activeErrors.has('TRAFFIC_DELAY') ? 'bg-purple-700 ring-2 ring-white' : 'bg-purple-500'} text-white text-[9px] font-black rounded-lg shadow-lg uppercase transition-all`}>SIM: TRAFFIC DELAY</button>
        </div>

        {/* Map Visuals */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-12 border border-slate-300">
            {Array.from({length: 96}).map((_, i) => (
              <div key={i} className="border-[0.5px] border-slate-300 bg-white/30"></div>
            ))}
          </div>
          <div className="absolute top-1/4 w-full h-12 bg-slate-200/60 border-y border-slate-300 -rotate-2"></div>
          <div className="absolute right-1/4 h-full w-12 bg-slate-200/60 border-x border-slate-300"></div>
        </div>

        {/* Home Marker */}
        <div className="absolute top-[25%] left-[65%] flex flex-col items-center z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span className="mt-2 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-lg">MY HOME</span>
        </div>

        {/* Worker Marker */}
        <div 
          className="absolute transition-all duration-1000 ease-linear z-20" 
          style={{ 
            top: `${workerPos.top}%`, 
            left: `${workerPos.left}%`,
            opacity: activeErrors.has('LOCATION_LOST') ? 0.2 : 1 
          }}
        >
           <div className="w-14 h-14 bg-white rounded-2xl p-1 shadow-2xl border-2 border-blue-500 overflow-hidden transform hover:scale-110 transition-transform relative">
              <img src="https://picsum.photos/seed/delivery-worker/120/120" className="w-full h-full rounded-xl object-cover" alt="Worker" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Status Panel */}
      <div className="bg-white rounded-t-[2.5rem] shadow-[0_-15px_35px_rgba(0,0,0,0.08)] p-8 z-50 relative animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">🛵</div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {currentStatus === BookingStatus.ARRIVED ? <span className="text-blue-600">Arrived!</span> : <>Arriving in <span className="text-blue-600">1 min</span></>}
              </h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">PROFESSIONAL: AHMAD ISMAIL</p>
            </div>
          </div>
          <button className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="flex flex-col items-center mt-1 shrink-0">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <div className="w-0.5 h-8 bg-slate-100 mt-1"></div>
            </div>
            <div>
              <p className="text-[13px] font-black text-slate-400 uppercase tracking-wide leading-none">Order Dispatched</p>
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">10:45 AM</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex flex-col items-center mt-1 shrink-0">
               <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${currentStatus === BookingStatus.ARRIVED ? 'bg-green-500' : 'bg-blue-600 animate-pulse'}`}>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
               </div>
               {currentStatus === BookingStatus.ARRIVED && <div className="w-0.5 h-8 bg-slate-100 mt-1"></div>}
            </div>
            <div>
              <p className={`text-sm font-black italic underline decoration-blue-200 decoration-4 underline-offset-4 ${currentStatus === BookingStatus.ARRIVED ? 'text-slate-400 no-underline' : 'text-blue-600'}`}>Heading your way!</p>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">PASSING THROUGH MAIN STREET</p>
            </div>
          </div>

          {currentStatus === BookingStatus.ARRIVED ? (
            <div className="flex gap-4 items-start animate-in slide-in-from-left duration-500 pt-1">
              <div className="flex flex-col items-center mt-1 shrink-0">
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-100">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-blue-600 uppercase tracking-tight">Arrived at your location!</p>
                <button 
                  onClick={() => onComplete(booking.id)}
                  className="mt-6 w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  Confirm Completion
                </button>
              </div>
            </div>
          ) : (
            /* Cancel button upgraded with light gray background */
            <div className="pt-4 flex justify-center">
              <button 
                onClick={() => setIsConfirmingCancel(true)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingView;
