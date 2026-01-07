
import React, { useState, useMemo, useEffect } from 'react';
import { Service } from '../../types';

interface BookingFormViewProps {
  service: Service;
  onBack: () => void;
  onSubmit: (data: any) => void;
  ReqTag: React.FC<{ id: string }>;
}

const BookingFormView: React.FC<BookingFormViewProps> = ({ service, onBack, onSubmit, ReqTag }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [time, setTime] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // States for Principal Flow Steps 3-6
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [bookingFailed, setBookingFailed] = useState(false);
  
  // NEW: Simulator Toggle for Alt Flow 1
  const [shouldSimulateError, setShouldSimulateError] = useState(false);

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dayName = days[d.getDay()];
      const monthName = months[d.getMonth()];
      const dateNum = d.getDate();
      const fullDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dates.push({ label: `${dayName}, ${monthName} ${dateNum}`, value: fullDate, isToday: i === 0 });
    }
    return dates;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !time || !fullName || !phone || !address) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    
    // Principal Flow Step 3: Start System Check
    setIsVerifying(true);
    setVerificationStep(1); 
  };

  useEffect(() => {
    if (!isVerifying) return;

    // Simulate Step-by-Step Verification Logic (Steps 3-6)
    const timer1 = setTimeout(() => setVerificationStep(2), 1500);
    const timer2 = setTimeout(() => setVerificationStep(3), 3000);

    const timer3 = setTimeout(() => {
      // Use the simulator toggle to decide outcome
      if (shouldSimulateError) {
        // Alt Flow 1 Logic
        setBookingFailed(true);
        setIsVerifying(false);
      } else {
        // Principal Flow Step 7 Success
        setIsVerifying(false);
        onSubmit({ date: selectedDate, time, fullName, phone, address, note });
      }
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVerifying, shouldSimulateError]);

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* System Verification Overlay (Steps 3-6) */}
      {isVerifying && (
        <div className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600 text-sm">
              {Math.min(100, verificationStep * 33)}%
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">System Checking...</h2>
            <div className="h-6 overflow-hidden text-blue-600 font-bold text-sm">
              {verificationStep === 1 && <p className="animate-in slide-in-from-bottom-2">Checking worker availability...</p>}
              {verificationStep === 2 && <p className="animate-in slide-in-from-bottom-2">Verifying time slot...</p>}
              {verificationStep === 3 && <p className="animate-in slide-in-from-bottom-2">Saving booking to database...</p>}
            </div>
          </div>
        </div>
      )}

      {/* Alternative 1: Booking Failed Error Dialog */}
      {bookingFailed && (
        <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm text-center shadow-2xl scale-in-center border-4 border-red-50">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-red-600 shadow-inner">
              🚫
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">Booking Failed <ReqTag id="Alt-1.2" /></h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">System encountered error. Please Try Again.</p>
            <button 
              onClick={() => setBookingFailed(false)}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-xl hover:bg-red-700 transition-all active:scale-95"
            >
              Try Again <ReqTag id="Alt-1.3" />
            </button>
          </div>
        </div>
      )}

      <header className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-30">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Schedule Service</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-6 flex-1 space-y-6 overflow-y-auto pb-10">
        {/* Simulator Panel for the user to trigger Alt Flow 1 */}
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-3xl flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛠️</span>
            <div>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Simulator</p>
              <p className="text-xs font-bold text-gray-800">Trigger Alt Flow 1</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setShouldSimulateError(!shouldSimulateError)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${shouldSimulateError ? 'bg-orange-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${shouldSimulateError ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* Form Inputs (Simplified display for code brevity) */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 text-center">Step 1: Select Date & Time <ReqTag id="Principal-1" /></label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {availableDates.map((date) => (
                <button
                  type="button"
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  className={`flex-shrink-0 min-w-[80px] p-3 rounded-2xl border transition-all ${selectedDate === date.value ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}
                >
                  <span className="text-[9px] block uppercase font-black">{date.label.split(',')[0]}</span>
                  <span className="text-sm font-bold">{date.label.split(',')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTime(t)}
                className={`py-3 rounded-2xl text-xs font-bold border ${time === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-400'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-1">Contact Information</h3>
            <input 
              type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input 
              type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea 
              value={address} onChange={e => setAddress(e.target.value)} placeholder="Village Address"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
            />
          </div>
        </div>

        <div className="pt-4 sticky bottom-0 bg-white/90 backdrop-blur-sm pb-4">
          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
          >
            Confirm Schedule <ReqTag id="Principal-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingFormView;
