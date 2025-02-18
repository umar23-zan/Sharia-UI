// CategoryResultsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import '../styles/categoryresultspage.css'; // Import CSS
import FileSaver from 'file-saver';
import { LoaderCircle } from 'lucide-react';

const StatusBadgeCategoryPage = ({ status }) => {
    let badgeClassName = "compliance-badge-category-page";
    if (status === 'Halal') {
        badgeClassName += ' halal';
    } else if (status === 'Doubtful') {
        badgeClassName += ' doubtful';
    } else if (status === 'Haram') {
        badgeClassName += ' haram';
    }
    return (
        <div className={badgeClassName}>
            {status}
        </div>
    );
};

const StockResultCard = ({ stock }) => {
    const navigate = useNavigate()
    return (
        <div className="stock-result-card">
            <div className="stock-header">
                <div className="stock-info">
                    <h3 className="stock-symbol" onClick={() =>{navigate(`/stockresults/${stock.SYMBOL}`)}}>{stock.SYMBOL}</h3> 
                    <p className="company-name" >{stock.Company_Name}</p> 
                </div>
                <StatusBadgeCategoryPage status={stock.Initial_Classification} /> {/* Use Initial_Classification for status */}
            </div>
            <div className="ratio-highlights">
                <div className="ratio-highlight-item">
                    <span className="ratio-label-category-page">Debt Ratio</span>
                    <span className="ratio-value-category-page">{stock.Debt_to_Assets.toFixed(2)}</span> {/* Use Debt_Ratio from backend data */}
                </div>
                <div className="ratio-highlight-item">
                    <span className="ratio-label-category-page">Cash Ratio</span>
                    <span className="ratio-value-category-page">{stock.Cash_and_Interest_Securities_to_Assets.toFixed(2)
                    }</span> {/* Use Cash_Ratio from backend data */}
                </div>
                <div className="ratio-highlight-item">
                    <span className="ratio-label-category-page">Interest Ratio</span>
                    <span className="ratio-value-category-page">{stock.Interest_Income_to_Revenue.toFixed(2)
                    }</span> {/* Use Interest_Ratio from backend data */}
                </div>
                <div className="ratio-highlight-item">
                    <span className="ratio-label-category-page">Receivables Ratio</span>
                    <span className="ratio-value-category-page">{stock.
                      Receivables_to_Assets.toFixed(2)}</span> {/* Use Receivables_Ratio from backend data */}
                </div>
            </div>
        </div>
    );
};


const CategoryResultsPage = () => {
    const { categoryName } = useParams(); // Get category name from URL
    const [stockResults, setStockResults] = useState([]); // State to store fetched stock results
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMore, setShowMore] = useState(false); // State to control showing more stocks
    const initialStockCount = 10;
    
    

    useEffect(() => {
        const fetchCategoryStocks = async () => {
            setLoading(true);
            setError(null);
            let apiUrl = '';

            if (categoryName.toLowerCase() === 'halal') {
                apiUrl = '/api/stocks/filter/halal-high-confidence'; // Route for Top Halal Stocks
            } else if (categoryName.toLowerCase() === 'technology') {
                apiUrl = `/api/stocks/filter/sector?sector=Technology`; // Route for Technology sector
            } else if (categoryName.toLowerCase() === 'retail') {
                apiUrl = `/api/stocks/filter/industries?industries=Specialty Retail, Internet Retail, Apparel Retail`; // Route for Retail sector
            } else if (categoryName.toLowerCase() === 'healthcare') {
                apiUrl = `/api/stocks/filter/sector?sector=Healthcare`; // Route for Healthcare sector
            } else if (categoryName.toLowerCase() === 'foods') {
                apiUrl = `/api/stocks/filter/industries?industries=Packaged Foods, Food Distribution, Beverages - Wineries & Distilleries, Beverages - Non-Alcoholic,Beverages - Brewers`; // Route for Food & Beverage sector
            } else {
                setError("Category not recognized."); // Handle unknown category
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(apiUrl);
                console.log(response.data)
                setStockResults(response.data);

            } catch (err) {
                console.error("Error fetching category stocks:", err);
                setError("Could not load stocks for this category.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryStocks();
    }, [categoryName]); // Re-fetch data when categoryName changes

    const categoryDisplayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    const stocksToDisplay = showMore ? stockResults : stockResults.slice(0, initialStockCount); // Determine which stocks to display

    const handleShowMoreClick = () => {
        setShowMore(!showMore); // Toggle showMore state
    };

    if (loading) {
        return (
            <div className="category-results-page fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white/80 z-1000">
                <LoaderCircle className="loader-icon w-16 h-16 animate-spin" /> {/* Tailwind classes */}
                <p className="mt-4">Loading {categoryDisplayName} stocks...</p>
            </div>
        );
    }

    if (error) {
        return <div className="category-results-page error">Error: {error}</div>;
    }

    return (
        <div className="category-results-page">
            <div className="category-results-container">
                <h2 className="category-title">{categoryDisplayName} Stocks</h2>
                <div className="stock-results-grid">
                    {stocksToDisplay.map((stock, index) => (
                        <StockResultCard key={index} stock={stock} />
                    ))}
                </div>
                {stockResults.length > initialStockCount && ( // Conditionally render "Show More" button
                    <div className="show-more-container">
                        <button className="show-more-button" onClick={handleShowMoreClick}>
                            {showMore ? "Show Less" : "Show More"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryResultsPage;