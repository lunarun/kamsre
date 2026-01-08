
import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../../types';

interface WorkerDashboardViewProps {
  bookings: Booking[];
  ReqTag: React.FC<{ id: string }>;
}

type JobStatus = 'IDLE' | 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED';

const WorkerDashboardView: React.FC<WorkerDashboardViewProps> = ({ bookings, ReqTag }) => {
  const [status, setStatus] = useState<JobStatus>('ASSIGNED');
  const [isJobUnavailable, setIsJobUnavailable] = useState(false);
  const [lastAssignedId, setLastAssignedId] = useState<string | null>('BK-8888');
  
  // Completion Confirmation States
  const [isConfirming, setIsConfirming] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  // Simulation State for manual testing
  const [forceUnavailable, setForceUnavailable] = useState(false);
  const [simCompletionFail, setSimCompletionFail] = useState(false);

  // Alternative Flow Logic: Assigned job unavailable
  useEffect(() => {
    if (status === 'IDLE' || status === 'COMPLETED') return;

    // Trigger condition 1: Real data change
    const activeJob = bookings.find(b => b.id === lastAssignedId);
    const isActuallyCancelled = !activeJob || activeJob.status === BookingStatus.CANCELLED;

    // Trigger condition 2: Manual simulator override
    if (isActuallyCancelled || forceUnavailable) {
      setIsJobUnavailable(true);
    }
  }, [bookings, status, lastAssignedId, forceUnavailable]);

  const handleReturnToDashboard = () => {
    setIsJobUnavailable(false);
    setForceUnavailable(false);
    setStatus('IDLE');
    setLastAssignedId(null);
  };

  const handleFinishJob = async () => {
    setIsConfirming(true);
    setCompletionError(null);

    // Simulate Network Latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (simCompletionFail) {
      // ALT FLOW: Confirmation Failure
      setCompletionError("Unable to confirm completion. Please check your connection and try again.");
      setIsConfirming(false);
    } else {
      // PRINCIPAL FLOW: Success
      setIsConfirming(false);
      setStatus('COMPLETED');
      // In a real app, this would update the backend
    }
  };

  return (
    <div className="p-4 flex flex-col h-full bg-gray-50 overflow-y-auto relative">
      
      {/* ALTERNATIVE FLOW OVERLAY: Job Unavailable */}
      {isJobUnavailable && (
        <div className="fixed inset-0 z-[1000] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-300">
           <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mb-8 relative border-2 border-amber-100 shadow-xl shadow-amber-500/10">
              <span className="text-4xl">⚠️</span>
              <div className="absolute inset-0 border-4 border-amber-500 rounded-[2.5rem] animate-ping opacity-20"></div>
           </div>
           
           <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Job Unavailable</h2>
           <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em] mb-6">Task Cancelled by System</p>
           
           <div className="bg-slate-50 p-6 rounded-[2rem] mb-12 w-full border border-slate-100 shadow-inner">
             <p className="text-sm text-slate-500 leading-relaxed font-bold">
               Sorry Ahmad, the assigned task <span className="text-blue-600">#{lastAssignedId || 'BK-8888'}</span> has been withdrawn.
             </p>
             <p className="text-[11px] text-slate-400 mt-3 uppercase font-black tracking-widest leading-tight">Returning to dashboard will make you available for new orders.</p>
           </div>
           
           <button 
             onClick={handleReturnToDashboard}
             className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
           >
             Return to Dashboard
           </button>
        </div>
      )}

      {/* DEBUG SIMULATOR PANEL */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-[2rem] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Simulator: Worker Flow</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => { setForceUnavailable(true); }}
            className="py-3 px-2 bg-white border border-purple-200 text-purple-600 text-[10px] font-black uppercase rounded-xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            Sim: Job Cancelled
          </button>
          <button 
            onClick={() => { setSimCompletionFail(!simCompletionFail); }}
            className={`py-3 px-2 border text-[10px] font-black uppercase rounded-xl transition-all active:scale-95 shadow-sm ${simCompletionFail ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-200'}`}
          >
            Sim: Completion Fail {simCompletionFail ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={() => { 
              setStatus('IDLE'); 
              setLastAssignedId(null); 
              setIsJobUnavailable(false); 
              setForceUnavailable(false);
              setCompletionError(null);
              setIsConfirming(false);
            }}
            className="col-span-2 py-3 px-2 bg-white border border-purple-200 text-purple-600 text-[10px] font-black uppercase rounded-xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            Reset to Idle 🏝️
          </button>
        </div>
      </div>

      <header className="mb-8 flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src="https://picsum.photos/seed/worker-portal/100/100" className="w-16 h-16 rounded-2xl border-2 border-blue-100 shadow-md object-cover" alt="Worker" />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${status === 'IDLE' ? 'bg-amber-400' : 'bg-green-500'}`}></div>
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 leading-none">Ahmad's Portal</h1>
            <div className="flex items-center gap-2 mt-1.5">
               <span className={`w-1.5 h-1.5 rounded-full ${status === 'IDLE' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                 {status === 'IDLE' ? 'Searching for jobs...' : 'Active Service'}
               </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rating</p>
          <p className="text-lg font-black text-gray-900">4.9 ★</p>
        </div>
      </header>

      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Current Status</h2>
      
      {status !== 'IDLE' && status !== 'COMPLETED' ? (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 mb-6 animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-full tracking-widest border border-blue-100">House Cleaning</span>
              <h3 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">Lily's Garden Home</h3>
              <p className="text-xs text-slate-400 mt-1 font-bold">Village Plot #14B, Kuala Terengganu</p>
            </div>
            <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg">🧹</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot</p>
              <p className="text-sm font-black text-slate-900 tracking-tight">09:00 - 11:00 AM</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Earnings</p>
              <p className="text-sm font-black text-blue-600 tracking-tight">$25.00</p>
            </div>
          </div>

          <div className="space-y-4">
            {status === 'ASSIGNED' && (
              <button 
                onClick={() => setStatus('EN_ROUTE')}
                className="w-full py-5 bg-blue-600 text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-blue-50 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span>Start Trip</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            )}
            
            {status === 'EN_ROUTE' && (
              <button 
                onClick={() => setStatus('ARRIVED')}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-lg shadow-xl active:scale-95 transition-all"
              >
                I have Arrived
              </button>
            )}

            {status === 'ARRIVED' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {completionError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">!</div>
                    <p className="text-[11px] text-red-600 font-bold leading-relaxed">{completionError}</p>
                  </div>
                )}
                
                <button 
                  onClick={handleFinishJob}
                  disabled={isConfirming}
                  className={`w-full py-5 rounded-[1.75rem] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                    isConfirming ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
                    completionError ? 'bg-red-600 text-white active:scale-95' : 'bg-green-600 text-white shadow-green-50 active:scale-95'
                  }`}
                >
                  {isConfirming ? (
                    <>
                      <div className="w-5 h-5 border-3 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>{completionError ? 'Retry Confirmation' : 'Finish Job'}</span>
                  )}
                </button>
              </div>
            )}

            <button className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors">
              Contact Center
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 px-10 bg-white rounded-[2.5rem] shadow-inner border-2 border-dashed border-slate-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-5xl animate-bounce duration-[2000ms]">🏝️</div>
          <p className="text-slate-900 font-black text-xl tracking-tight">Idle - Waiting for Task</p>
          <p className="text-slate-400 text-xs mt-3 font-bold leading-relaxed max-w-[240px]">
            You are currently online. New service requests from your Kampung neighbors will appear here automatically.
          </p>
          <button 
            onClick={() => { setLastAssignedId('BK-8888'); setStatus('ASSIGNED'); setCompletionError(null); }}
            className="mt-10 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            Manual Check-in
          </button>
        </div>
      )}

      <div className="mt-auto grid grid-cols-2 gap-4 pt-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Jobs</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">12</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payout</p>
          <p className="text-2xl font-black text-blue-600 tracking-tight">$184</p>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboardView;
