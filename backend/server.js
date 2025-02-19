const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const stockDataRoutes = require('./routes/stockDataRoutes');
const watchlistRoutes = require('./routes/watchlist')
const cors = require('cors');
const app = express();
require('dotenv').config();



connectDB();


app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use(stockDataRoutes);
app.use('/api/watchlist', watchlistRoutes)
app.use('/uploads', express.static('uploads'));




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
