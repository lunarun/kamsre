
import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../../types';
import { ICONS } from '../../constants';

interface OrderTrackingViewProps {
  booking: Booking;
  onBack: () => void;
  ReqTag: React.FC<{ id: string }>;
}

type TrackingPhase = 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETED';
type ErrorState = 'NONE' | 'GPS_DENIED' | 'LOCATION_LOST';

const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ booking, onBack, ReqTag }) => {
  const [phase, setPhase] = useState<TrackingPhase>('EN_ROUTE');
  const [errorState, setErrorState] = useState<ErrorState>('NONE');
  const [workerPos, setWorkerPos] = useState({ top: 75, left: 20 });
  const [eta, setEta] = useState(8);
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    if (phase !== 'EN_ROUTE' || errorState !== 'NONE') return;

    const interval = setInterval(() => {
      setWorkerPos(prev => {
        // Move smoother towards the top-right (Home position: 25, 65)
        const nextTop = Math.max(25, prev.top - 1.2);
        const nextLeft = Math.min(65, prev.left + 1.1);
        return { top: nextTop, left: nextLeft };
      });
      setEta(prev => Math.max(1, prev - 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [phase, errorState]);

  // Screen 4: Service Completion View
  if (phase === 'COMPLETED') {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Service Completed!</h2>
        <p className="text-gray-500 mb-8">Your KampungKu experience has been delivered successfully.</p>
        
        <div className="w-full bg-gray-50 rounded-[2.5rem] p-6 mb-8 border border-gray-100">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Order ID</span>
            <span className="font-black text-gray-900">{booking.id}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Total Paid</span>
            <span className="text-xl font-black text-blue-600">${(booking.totalPrice + 1.5).toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* ERROR FLOW: GPS Permission Denied Overlay */}
      {errorState === 'GPS_DENIED' && (
        <div className="absolute inset-0 z-[100] bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center animate-in fade-in">
          <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
          </div>
          <h2 className="text-xl font-black text-white mb-2">GPS Permission Denied</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">We need location access to show the worker's distance from your home accurately.</p>
          <button 
            onClick={() => setErrorState('NONE')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
          >
            Allow Location Access
          </button>
        </div>
      )}

      {/* Simulator Control Panel */}
      <div className="absolute top-24 right-4 z-40 space-y-2 flex flex-col items-end">
        <button 
          onClick={() => setErrorState(prev => prev === 'GPS_DENIED' ? 'NONE' : 'GPS_DENIED')}
          className="px-3 py-1.5 bg-red-500 text-white text-[9px] font-black rounded-lg shadow-lg uppercase tracking-tighter"
        >
          Sim: GPS Denied
        </button>
        <button 
          onClick={() => setErrorState(prev => prev === 'LOCATION_LOST' ? 'NONE' : 'LOCATION_LOST')}
          className="px-3 py-1.5 bg-orange-500 text-white text-[9px] font-black rounded-lg shadow-lg uppercase tracking-tighter"
        >
          Sim: Location Lost
        </button>
        <button 
          onClick={() => setIsDelayed(!isDelayed)}
          className="px-3 py-1.5 bg-purple-500 text-white text-[9px] font-black rounded-lg shadow-lg uppercase tracking-tighter"
        >
          Sim: Traffic Delay
        </button>
      </div>

      <header className="p-4 bg-white/80 backdrop-blur-md border-b flex items-center gap-4 z-40 sticky top-0">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-lg font-black text-gray-900 leading-none">
            {phase === 'EN_ROUTE' ? 'Live Tracking' : 'Service In Progress'}
          </h1>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Order #{booking.id}</p>
        </div>
      </header>

      {/* ERROR FLOW: Location Lost Banner */}
      {errorState === 'LOCATION_LOST' && (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 z-40 animate-in slide-in-from-top">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">GPS Connection Lost...</span>
        </div>
      )}

      {/* ALTERNATIVE FLOW: Traffic Delay Notification */}
      {isDelayed && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-center gap-3 z-40 animate-in slide-in-from-top">
          <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-lg">🚧</div>
          <div>
            <p className="text-[11px] font-black text-amber-900 leading-none">Heads up: Traffic is slow!</p>
            <p className="text-[9px] text-amber-700 font-bold mt-1 uppercase tracking-wider">Ahmad is doing his best to reach you soon.</p>
          </div>
        </div>
      )}

      {/* Screen 2: Real-Time Map Tracking Screen (GPS View) */}
      <div className={`flex-1 relative bg-[#f1f3f4] transition-all duration-700 overflow-hidden ${phase === 'IN_PROGRESS' ? 'h-40 grayscale opacity-40' : 'h-full'}`}>
        
        {/* Detailed Map Simulation (Township/Village Style) */}
        <div className="absolute inset-0 z-0">
          {/* Main Road */}
          <div className="absolute top-[25%] left-0 w-full h-8 bg-white border-y border-gray-300 transform -rotate-2"></div>
          <div className="absolute top-0 left-[60%] w-8 h-full bg-white border-x border-gray-300"></div>
          
          {/* Green Areas (Kampung Fields) */}
          <div className="absolute top-10 left-10 w-32 h-20 bg-[#e8f5e9] rounded-[2rem] border border-[#c8e6c9] opacity-60"></div>
          <div className="absolute bottom-20 right-10 w-40 h-32 bg-[#e8f5e9] rounded-[3rem] border border-[#c8e6c9] opacity-60"></div>
          
          {/* Water Features (Pond) */}
          <div className="absolute top-[50%] left-[15%] w-24 h-16 bg-[#e3f2fd] rounded-full border border-[#bbdefb] opacity-60"></div>
          
          {/* Building Blocks */}
          <div className="absolute top-[35%] left-[45%] w-10 h-10 bg-[#e0e0e0] rounded-lg"></div>
          <div className="absolute top-[32%] left-[55%] w-8 h-8 bg-[#e0e0e0] rounded-lg"></div>
          <div className="absolute bottom-[40%] right-[30%] w-12 h-10 bg-[#e0e0e0] rounded-lg"></div>

          {/* Grid Layer for depth */}
          <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] opacity-[0.15]">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-gray-400"></div>
            ))}
          </div>

          {/* Road Markings */}
          <div className="absolute top-[22%] left-[10%] text-[8px] font-black text-gray-400 uppercase tracking-tighter rotate-[-2deg]">Jalan Kampung Baru</div>
          <div className="absolute top-[40%] left-[65%] text-[8px] font-black text-gray-400 uppercase tracking-tighter rotate-90">Main Entrance</div>
        </div>

        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20">
          <line 
            x1="20%" y1="75%" x2="65%" y2="25%" 
            stroke="#2563eb" strokeWidth="4" strokeDasharray="8 4" 
          />
        </svg>

        {/* User Marker (Home) */}
        <div className="absolute top-[25%] left-[65%] flex flex-col items-center z-20">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="mt-2 bg-gray-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow-lg">My Home</span>
        </div>

        {/* Worker Marker */}
        <div 
          className="absolute transition-all duration-2000 ease-linear z-30"
          style={{ top: `${workerPos.top}%`, left: `${workerPos.left}%` }}
        >
          <div className="relative group">
            {/* Pulsing shadow */}
            <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-md opacity-40 animate-pulse"></div>
            
            <div className="relative w-16 h-16 bg-white rounded-[1.25rem] p-1 shadow-2xl border-2 border-blue-500 overflow-hidden transform group-hover:scale-110 transition-transform">
              <img src="https://picsum.photos/seed/worker-tracking/100/100" className="w-full h-full rounded-xl object-cover" alt="Worker" />
            </div>
            
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 3: User View: Service in Progress Screen */}
      <div className={`bg-white rounded-t-[3rem] shadow-[0_-15px_30px_rgba(0,0,0,0.08)] z-50 transition-all duration-500 overflow-hidden ${phase === 'IN_PROGRESS' ? 'flex-1 p-8' : 'p-6'}`}>
        {phase === 'EN_ROUTE' ? (
          <div className="animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group">
                  <span className="group-hover:scale-125 transition-transform duration-300">🛵</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">Arriving in <span className="text-blue-600">{eta} min</span></h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Professional: Ahmad Ismail</p>
                </div>
              </div>
              <button 
                onClick={() => setPhase('IN_PROGRESS')}
                className="p-4 bg-blue-50 text-blue-600 rounded-2xl active:scale-90 transition-all hover:bg-blue-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start opacity-50">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-0.5 h-6 bg-green-500/20 my-1"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-900">Order Dispatched</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">10:45 AM</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] relative">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-4 italic">Heading your way!</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Passing through main street</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center mb-6 relative group">
                 <span className="text-4xl animate-bounce group-hover:rotate-12 transition-transform">⚡</span>
                 <div className="absolute inset-[-8px] border-4 border-blue-600 border-t-transparent rounded-[2.5rem] animate-spin"></div>
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2">Work in Progress</h3>
               <p className="text-sm text-gray-500 mb-8 max-w-[250px] leading-relaxed">Your professional is meticulously handling your request. Sit back and relax!</p>
               
               <div className="w-full bg-blue-50 rounded-2xl p-5 flex items-center justify-between mb-8 border border-blue-100 shadow-inner">
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Elapsed Time</span>
                    <span className="text-xl font-black text-blue-900">14:52</span>
                  </div>
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-200"></div>
                    ))}
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => setPhase('COMPLETED')}
              className="w-full py-5 bg-green-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-green-100 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              Confirm Completion 
              <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingView;
