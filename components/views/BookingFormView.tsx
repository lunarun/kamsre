
import React, { useState, useEffect } from 'react';
import { Service } from '../../types';

interface BookingFormViewProps {
  service: Service;
  onBack: () => void;
  onSubmit: (data: any) => void;
  ReqTag: React.FC<{ id: string }>;
}

const BookingFormView: React.FC<BookingFormViewProps> = ({ service, onBack, onSubmit, ReqTag }) => {
  // Empty initial values as requested
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Static values as requested
  const FIXED_DATE = 'Today';
  const FIXED_TIME = '12:30 PM';
  
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [bookingFailed, setBookingFailed] = useState(false);
  const [shouldSimulateError, setShouldSimulateError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in all required delivery details.');
      return;
    }
    setError('');
    setIsVerifying(true);
    setVerificationStep(1); 
  };

  useEffect(() => {
    if (!isVerifying) return;
    const timers = [
      setTimeout(() => setVerificationStep(2), 1200),
      setTimeout(() => setVerificationStep(3), 2400),
      setTimeout(() => {
        if (shouldSimulateError) {
          setBookingFailed(true);
          setIsVerifying(false);
        } else {
          setIsVerifying(false);
          onSubmit({ 
            date: FIXED_DATE, 
            time: FIXED_TIME, 
            fullName, 
            phone, 
            address 
          });
        }
      }, 3600)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [isVerifying, shouldSimulateError, fullName, phone, address, onSubmit]);

  const InputWrapper = ({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2">{label}</label>
      <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[1.75rem] shadow-sm focus-within:border-blue-300 transition-colors">
        <div className="text-slate-400 shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col relative">
      {/* System Verification Overlay */}
      {isVerifying && (
        <div className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Processing Schedule...</h2>
          <p className="text-blue-600 font-bold mt-2">
            {verificationStep === 1 ? 'Securing your slot...' : 
             verificationStep === 2 ? 'Assigning professional...' : 'Finalizing details...'}
          </p>
        </div>
      )}

      {bookingFailed && (
        <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center text-red-600 text-2xl">🚫</div>
            <h2 className="text-xl font-bold mb-2">Schedule Failed</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">System encountered a synchronization error. Please try again.</p>
            <button onClick={() => setBookingFailed(false)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold active:scale-95 transition-all">Try Again</button>
          </div>
        </div>
      )}

      {/* Header with Back Button */}
      <header className="p-4 border-b border-slate-50 flex items-center gap-4 bg-white shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-black text-slate-900">Schedule Service</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Service Summary Card */}
        <div className="bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100 flex items-center gap-5">
          <div className="w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-sm">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">{service.title}</h3>
            <p className="text-xl font-black text-blue-600 mt-1">${service.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Section Title */}
        <h2 className="text-lg font-black text-slate-900">Delivery Details</h2>

        {/* BOOKING DETAILS FORM */}
        <div className="space-y-6">
          <InputWrapper label="Full Name" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>
            <input 
              type="text" 
              value={fullName} 
              onChange={e => { setFullName(e.target.value); if(error) setError(''); }}
              placeholder="e.g. John Doe"
              className="w-full bg-transparent font-bold text-slate-800 outline-none placeholder:text-slate-300 placeholder:font-medium"
            />
          </InputWrapper>

          <InputWrapper label="Phone Number" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}>
            <input 
              type="tel" 
              value={phone} 
              onChange={e => { setPhone(e.target.value); if(error) setError(''); }}
              placeholder="+60 12-345 6789"
              className="w-full bg-transparent font-bold text-slate-800 outline-none placeholder:text-slate-300 placeholder:font-medium"
            />
          </InputWrapper>

          <InputWrapper label="Delivery Address" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}>
            <input 
              type="text" 
              value={address} 
              onChange={e => { setAddress(e.target.value); if(error) setError(''); }}
              placeholder="Unit, Building, Street Name"
              className="w-full bg-transparent font-bold text-slate-800 outline-none placeholder:text-slate-300 placeholder:font-medium"
            />
          </InputWrapper>

          <div className="grid grid-cols-2 gap-4">
            <InputWrapper label="Date" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}>
              <span className="font-bold text-slate-800">{FIXED_DATE}</span>
            </InputWrapper>

            <InputWrapper label="Time" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}>
              <span className="font-bold text-slate-800">{FIXED_TIME}</span>
            </InputWrapper>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 animate-in slide-in-from-top-1 duration-300">
            <p className="text-red-500 text-[11px] font-black uppercase tracking-wider text-center">{error}</p>
          </div>
        )}

        {/* SIMULATOR (Subtle version) */}
        <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <span className="text-lg">🛠️</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Simulator: Fail Mode</span>
          </div>
          <button 
            type="button"
            onClick={() => setShouldSimulateError(!shouldSimulateError)}
            className={`w-10 h-6 rounded-full p-1 transition-all ${shouldSimulateError ? 'bg-orange-500' : 'bg-slate-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${shouldSimulateError ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-white border-t border-slate-50 shrink-0">
        <button 
          onClick={handleSubmit}
          className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-50 active:scale-[0.98] transition-all"
        >
          Confirm Details
        </button>
      </div>
    </div>
  );
};

export default BookingFormView;
