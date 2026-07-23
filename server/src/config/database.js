const mongoose = require('mongoose');

const initDatabaseConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.log('[AutoPulse DB] Warning: MONGO_URI string missing in process environment');
    }
    await mongoose.connect(mongoUri);
    console.log('[AutoPulse DB] Connected to MongoDB cluster successfully');
  } catch (err) {
    console.error(`[AutoPulse DB] Database connection failure: ${err.message}`);
    process.exit(1);
  }
};

module.exports = initDatabaseConnection;
