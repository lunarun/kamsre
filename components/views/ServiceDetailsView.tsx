/*
 * @Description: 
 * @Author: Luna Run
 * @Date: 2026-01-07 06:55:44
 * @LastEditTime: 2026-01-07 16:02:46
 * @LastEditors: Luna Run
 */

import React from 'react';
import { Service } from '../../types';
import { ICONS } from '../../constants';

interface ServiceDetailsViewProps {
  service: Service;
  onBack: () => void;
  onBook: () => void;
  ReqTag: React.FC<{ id: string }>;
}

const ServiceDetailsView: React.FC<ServiceDetailsViewProps> = ({ service, onBack, onBook, ReqTag }) => {
  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="relative h-64">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      <div className="flex-1 p-6 -mt-8 bg-white rounded-t-[3rem] shadow-2xl z-10 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full tracking-widest border border-blue-100">
              {service.type}
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-2">{service.title} <ReqTag id="FR-4.2.2" /></h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase font-bold tracking-wider">Starts at</p>
            <p className="text-2xl font-black text-blue-600">${service.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Description <ReqTag id="FR-7.2.28" /></h2>
          <p className="text-gray-600 leading-relaxed">
            {service.description} Our local experts bring years of experience to ensure high quality and reliability. Every booking supports your local community members.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">What's Included</h2>
          <ul className="space-y-3">
            {['Vetted Professionals', 'Secure Payment', 'Real-time Tracking', '24/7 Community Support'].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-600 text-sm">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={onBook}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          Book Now <ReqTag id="FR-4.2.2.5" />
        </button>
      </div>
    </div>
  );
};

export default ServiceDetailsView;
