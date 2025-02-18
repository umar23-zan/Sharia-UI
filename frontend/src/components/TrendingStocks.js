import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react'; 


const TrendingStocks = () => {
  const navigate = useNavigate();
  const [trendingStocks, setTrendingStocks] = useState([ // You can fetch this data
    { symbol: 'RELIANCE', name: 'Reliance', color: '#9333ea', logo: 'https://logo.clearbit.com/www.ril.com' },
    { symbol: 'BHARTIARTL', name: 'Airtel', color: '#3b82f6', logo: 'https://logo.clearbit.com/www.airtel.in' },
    { symbol: 'HDFCBANK', name: 'HDFC', color: '#10b981', logo: 'https://logo.clearbit.com/www.hdfcbank.com' },
    { symbol: 'SBIN', name: 'SBI', color: '#f97316', logo: 'https://logo.clearbit.com/www.sbi.co.in' },
    { symbol: 'SBILIFE', name: 'SBI Life Insurance', color: '#9333ea', logo: 'https://logo.clearbit.com/www.sbilife.co.in' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', color: '#3b82f6', logo: 'https://logo.clearbit.com/www.bajajfinserv.in' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', color: '#10b981', logo: 'https://logo.clearbit.com/www.ultratechcement.com' },
    { symbol: 'TATASTEEL', name: 'Tata Steel', color: '#f97316', logo: 'https://logo.clearbit.com/www.tatasteel.com' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises', color: '#9333ea', logo: 'https://logo.clearbit.com/www.adanienterprises.com' },
    { symbol: 'LTF', name: 'L&T Finance', color: '#3b82f6', logo: 'https://logo.clearbit.com/www.ltfs.com' },
    { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', color: '#10b981', logo: 'https://logo.clearbit.com/www.heromotocorp.com' },
    { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', color: '#9333ea', logo: 'https://logo.clearbit.com/www.apollohospitals.com' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', color: '#3b82f6', logo: 'https://logo.clearbit.com/www.tatamotors.com' },
    // ... more trending stocks
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 bg-gray-50 min-h-screen">
      <button className="text-black text-xl mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft /> 
      </button>

      <h2 className="text-2xl font-semibold mb-6">Trending Stocks</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trendingStocks.map((stock, index) => (
          <div
            key={index}
            onClick={() => navigate(`/stockresults/${stock.symbol}`)}
            className="relative p-4 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition duration-300" 
            style={{ backgroundColor: stock.color }}
          >
            <Heart className="absolute right-3 top-3 w-5 h-5 text-white/80 hover:text-white transition duration-300" /> {/* Heart icon with hover effect */}
            <img
              src={stock.logo}
              alt="logo"
              className="w-16 h-16 rounded-lg mb-4 bg-white/20 p-2 mx-auto" // Centered image
              onError={(e) => { e.target.src = "https://via.placeholder.com/64" }} // Placeholder on error
            />
            <h3 className="text-white font-medium text-center">{stock.name}</h3> {/* Centered text */}
            <p className="text-white/80 text-sm text-center">{stock.symbol}</p> {/* Symbol below name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingStocks;