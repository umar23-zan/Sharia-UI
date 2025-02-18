import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoaderCircle, ArrowLeft } from 'lucide-react'; 

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockNews();
  }, []);

  const fetchStockNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://newsdata.io/api/1/news`, {
        params: {
          apikey: 'pub_5726909ae8ab74afd8fcf47ed1aa5e8cec510', // your api key
          q: "NSE",
          country: 'in',
          language: 'en',
          category: 'Business',
          size: 10, // Fetch 10 news articles
        },
      });
      setNewsArticles(response.data.results || []);
    } catch (error) {
      console.log("Error fetching news", error);
    }finally {
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 bg-gray-50 min-h-screen">
       <button className="text-black text-xl mb-4" onClick={() => navigate(-1)}>
         <ArrowLeft />
       </button>
      <h2 className="text-2xl font-semibold mb-6">Market News</h2> 
      <div className="space-y-4">
      {loading ? ( // Show LoaderCircle if loading is true
          <div className="flex justify-center items-center"> {/* Center the loader */}
            <LoaderCircle className="w-8 h-8 text-gray-600 animate-spin" />
          </div>
        ) : newsArticles.length > 0 ? ( // Show news if available and not loading
          newsArticles.map((news, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-medium mb-2 text-sm">{news.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{news.description}</p>
              {news.link && (
                <a
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 text-sm mt-2 inline-block hover:underline"
                >
                  Read more
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No news available</p>
        )}
      </div>
    </div>
  );
};

export default News;