const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://umar:umar444@authentication-app.ted5m.mongodb.net/";
const DATABASE_NAME = "authdb";
const COLLECTION_NAME = "StockData";

// GET all stocks
router.get('/api/stocks', async (req, res) => {
  let client;
  try {
      client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DATABASE_NAME);
      const stocks = await db.collection(COLLECTION_NAME).find({}).toArray();
      res.json(stocks);
  } catch (error) {
      console.error('Error fetching stocks:', error);
      res.status(500).json({ message: 'Error fetching stocks data' });
  } finally {
      if (client) client.close();
  }
});

// GET stock by symbol
router.get('/api/stocks/:symbol', async (req, res) => {
  let client;
  try {
      client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DATABASE_NAME);
      const stock = await db.collection(COLLECTION_NAME)
          .findOne({ SYMBOL: req.params.symbol.toUpperCase() });
      
      if (!stock) {
          return res.status(404).json({ message: 'Stock not found' });
      }
      res.json(stock);
  } catch (error) {
      console.error('Error fetching stock:', error);
      res.status(500).json({ message: 'Error fetching stock data' });
  } finally {
      if (client) client.close();
  }
});



router.get('/api/stocks/filter/halal-high-confidence', async (req, res) => {
  let client;
  
  try {
      client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DATABASE_NAME);
      const stocks = await db.collection(COLLECTION_NAME)
          .find({ Initial_Classification: "Halal", Shariah_Confidence_Percentage: 100})
          .toArray();
      res.json(stocks);
  } catch (error) {
      console.error('Error fetching high-confidence Halal stocks:', error);
      res.status(500).json({ message: 'Error fetching high-confidence Halal stocks' });
  } finally {
      if (client) client.close();
  }
});

router.get('/api/stocks/filter/sector', async (req, res) => {
  const { sector } = req.query; // Sector name
  let client;

  try {
      client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DATABASE_NAME);
      const stocks = await db.collection(COLLECTION_NAME)
          .find({ Sector: sector })
          .toArray();
      res.json(stocks);
  } catch (error) {
      console.error('Error fetching stocks by sector:', error);
      res.status(500).json({ message: 'Error fetching stocks by sector' });
  } finally {
      if (client) client.close();
  }
});

// GET stocks by Industry
router.get('/api/stocks/filter/industries', async (req, res) => {
    const { industries } = req.query; // Comma-separated industries
    let client;
  
    try {
        client = await MongoClient.connect(MONGO_URI);
        const db = client.db(DATABASE_NAME);
        
        const industryArray = industries ? industries.split(',') : [];
        const filter = industryArray.length > 0 ? { Industry: { $in: industryArray } } : {};
  
        const stocks = await db.collection(COLLECTION_NAME).find(filter).toArray();
        
        if (!stocks.length) {
            return res.status(404).json({ message: "No stocks found for the provided industries." });
        }
  
        res.json(stocks);
    } catch (error) {
        console.error('Error fetching stocks by multiple industries:', error);
        res.status(500).json({ message: 'Error fetching stocks by multiple industries' });
    } finally {
        if (client) client.close();
    }
  });

  router.get('/api/stocks/filter/industries-sectors', async (req, res) => {
    const { industries, sectors } = req.query; // Comma-separated industries & sectors
    let client;
  
    try {
        client = await MongoClient.connect(MONGO_URI);
        const db = client.db(DATABASE_NAME);
        
        const industryArray = industries ? industries.split(',') : [];
        const sectorArray = sectors ? sectors.split(',') : [];
  
        const filter = {};
        if (industryArray.length > 0) {
            filter.Industry = { $in: industryArray };
        }
        if (sectorArray.length > 0) {
            filter.Sector = { $in: sectorArray };
        }
  
        const stocks = await db.collection(COLLECTION_NAME).find(filter).toArray();
        
        if (!stocks.length) {
            return res.status(404).json({ message: "No stocks found for the provided industries or sectors." });
        }
  
        res.json(stocks);
    } catch (error) {
        console.error('Error fetching stocks by multiple industries and sectors:', error);
        res.status(500).json({ message: 'Error fetching stocks by multiple industries and sectors' });
    } finally {
        if (client) client.close();
    }
  });



module.exports = router;