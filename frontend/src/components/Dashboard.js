import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Heart, LoaderCircle, UserRound } from 'lucide-react';
import axios from 'axios';
import { getUserData } from '../api/auth';
import niftyCompanies from '../nifty_symbols.json';

const Dashboard = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState({});
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');

  const trendingStocks = [
    { symbol: 'RELIANCE', name: 'Reliance', color: '#9333ea', logo: 'https://logo.clearbit.com/www.ril.com' },
    { symbol: 'BHARTIARTL', name: 'Airtel', color: '#3b82f6', logo: 'https://logo.clearbit.com/www.airtel.in' },
    { symbol: 'HDFCBANK', name: 'HDFC', color: '#10b981', logo: 'https://logo.clearbit.com/www.hdfcbank.com' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', color: '#f97316', logo: 'https://logo.clearbit.com/www.bajajfinserv.in' }
  ];

  const categories = [
    { name: '✨ Top Halal Stocks', path: 'halal', bgColor: 'bg-purple-100 text-purple-800' },
    { name: '💻 Technology', path: 'Technology', bgColor: 'bg-blue-100 text-blue-800' },
    { name: '📊 Retail', path: 'Retail', bgColor: 'bg-pink-100 text-pink-800' },
    { name: '🍽️ Food & Beverage', path: 'Foods', bgColor: 'bg-orange-100 text-orange-800' }
  ];

  useEffect(() => {
    setCompanies(niftyCompanies);
    fetchStockNews();
    if (email) {
      fetchUserData();
    }
  }, [email]);

  const fetchUserData = async () => {
    try {
      const userData = await getUserData(email);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchStockNews = async () => {
    setNewsLoading(true);
    try {
      const response = await axios.get(`https://newsdata.io/api/1/news`, {
        params: {
          apikey: 'pub_5726909ae8ab74afd8fcf47ed1aa5e8cec510',
          q: "NSE",
          country: 'in',
          language: 'en',
          category: 'Business',
          size: 3,
        },
      });
      setNewsArticles(response.data.results || []);
    } catch (error) {
      console.log("Error fetching news", error);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      navigate(`/stockresults/${searchSymbol.trim().toUpperCase()}`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchSymbol(value);
    setIsSearchActive(!!value);

    if (value) {
      const filteredCompanies = companies.filter(
        (company) =>
          company["NAME OF COMPANY"].toUpperCase().includes(value) || company.SYMBOL.includes(value)
      );
      setSuggestions(filteredCompanies);
    } else {
      setSuggestions([]);
      setIsSearchActive(false);
    }
  };

  return (
    <div className="  px-4 py-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/profile', { state: { user } })}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img src={user.profilePicture? user.profilePicture : UserRound} alt="profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium">{user.name}</span>
        </div>
        <div className="flex gap-4">
          <Heart 
            className="w-6 h-6 text-gray-600 cursor-pointer" 
            onClick={() => navigate('/watchlist')}
          />
          <Bell 
            className="w-6 h-6 text-gray-600 cursor-pointer" 
            onClick={() => navigate('/notificationpage')}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks, crypto & more..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          ref={searchInputRef}
          onChange={handleInputChange}
          value={searchSymbol}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        {isSearchActive && suggestions.length > 0 && (
          <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.SYMBOL}
                onClick={() => {
                  setSearchSymbol(suggestion.SYMBOL);
                  setIsSearchActive(false);
                  navigate(`/stockresults/${suggestion.SYMBOL}`);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <img 
                  src={suggestion.Company_Logo} 
                  alt="logo"
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/24" }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{suggestion["NAME OF COMPANY"]}</span>
                  <span className="text-xs text-gray-500">{suggestion.SYMBOL}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => navigate(`/categoryresultspage/${category.path}`)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${category.bgColor}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Stocks */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Trending Stocks</h2>
            <button 
              onClick={() => navigate('/trendingstocks')}
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trendingStocks.map((stock, index) => (
              <div
                key={index}
                onClick={() => navigate(`/stockresults/${stock.symbol}`)}
                className="relative p-4 rounded-xl cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: stock.color }}
              >
                <Heart className="absolute right-3 top-3 w-5 h-5 text-white/80" />
                <img 
                  src={stock.logo} 
                  alt="logo"
                  className="w-10 h-10 rounded-lg mb-2 bg-white/20 p-1"
                />
                <h3 className="text-white font-medium">{stock.name}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-white/90 text-sm">+12.5%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market News */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Market News</h2>
            {newsArticles.length > 0 && (
              <button
                onClick={() => navigate('/news')}
                className="text-indigo-600 hover:underline text-sm font-medium"
              >
                More News
              </button>
            )}
          </div>
          <div className="space-y-4">
            {newsLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoaderCircle className="w-8 h-8 text-gray-600 animate-spin" />
              </div>
            ) : newsArticles.length > 0 ? (
              newsArticles.map((news, index) => (
                <div 
                  key={index} 
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(news.link, '_blank')}
                >
                  <h3 className="font-medium mb-2 text-sm">{news.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{news.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-xs">{news.pubDate}</span>
                    <span className="text-indigo-600 text-sm hover:underline">Read more</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No news available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;