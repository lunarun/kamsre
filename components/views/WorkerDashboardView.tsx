
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
  const [eta, setEta] = useState(3); // Estimated mins

  // Completion Confirmation States
  const [isConfirming, setIsConfirming] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  // Simulation State for manual testing
  const [forceUnavailable, setForceUnavailable] = useState(false);
  const [simCompletionFail, setSimCompletionFail] = useState(false);

  // Alternative Flow Logic: Trigger "Job Unavailable"
  useEffect(() => {
    if (status === 'IDLE' || status === 'COMPLETED') return;
    const activeJob = bookings.find(b => b.id === lastAssignedId);
    const isActuallyCancelled = !activeJob || activeJob.status === BookingStatus.CANCELLED;
    if (isActuallyCancelled || forceUnavailable) {
      setIsJobUnavailable(true);
    }
  }, [bookings, status, lastAssignedId, forceUnavailable]);

  // Worker Navigation Logic
  useEffect(() => {
    if (status !== 'EN_ROUTE') return;
    const interval = setInterval(() => {
      setWorkerPos(prev => {
        const dTop = (40 - prev.top) * 0.1;
        const dLeft = (60 - prev.left) * 0.1;
        const nextTop = prev.top + dTop;
        const nextLeft = prev.left + dLeft;

        if (Math.abs(nextTop - 40) < 1 && Math.abs(nextLeft - 60) < 1) {
          setEta(0);
          return { top: 40, left: 60 };
        }
        setEta(prevEta => Math.max(1, prevEta - 0.05));
        return { top: nextTop, left: nextLeft };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

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
      setCompletionError("Unable to confirm completion. Please check your connection and try again.");
      setIsConfirming(false);
    } else {
      setIsConfirming(false);
      setStatus('COMPLETED');
    }
  };

  const isNavigating = status === 'EN_ROUTE';

  return (
    <div className={`flex flex-col h-full bg-slate-50 relative ${isNavigating ? 'overflow-hidden' : 'p-4 overflow-y-auto pb-28'}`}>
      
      {/* ALTERNATIVE FLOW OVERLAY: Job Unavailable */}
      {isJobUnavailable && (
        <div className="fixed inset-0 z-[1000] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-300">
           <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mb-8 relative border-2 border-amber-100 shadow-xl shadow-amber-500/10">
              <span className="text-4xl">⚠️</span>
           </div>
           <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Job Unavailable</h2>
           <p className="text-sm text-slate-500 mb-8 px-6">This task has been withdrawn or cancelled by the resident.</p>
           <button onClick={handleReturnToDashboard} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest">Return to Dashboard</button>
        </div>
      )}

      {/* DEBUG SIMULATOR PANEL - Fully Restored */}
      {!isNavigating && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-[2rem] shadow-sm shrink-0">
           <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Simulator: Worker Flow</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setForceUnavailable(true)} 
              className="py-3 px-2 bg-white border border-purple-200 text-purple-600 text-[9px] font-black uppercase rounded-xl shadow-sm active:scale-95 transition-all"
            >
              Sim: Job Cancelled ⚠️
            </button>
            <button 
              onClick={() => setSimCompletionFail(!simCompletionFail)} 
              className={`py-3 px-2 border text-[9px] font-black uppercase rounded-xl transition-all shadow-sm active:scale-95 ${simCompletionFail ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-200'}`}
            >
              Sim: Fail {simCompletionFail ? 'ON' : 'OFF'}
            </button>
            <button 
              onClick={() => { 
                setStatus('IDLE'); 
                setWorkerPos({ top: 60, left: 20 }); 
                setEta(3); 
                setCompletionError(null); 
                setForceUnavailable(false);
                setIsJobUnavailable(false);
              }} 
              className="col-span-2 py-3 px-2 bg-white border border-purple-200 text-purple-600 text-[9px] font-black uppercase rounded-xl shadow-sm active:scale-95 transition-all"
            >
              Reset Flow 🏝️
            </button>
          </div>
        </div>
      )}

      {status === 'EN_ROUTE' ? (
        /* FULL-SCREEN NAVIGATION VIEW */
        <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
          <div className="px-6 py-8 bg-[#0f172a] text-white z-20 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Navigating To</p>
              <h3 className="text-2xl font-black tracking-tight leading-none">Lily's Garden Home</h3>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Arrival</p>
              <p className="text-3xl font-black tracking-tighter">{Math.ceil(eta)} MIN</p>
            </div>
          </div>

          <div className="flex-1 relative bg-white overflow-hidden">
             <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
                  {Array.from({length: 144}).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-slate-900"></div>
                  ))}
                </div>
             </div>
             <div className="absolute top-[40%] left-[60%] flex flex-col items-center z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-[#0f172a] rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-white text-xl">🏠</div>
                <div className="mt-2 bg-[#0f172a] text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">DESTINATION</div>
             </div>
             <div 
               className="absolute transition-all duration-1000 ease-linear z-20 -translate-x-1/2 -translate-y-1/2"
               style={{ top: `${workerPos.top}%`, left: `${workerPos.left}%` }}
             >
                <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-2xl border-2 border-blue-500 flex items-center justify-center relative transform -rotate-12">
                   <span className="text-4xl">🛵</span>
                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white animate-pulse"></div>
                </div>
             </div>
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
               <line x1={`${workerPos.left}%`} y1={`${workerPos.top}%`} x2="60%" y2="40%" stroke="#0f172a" strokeWidth="2" strokeDasharray="6 6" />
             </svg>
          </div>

          <div className="p-8 pb-32 bg-white flex flex-col items-center shadow-[0_-15px_40px_rgba(0,0,0,0.04)] z-30">
            <button 
              onClick={() => setStatus('ARRIVED')}
              className="w-full max-w-sm py-5 bg-[#0f172a] text-white rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 group"
            >
              <span className="text-2xl">🏁</span>
              <span className="tracking-tight">I have Arrived</span>
            </button>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center max-w-[280px]">
              Village Plot #14B, Kuala Terengganu
            </p>
          </div>
        </div>
      ) : status !== 'IDLE' && status !== 'COMPLETED' ? (
        /* NORMAL STATE: ASSIGNED / ARRIVED */
        <div className="animate-in slide-in-from-bottom duration-500 flex flex-col gap-6">
           <header className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 shrink-0">
            <div className="flex items-center gap-4">
              <img src="https://picsum.photos/seed/worker-portal/100/100" className="w-14 h-14 rounded-2xl border-2 border-blue-100 shadow-md object-cover" alt="Worker" />
              <div>
                <h1 className="text-base font-black text-gray-900 leading-none">Ahmad's Portal</h1>
                <p className="text-[9px] text-green-500 font-black uppercase tracking-widest mt-1.5">Active Service</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Status</p>
               <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{status}</p>
            </div>
          </header>

          <div className="bg-white rounded-[2.5rem] p-7 shadow-xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-full tracking-widest border border-blue-100">House Cleaning</span>
                <h3 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">Lily's Garden Home</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-bold">Village Plot #14B, Kuala Terengganu</p>
              </div>
              <div className="bg-[#0f172a] text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg">🧹</div>
            </div>

            {/* RESTORED DATA GRID: TIME & EARNINGS */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot</p>
                <p className="text-sm font-black text-slate-900 tracking-tight">09:00 - 11:00 AM</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Earnings</p>
                <p className="text-sm font-black text-blue-600 tracking-tight">$25.00</p>
              </div>
            </div>

            <div className="space-y-4">
              {status === 'ASSIGNED' && (
                <button 
                  onClick={() => setStatus('EN_ROUTE')} 
                  className="w-full py-5 bg-blue-600 text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <span>Start Trip</span>
                  <span className="text-xl">🛵</span>
                </button>
              )}
              {status === 'ARRIVED' && (
                <div className="space-y-4">
                  {completionError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-shake">
                      <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">!</div>
                      <p className="text-[11px] text-red-600 font-bold leading-relaxed">{completionError}</p>
                    </div>
                  )}
                  <button 
                    onClick={handleFinishJob} 
                    disabled={isConfirming} 
                    className={`w-full py-5 rounded-[1.75rem] font-black text-lg shadow-xl transition-all ${
                      isConfirming ? 'bg-slate-100 text-slate-400' : 
                      completionError ? 'bg-red-600 text-white active:scale-95' : 'bg-green-600 text-white shadow-green-100 active:scale-95'
                    }`}
                  >
                    {isConfirming ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-3 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                        <span>Confirming...</span>
                      </div>
                    ) : completionError ? 'Retry Confirmation' : 'Finish Job'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* IDLE VIEW */
        <div className="text-center py-20 px-10 bg-white rounded-[2.5rem] shadow-inner border-2 border-dashed border-slate-100 flex flex-col items-center flex-1">
          <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-4xl animate-bounce">🏝️</div>
          <p className="text-slate-900 font-black text-xl tracking-tight">Idle - Waiting for Task</p>
          <p className="text-slate-400 text-xs mt-3 font-bold max-w-[200px] leading-relaxed">Your status is currently set to online. New bookings will appear here.</p>
          <button onClick={() => setStatus('ASSIGNED')} className="mt-10 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-blue-100">Manual Check-in</button>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboardView;
