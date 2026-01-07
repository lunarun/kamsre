
import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../../types';

interface WorkerDashboardViewProps {
  bookings: Booking[];
  ReqTag: React.FC<{ id: string }>;
}

type JobStatus = 'IDLE' | 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED';

const WorkerDashboardView: React.FC<WorkerDashboardViewProps> = ({ bookings, ReqTag }) => {
  const [status, setStatus] = useState<JobStatus>('ASSIGNED');
  const [showCancellationAlert, setShowCancellationAlert] = useState(false);

  // Sync with global booking state (e.g., monitor BK-8888)
  useEffect(() => {
    const activeMockJob = bookings.find(b => b.id === 'BK-8888');
    if (activeMockJob?.status === BookingStatus.CANCELLED && status !== 'IDLE' && status !== 'COMPLETED') {
      setShowCancellationAlert(true);
    }
  }, [bookings, status]);

  const handleDismissCancellation = () => {
    setShowCancellationAlert(false);
    setStatus('IDLE');
  };

  return (
    <div className="p-4 flex flex-col h-full bg-gray-50 overflow-y-auto relative">
      
      {/* Cancellation Alert Overlay for Worker */}
      {showCancellationAlert && (
        <div className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
           <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mb-6 relative">
              <span className="text-4xl animate-bounce">📢</span>
              <div className="absolute inset-0 border-4 border-amber-500 rounded-[2.5rem] animate-ping opacity-20"></div>
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Task Cancelled</h2>
           <p className="text-sm text-gray-500 mb-8 leading-relaxed">
             Resident <strong>John Doe</strong> has cancelled the order <span className="text-amber-600 font-bold">BK-8888</span>. 
             Please return to your station.
           </p>
           <button 
             onClick={handleDismissCancellation}
             className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition-all"
           >
             Acknowledge & Dismiss
           </button>
        </div>
      )}

      <header className="mb-8 flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src="https://picsum.photos/seed/worker-portal/100/100" className="w-16 h-16 rounded-2xl border-2 border-blue-100 shadow-md object-cover" alt="Worker" />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${status === 'IDLE' ? 'bg-gray-300' : 'bg-green-500'}`}></div>
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">Ahmad's Portal</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Master Cleaner</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rating</p>
          <p className="text-lg font-black text-gray-900">4.9 ★</p>
        </div>
      </header>

      <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-4">Assigned Task <ReqTag id="FR-4.3.1" /></h2>
      
      {status !== 'IDLE' && status !== 'COMPLETED' ? (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 mb-6 animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-100">House Cleaning</span>
              <h3 className="text-2xl font-black text-gray-900 mt-2">Lily's Garden Home</h3>
              <p className="text-sm text-gray-400 mt-1 font-medium">Village Plot #14B, Kuala Terengganu</p>
            </div>
            <div className="bg-gray-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg">🧹</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Time Slot</p>
              <p className="text-sm font-black text-gray-900 tracking-tight">09:00 AM - 11:00 AM</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Earnings</p>
              <p className="text-sm font-black text-green-600 tracking-tight">$25.00</p>
            </div>
          </div>

          <div className="space-y-4">
            {status === 'ASSIGNED' && (
              <button 
                onClick={() => setStatus('EN_ROUTE')}
                className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span>Start Trip</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            )}
            
            {status === 'EN_ROUTE' && (
              <button 
                onClick={() => setStatus('ARRIVED')}
                className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all"
              >
                I have Arrived
              </button>
            )}

            {status === 'ARRIVED' && (
              <button 
                onClick={() => setStatus('COMPLETED')}
                className="w-full py-5 bg-green-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-green-200 active:scale-95 transition-all"
              >
                Finish Job
              </button>
            )}

            <button className="w-full py-4 text-gray-400 font-bold text-sm hover:text-red-500 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 px-10 bg-white rounded-[2.5rem] shadow-inner border-2 border-dashed border-gray-200 flex flex-col items-center">
          <div className="text-5xl mb-6">🏝️</div>
          <p className="text-gray-900 font-black text-lg">You're all caught up!</p>
          <p className="text-gray-400 text-sm mt-1 font-medium">Wait here for new service requests from your village neighbors.</p>
          <button 
            onClick={() => setStatus('ASSIGNED')}
            className="mt-8 px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
          >
            Refresh Dashboard
          </button>
        </div>
      )}

      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Today's Jobs</p>
          <p className="text-2xl font-black text-gray-900 tracking-tight">12</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Payout Balance</p>
          <p className="text-2xl font-black text-blue-600 tracking-tight">$184.20</p>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboardView;
