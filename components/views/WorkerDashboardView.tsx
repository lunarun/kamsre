
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
  
  // Navigation Simulation States
  const [workerPos, setWorkerPos] = useState({ top: 60, left: 20 });
  const [eta, setEta] = useState(1); 

  // Completion Confirmation States
  const [isConfirming, setIsConfirming] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  // Simulation State
  const [forceUnavailable, setForceUnavailable] = useState(false);
  const [simCompletionFail, setSimCompletionFail] = useState(false);
  const [isWeakSignal, setIsWeakSignal] = useState(false); 

  // Alternative Flow Logic
  useEffect(() => {
    if (status === 'IDLE' || status === 'COMPLETED') return;
    const activeJob = bookings.find(b => b.id === lastAssignedId);
    const isActuallyCancelled = !activeJob || activeJob.status === BookingStatus.CANCELLED;
    if (isActuallyCancelled || forceUnavailable) {
      setIsJobUnavailable(true);
    }
  }, [bookings, status, lastAssignedId, forceUnavailable]);

  // Navigation Logic (5s)
  useEffect(() => {
    if (status !== 'EN_ROUTE') return;
    const startPos = { top: 60, left: 20 };
    const targetPos = { top: 40, left: 60 };
    const duration = 5000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentTop = startPos.top + (targetPos.top - startPos.top) * progress;
      const currentLeft = startPos.left + (targetPos.left - startPos.left) * progress;
      const jitter = isWeakSignal ? (Math.random() - 0.5) * 2 : 0;
      
      setWorkerPos({ top: currentTop + jitter, left: currentLeft + jitter });
      if (progress >= 1) {
        setEta(0);
        setStatus('ARRIVED');
        clearInterval(interval);
      } else {
        setEta(1 - progress);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [status, isWeakSignal]);

  const handleReturnToDashboard = () => {
    setIsJobUnavailable(false);
    setForceUnavailable(false);
    setStatus('IDLE');
    setLastAssignedId(null);
  };

  const handleFinishJob = async () => {
    setIsConfirming(true);
    setCompletionError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (simCompletionFail) {
      setCompletionError("Unable to confirm completion.");
      setIsConfirming(false);
    } else {
      setIsConfirming(false);
      setStatus('COMPLETED');
    }
  };

  const isNavigatingOrArrived = status === 'EN_ROUTE' || status === 'ARRIVED';

  return (
    <div className={`flex flex-col h-full bg-slate-50 relative ${isNavigatingOrArrived ? 'overflow-hidden' : 'p-4 overflow-y-auto pb-28'}`}>
      
      {/* ALTERNATIVE FLOW OVERLAY */}
      {isJobUnavailable && (
        <div className="fixed inset-0 z-[1000] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-10 text-center">
           <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-amber-100 shadow-xl shadow-amber-500/10">
              <span className="text-4xl">⚠️</span>
           </div>
           <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Job Unavailable</h2>
           <p className="text-sm text-slate-500 mb-8 px-6">This task has been withdrawn or cancelled.</p>
           <button onClick={handleReturnToDashboard} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl active:scale-95 transition-all text-sm uppercase tracking-widest">Return to Dashboard</button>
        </div>
      )}

      {/* DEBUG PANEL - Positioned to ensure visibility and interaction */}
      {!isNavigatingOrArrived && !isJobUnavailable && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-[2rem] shadow-sm shrink-0 z-50">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Simulator</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setForceUnavailable(true)} className="py-2.5 px-2 bg-white border border-purple-200 text-purple-600 text-[9px] font-black uppercase rounded-xl active:bg-purple-100 transition-colors">Sim: Cancelled ⚠️</button>
            <button onClick={() => setSimCompletionFail(!simCompletionFail)} className={`py-2.5 px-2 border text-[9px] font-black uppercase rounded-xl transition-all ${simCompletionFail ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-200'}`}>Sim: Fail {simCompletionFail ? 'ON' : 'OFF'}</button>
            <button onClick={() => { setStatus('IDLE'); setWorkerPos({ top: 60, left: 20 }); setEta(1); setIsWeakSignal(false); setForceUnavailable(false); }} className="col-span-2 py-2.5 px-2 bg-white border border-purple-200 text-purple-600 text-[9px] font-black uppercase rounded-xl active:bg-purple-100 transition-colors">Reset Flow 🏝️</button>
          </div>
        </div>
      )}

      {isNavigatingOrArrived ? (
        /* FULL-SCREEN NAVIGATION VIEW */
        <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
          <div className={`px-6 py-6 ${isWeakSignal ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-800'} transition-colors duration-500 z-20 flex items-center justify-between shadow-sm border-b border-slate-200 relative`}>
            <div>
              <p className={`text-[8px] font-black uppercase tracking-[0.15em] ${isWeakSignal ? 'text-orange-100' : 'text-slate-400'} mb-1`}>Navigating To</p>
              <h3 className="text-xl font-black tracking-tight leading-none text-slate-900">Lily's Garden Home</h3>
            </div>
            <div className="text-right">
              <p className={`text-[8px] font-black uppercase tracking-[0.15em] ${isWeakSignal ? 'text-orange-100' : 'text-emerald-500'} mb-1`}>Arrival</p>
              <p className={`text-2xl font-black tracking-tighter ${isWeakSignal ? 'text-white' : 'text-slate-900'}`}>{Math.ceil(eta)} MIN</p>
            </div>
          </div>

          <div className="flex-1 relative bg-white overflow-hidden">
             <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
                  {Array.from({length: 144}).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-slate-900"></div>
                  ))}
                </div>
             </div>
             <div className="absolute top-[40%] left-[60%] flex flex-col items-center z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 bg-slate-900 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-white text-lg">🏠</div>
                <div className="mt-2 bg-slate-900 text-white text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-lg">DESTINATION</div>
             </div>
             <div 
               className="absolute transition-all duration-75 ease-linear z-20 -translate-x-1/2 -translate-y-1/2"
               style={{ top: `${workerPos.top}%`, left: `${workerPos.left}%` }}
             >
                <div className="w-14 h-14 bg-white rounded-2xl p-1 shadow-2xl border-2 border-emerald-400 flex items-center justify-center relative transform -rotate-12">
                   <span className="text-3xl">🛵</span>
                   <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-500 animate-pulse"></div>
                </div>
             </div>
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
               <line x1={`${workerPos.left}%`} y1={`${workerPos.top}%`} x2="60%" y2="40%" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
             </svg>
          </div>

          <div className="p-8 pb-32 bg-white flex flex-col items-center shadow-[0_-15px_40px_rgba(0,0,0,0.03)] z-30">
            {status === 'ARRIVED' && completionError && (
              <div className="mb-4 text-red-500 text-[10px] font-bold text-center animate-shake">{completionError}</div>
            )}
            <button 
              onClick={status === 'ARRIVED' ? handleFinishJob : () => setStatus('ARRIVED')}
              disabled={isConfirming}
              className={`w-full max-w-[260px] py-3.5 ${isConfirming ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 hover:bg-emerald-600 text-white'} transition-all duration-500 rounded-[2rem] font-black text-base shadow-xl active:scale-95 flex items-center justify-center gap-3`}
            >
              {isConfirming ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-xl">🏁</span>
                  <span className="tracking-tight">{status === 'ARRIVED' ? 'Finish Job' : 'I have Arrived'}</span>
                </>
              )}
            </button>
            <p className="mt-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Village Plot #14B, Kuala Terengganu</p>
          </div>
        </div>
      ) : status === 'ASSIGNED' ? (
        /* ASSIGNED PORTAL VIEW */
        <div className="animate-in slide-in-from-bottom duration-500 flex flex-col gap-6">
           <header className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <img src="https://picsum.photos/seed/worker-portal/100/100" className="w-14 h-14 rounded-2xl border-2 border-emerald-100 shadow-md object-cover" alt="Worker" />
              <div>
                <h1 className="text-base font-black text-gray-900 leading-none">Ahmad's Portal</h1>
                <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1.5">Active Service</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Status</p>
               <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Assigned</p>
            </div>
          </header>

          <div className="bg-white rounded-[2.5rem] p-7 shadow-xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full tracking-widest border border-emerald-100">House Cleaning</span>
                <h3 className="text-xl font-black text-gray-900 mt-2 tracking-tight">Lily's Garden Home</h3>
              </div>
              <div className="bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg">🧹</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot</p>
                <p className="text-sm font-black text-slate-900 tracking-tight">09:00 - 11:00 AM</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Earnings</p>
                <p className="text-sm font-black text-emerald-600 tracking-tight">$25.00</p>
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={() => setStatus('EN_ROUTE')} 
                className="w-full max-w-[240px] py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.75rem] font-black text-base shadow-xl shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span>Start Trip</span>
                <span className="text-xl">🛵</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* IDLE VIEW - Restored to Full Screen Design */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-center text-5xl mb-10 animate-bounce">
            🏝️
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Waiting for Task</h2>
          <p className="text-sm text-slate-400 font-medium max-w-[220px] leading-relaxed mb-12">
            You are currently online. New service requests will appear here automatically.
          </p>
          <button 
            onClick={() => setStatus('ASSIGNED')} 
            className="w-full max-w-[200px] py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-emerald-100"
          >
            Go Online
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboardView;
