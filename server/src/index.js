require('dotenv').config();
const app = require('./app');
const initDatabaseConnection = require('./config/database');

const PORT = process.env.PORT || 5000;

initDatabaseConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`[AutoPulse Server] Listening on port ${PORT}`);
    });
});
