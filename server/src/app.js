const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const vehicleRouter = require('./routes/vehicleRouter');

const app = express();

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'AutoPulse Fleet Operations API Server Live' });
});

// Authentication Router
app.use('/api/auth', authRouter);

// Vehicle & Inventory Router
app.use('/api/vehicles', vehicleRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'AutoPulse API is healthy' });
});

module.exports = app;
