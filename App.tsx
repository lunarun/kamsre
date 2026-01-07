
import React, { useState } from 'react';
import { TabType, Service, Booking, BookingStatus, ServiceStatus } from './types';
import { ICONS, MOCK_SERVICES } from './constants';
import HomeView from './components/views/HomeView';
import ServiceDetailsView from './components/views/ServiceDetailsView';
import BookingFormView from './components/views/BookingFormView';
import PaymentView from './components/views/PaymentView';
import OrderTrackingView from './components/views/OrderTrackingView';
import OrderDetailView from './components/views/OrderDetailView';
import WorkerDashboardView from './components/views/WorkerDashboardView';
import ProfileView from './components/views/ProfileView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.HOME);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Booking | null>(null);
  const [currentView, setCurrentView] = useState<'TAB_VIEW' | 'DETAILS' | 'BOOKING' | 'PAYMENT' | 'CONFIRMATION' | 'TRACKING' | 'ORDER_DETAIL'>('TAB_VIEW');
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'BK-8888',
      serviceId: 's1',
      userId: 'user-001',
      workerId: 'w1',
      status: BookingStatus.IN_PROGRESS,
      date: 'Today',
      time: '12:30 PM',
      fullName: 'John Doe',
      phone: '+60 11-2233 4455',
      address: 'Village Lot #42, Terengganu',
      totalPrice: 5.00,
    },
    {
      id: 'BK-2024',
      serviceId: 's2',
      userId: 'user-001',
      workerId: 'w2',
      status: BookingStatus.COMPLETED,
      date: 'Yesterday',
      time: '02:00 PM',
      fullName: 'John Doe',
      phone: '+60 11-2233 4455',
      address: 'Village Lot #42, Terengganu',
      totalPrice: 25.00,
    }
  ]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{ title: string; message: string; type: 'inactive' | 'error' | 'deleted' } | null>(null);

  const ReqTag = ({ id }: { id: string }) => null;

  const navigateTo = (view: typeof currentView) => {
    setCurrentView(view);
  };

  const handleServiceSelect = (service: Service) => {
    setIsCheckingStatus(true);
    setTimeout(() => {
      setIsCheckingStatus(false);
      switch (service.status) {
        case ServiceStatus.ACTIVE:
          setSelectedService(service);
          navigateTo('DETAILS');
          break;
        case ServiceStatus.INACTIVE:
          setErrorDialog({
            type: 'inactive',
            title: 'Service Inactive',
            message: 'This service is currently unavailable in your area. Please check back later.'
          });
          break;
        case ServiceStatus.DB_ERROR:
          setErrorDialog({
            type: 'error',
            title: 'System Error',
            message: 'We are experiencing database connectivity issues. Our team is investigating.'
          });
          break;
        case ServiceStatus.DELETED:
          setErrorDialog({
            type: 'deleted',
            title: 'Service Deleted',
            message: 'The requested service has been removed from the platform by the administrator.'
          });
          break;
      }
    }, 1200);
  };

  const handleBookingStart = () => {
    navigateTo('BOOKING');
  };

  const handleBookingSubmit = (data: Partial<Booking>) => {
    if (!selectedService) return;
    const newBooking: Booking = {
      id: `BK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      serviceId: selectedService.id,
      userId: 'user-001',
      status: BookingStatus.PENDING,
      date: data.date || '',
      time: data.time || '',
      fullName: data.fullName || '',
      phone: data.phone || '',
      address: data.address || '',
      totalPrice: selectedService.price,
    };
    setActiveBooking(newBooking);
    navigateTo('PAYMENT');
  };

  const handlePaymentConfirm = (success: boolean) => {
    if (!activeBooking) return;
    if (success) {
      const updatedBooking = { ...activeBooking, status: BookingStatus.ASSIGNED };
      setBookings(prev => [updatedBooking, ...prev]);
      setActiveBooking(updatedBooking);
      navigateTo('CONFIRMATION');
    } else {
      setActiveBooking(prev => prev ? { ...prev, status: BookingStatus.PAYMENT_FAILED } : null);
    }
  };

  const handleTrackBooking = (booking: Booking) => {
    setActiveBooking(booking);
    navigateTo('TRACKING');
  };

  const handleViewOrderDetail = (booking: Booking) => {
    setSelectedOrderDetail(booking);
    navigateTo('ORDER_DETAIL');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED } : b
    ));
    // If the cancelled order is currently being viewed, update the view state
    if (selectedOrderDetail?.id === bookingId) {
      setSelectedOrderDetail(prev => prev ? { ...prev, status: BookingStatus.CANCELLED } : null);
    }
  };

  const handleCompleteBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: BookingStatus.COMPLETED } : b
    ));
    navigateTo('TAB_VIEW');
    setActiveTab(TabType.ORDERS);
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white flex flex-col relative overflow-hidden shadow-2xl border-x">
      {isCheckingStatus && (
        <div className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
          <p className="text-gray-900 font-black tracking-tight uppercase text-sm">System check service status...</p>
        </div>
      )}

      {errorDialog && (
        <div className="absolute inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-8 w-full max-sm text-center shadow-2xl scale-in-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-inner ${
              errorDialog.type === 'inactive' ? 'bg-yellow-100 text-yellow-600' : 
              errorDialog.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {errorDialog.type === 'inactive' && '⚠️'}
              {errorDialog.type === 'error' && '🚫'}
              {errorDialog.type === 'deleted' && '🗑️'}
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{errorDialog.title}</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">{errorDialog.message}</p>
            <button 
              onClick={() => setErrorDialog(null)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all active:scale-95"
            >
              Back to Services
            </button>
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto ${currentView === 'TAB_VIEW' ? 'pb-20' : ''}`}>
        {currentView === 'TAB_VIEW' && (
          <>
            {activeTab === TabType.HOME && <HomeView onSelectService={handleServiceSelect} ReqTag={ReqTag} />}
            {activeTab === TabType.ORDERS && <ProfileView bookings={bookings} onTrack={handleTrackBooking} onCancel={handleCancelBooking} onViewDetail={handleViewOrderDetail} ReqTag={ReqTag} />}
            {activeTab === TabType.WORKER && <WorkerDashboardView bookings={bookings} ReqTag={ReqTag} />}
            {activeTab === TabType.PROFILE && (
              <div className="p-8 mt-20 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">👤</div>
                <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
                <p className="text-gray-500">Kuala Terengganu, Resident</p>
                <button className="mt-8 w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium">Edit Profile</button>
              </div>
            )}
          </>
        )}

        {currentView === 'DETAILS' && selectedService && (
          <ServiceDetailsView 
            service={selectedService} 
            onBack={() => navigateTo('TAB_VIEW')} 
            onBook={handleBookingStart}
            ReqTag={ReqTag}
          />
        )}

        {currentView === 'BOOKING' && selectedService && (
          <BookingFormView 
            service={selectedService}
            onBack={() => navigateTo('DETAILS')}
            onSubmit={handleBookingSubmit}
            ReqTag={ReqTag}
          />
        )}

        {currentView === 'PAYMENT' && activeBooking && (
          <PaymentView 
            booking={activeBooking}
            onBack={() => navigateTo('BOOKING')}
            onConfirm={handlePaymentConfirm}
            ReqTag={ReqTag}
          />
        )}

        {currentView === 'CONFIRMATION' && activeBooking && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white animate-in fade-in duration-500">
            <div className="mb-8"><ICONS.Success /></div>
            <p className="text-blue-600 font-bold text-sm tracking-wider uppercase mb-1">Order #{activeBooking.id}</p>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h2>
            <div className="bg-blue-50/50 p-6 rounded-3xl mb-10 w-full">
              <p className="text-gray-500 text-sm mb-2 uppercase font-bold tracking-widest">Expected Arrival</p>
              <p className="text-xl font-bold text-gray-900">{activeBooking.time}</p>
              <p className="text-gray-600 font-medium">{activeBooking.date}</p>
            </div>
            <button 
              onClick={() => { navigateTo('TAB_VIEW'); setActiveTab(TabType.ORDERS); }}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all active:scale-95 mb-4"
            >
              Track Order
            </button>
            <button 
              onClick={() => { navigateTo('TAB_VIEW'); setActiveTab(TabType.HOME); }}
              className="text-gray-400 hover:text-blue-600 text-sm font-bold transition-colors py-2 px-4 rounded-xl"
            >
              Back to Home
            </button>
          </div>
        )}

        {currentView === 'TRACKING' && activeBooking && (
          <OrderTrackingView 
            booking={activeBooking} 
            onBack={() => navigateTo('TAB_VIEW')} 
            onComplete={handleCompleteBooking}
            ReqTag={ReqTag}
          />
        )}

        {currentView === 'ORDER_DETAIL' && selectedOrderDetail && (
          <OrderDetailView 
            booking={selectedOrderDetail}
            onBack={() => navigateTo('TAB_VIEW')}
            onTrack={handleTrackBooking}
            onCancel={handleCancelBooking}
            ReqTag={ReqTag}
          />
        )}
      </div>

      {currentView === 'TAB_VIEW' && (
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-40">
          <button onClick={() => setActiveTab(TabType.HOME)} className={`flex flex-col items-center gap-1 ${activeTab === TabType.HOME ? 'text-blue-600' : 'text-gray-400'}`}>
            <ICONS.Home />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button onClick={() => setActiveTab(TabType.ORDERS)} className={`flex flex-col items-center gap-1 ${activeTab === TabType.ORDERS ? 'text-blue-600' : 'text-gray-400'}`}>
            <ICONS.Orders />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button onClick={() => setActiveTab(TabType.WORKER)} className={`flex flex-col items-center gap-1 ${activeTab === TabType.WORKER ? 'text-blue-600' : 'text-gray-400'}`}>
            <ICONS.Worker />
            <span className="text-xs font-medium">Worker</span>
          </button>
          <button onClick={() => setActiveTab(TabType.PROFILE)} className={`flex flex-col items-center gap-1 ${activeTab === TabType.PROFILE ? 'text-blue-600' : 'text-gray-400'}`}>
            <ICONS.Profile />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
