
import React, { useState, useEffect } from 'react';
import { Booking } from '../../types';
import { ICONS } from '../../constants';

interface PaymentViewProps {
  booking: Booking;
  onBack: () => void;
  onConfirm: (success: boolean) => void;
  ReqTag: React.FC<{ id: string }>;
}

type PaymentErrorType = 'TIMEOUT' | 'INVALID' | 'INSUFFICIENT' | null;

const PaymentView: React.FC<PaymentViewProps> = ({ booking, onBack, onConfirm, ReqTag }) => {
  const [method, setMethod] = useState<'card' | 'wallet' | 'cash'>('card');
  const [processingStep, setProcessingStep] = useState(0); // 1: Validating, 2: Connecting, 3: Determining
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorType, setErrorType] = useState<PaymentErrorType>(null);
  
  // Validation State
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Form States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Simulator State
  const [simulatedOutcome, setSimulatedOutcome] = useState<'SUCCESS' | 'TIMEOUT' | 'INVALID' | 'INSUFFICIENT'>('SUCCESS');

  const handlePay = () => {
    // Principal Flow: Step 1 Validation
    if (method === 'card' && (!cardNumber.trim() || !expiry.trim() || !cvv.trim())) {
      setShowValidationErrors(true);
      return;
    }
    
    setShowValidationErrors(false);
    setErrorType(null);
    setProcessingStep(1); 
    setIsProcessing(true); // Trigger the sequence
  };

  useEffect(() => {
    if (!isProcessing) return;

    const timers: number[] = [];

    // Stage 1: Already set to 1 at start (Step 3: Validating)
    
    // Stage 2: Move to Step 4/5 (66%) after 1.2s
    timers.push(window.setTimeout(() => {
      setProcessingStep(2);
    }, 1200));
    
    // Stage 3: Move to Step 6 (99%) after 2.4s
    timers.push(window.setTimeout(() => {
      setProcessingStep(3);
    }, 2400));

    // Final Stage: Resolve Outcome after 3.6s
    timers.push(window.setTimeout(() => {
      const outcome = simulatedOutcome;
      setIsProcessing(false);
      setProcessingStep(0);
      
      if (outcome === 'SUCCESS') {
        onConfirm(true); 
      } else {
        setErrorType(outcome as PaymentErrorType);
      }
    }, 3600));

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [isProcessing]);

  const getErrorMessage = () => {
    switch(errorType) {
      case 'TIMEOUT': return { title: "System Error", msg: "Gateway unreachable due to timeout. Please try again later.", req: "Alt-1.2" };
      case 'INVALID': return { title: "Invalid Payment", msg: "Invalid Payment Information provided.", req: "Alt-2.2" };
      case 'INSUFFICIENT': return { title: "Payment Failed", msg: "Insufficient Funds in your account.", req: "Alt-3.2" };
      default: return { title: "Error", msg: "Something went wrong.", req: "" };
    }
  };

  const isFieldInvalid = (value: string) => showValidationErrors && !value.trim();

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* Processing Overlay (Steps 3-6) */}
      {isProcessing && (
        <div className="absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="relative mb-12">
            <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin shadow-inner"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-600 font-black text-xs">
                {processingStep === 1 ? '33%' : processingStep === 2 ? '66%' : '99%'}
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Processing Payment...</h2>
          
          <div className="space-y-3">
            <p className={`text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${processingStep >= 1 ? 'text-blue-600' : 'text-gray-300'}`}>
              <span className={`w-2 h-2 rounded-full ${processingStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
              Step 3: Validating details...
            </p>
            <p className={`text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${processingStep >= 2 ? 'text-blue-600' : 'text-gray-300'}`}>
              <span className={`w-2 h-2 rounded-full ${processingStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
              Step 4/5: Connecting to Gateway...
            </p>
            <p className={`text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${processingStep >= 3 ? 'text-blue-600' : 'text-gray-300'}`}>
              <span className={`w-2 h-2 rounded-full ${processingStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
              Step 6: Determining success...
            </p>
          </div>
        </div>
      )}

      {/* Error Dialogs for Alt Flows (1.2, 2.2, 3.2) */}
      {errorType && (
        <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm text-center shadow-2xl scale-in-center border-4 border-red-50">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-red-600">
              {errorType === 'TIMEOUT' ? '⌛' : '🚫'}
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
              {getErrorMessage().title} <ReqTag id={getErrorMessage().req} />
            </h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">{getErrorMessage().msg}</p>
            <button 
              onClick={() => setErrorType(null)}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all active:scale-95"
            >
              Try Again <ReqTag id="Alt-1.3/2.3/3.3" />
            </button>
          </div>
        </div>
      )}

      <header className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-30">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Payment Process</h1>
      </header>

      <div className="p-6 flex-1 overflow-y-auto space-y-8">
        {/* Outcome Simulator */}
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-3xl">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Outcome Simulator (Demonstration Only)</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['SUCCESS', 'TIMEOUT', 'INVALID', 'INSUFFICIENT'] as const).map(o => (
              <button 
                key={o}
                type="button"
                onClick={() => setSimulatedOutcome(o)}
                className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all ${simulatedOutcome === o ? 'bg-purple-600 border-purple-600 text-white shadow-md scale-[1.02]' : 'bg-white border-purple-100 text-purple-400 hover:border-purple-300'}`}
              >
                {o === 'SUCCESS' ? 'Principal (Success)' : 
                 o === 'TIMEOUT' ? 'Alt 1 (Timeout)' : 
                 o === 'INVALID' ? 'Alt 2 (Invalid Info)' : 'Alt 3 (Insufficient Funds)'}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Summary</h2>
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">BK-{booking.id}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Service Fee</span>
              <span className="font-bold text-gray-900">${booking.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Platform Fee</span>
              <span className="font-bold text-gray-900">$1.50</span>
            </div>
            <div className="pt-3 border-t flex justify-between items-center">
              <span className="text-base font-black text-gray-900 tracking-tight">Total Amount</span>
              <span className="text-2xl font-black text-blue-600">${(booking.totalPrice + 1.5).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form (Step 1) */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method <ReqTag id="Principal-1" /></h2>
          
          <div className="flex gap-2 mb-6">
            {(['card', 'wallet', 'cash'] as const).map(m => (
              <button 
                key={m}
                type="button"
                onClick={() => { setMethod(m); setShowValidationErrors(false); }} 
                className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all capitalize ${method === m ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]' : 'bg-gray-50 border-transparent text-gray-400'}`}
              >
                {m}
              </button>
            ))}
          </div>

          {method === 'card' && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="Card Number" 
                  className={`w-full p-4 border rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isFieldInvalid(cardNumber) ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-100 focus:bg-white'}`}
                />
                <div className="absolute right-4 top-4 text-gray-300">💳</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  placeholder="MM/YY" 
                  className={`w-full p-4 border rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isFieldInvalid(expiry) ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-100 focus:bg-white'}`}
                />
                <input 
                  type="password" 
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                  placeholder="CVV" 
                  className={`w-full p-4 border rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isFieldInvalid(cvv) ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-100 focus:bg-white'}`}
                />
              </div>
            </div>
          )}

          {method === 'wallet' && (
            <div className="p-6 bg-blue-50 rounded-3xl text-center border border-blue-100 animate-in slide-in-from-top-2 duration-300">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">KampungPay Balance</p>
              <p className="text-3xl font-black text-blue-900">$128.40</p>
            </div>
          )}

          {method === 'cash' && (
            <div className="p-6 bg-green-50 rounded-3xl text-center border border-green-100 animate-in slide-in-from-top-2 duration-300">
              <p className="text-sm font-bold text-green-700">Payment will be collected by the worker in person upon arrival.</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white/90 backdrop-blur-sm border-t mt-auto">
        {/* Inline Validation Banner */}
        {showValidationErrors && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-xl text-center animate-in slide-in-from-bottom-2">
            ⚠️ Please fill in all card details
          </div>
        )}
        
        <button 
          onClick={handlePay}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          Confirm & Pay <ReqTag id="Principal-2" />
        </button>
      </div>
    </div>
  );
};

export default PaymentView;
