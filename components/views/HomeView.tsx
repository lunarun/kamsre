
import React, { useState, useMemo } from 'react';
import { MOCK_SERVICES, ICONS } from '../../constants';
import { Service, ServiceStatus } from '../../types';

interface HomeViewProps {
  onSelectService: (service: Service) => void;
  ReqTag: React.FC<{ id: string }>;
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectService, ReqTag }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_SERVICES;
    const term = searchTerm.toLowerCase();
    return MOCK_SERVICES.filter(service => 
      service.title.toLowerCase().includes(term) || 
      service.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">KampungKu <ReqTag id="FR-1" /></h1>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <ICONS.Search />
        </div>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for services..." 
          className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-2xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          </button>
        )}
      </div>

      {/* Service List */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              onClick={() => onSelectService(service)}
              className="bg-white p-4 rounded-3xl shadow-md border border-gray-100 flex flex-col items-start gap-3 cursor-pointer active:scale-95 transition-all group relative overflow-hidden"
            >
              <div className="relative w-full">
                <img src={service.image} alt={service.title} className="w-full h-24 object-cover rounded-2xl group-hover:brightness-90 transition-all" />
                {/* Flow-specific Status Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                   {service.status === ServiceStatus.ACTIVE ? (
                     <span className="px-2 py-0.5 bg-green-500 text-white text-[8px] font-black uppercase rounded-full shadow-sm">Available</span>
                   ) : service.status === ServiceStatus.INACTIVE ? (
                     <span className="px-2 py-0.5 bg-yellow-500 text-white text-[8px] font-black uppercase rounded-full shadow-sm tracking-tighter">Limited</span>
                   ) : (
                     <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase rounded-full shadow-sm">Unavailable</span>
                   )}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed h-8">{service.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-blue-600 font-black text-sm">${service.price.toFixed(2)}</span>
                  <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State View */
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/50 rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No matching services</h3>
          <p className="text-sm text-gray-500 max-w-[220px]">
            We couldn't find any service available for "<span className="font-bold text-blue-600">{searchTerm}</span>". 
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-6 text-blue-600 font-bold text-sm hover:underline"
          >
            Show all services
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeView;
