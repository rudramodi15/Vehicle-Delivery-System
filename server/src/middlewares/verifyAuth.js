const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

/**
 * Middleware: Verify Bearer JWT in request Authorization header
 */
const authenticateUser = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const bearerToken = header.split(' ')[1];
        const payload = jwt.verify(bearerToken, JWT_SECRET);

        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

/**
 * Middleware: Ensure authenticated user holds Admin role privileges
 */
const authAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access forbidden. Admin role required.' });
    }
    next();
};

module.exports = { authenticateUser, authAdmin };
