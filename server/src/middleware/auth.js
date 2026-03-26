const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Attempt payload extraction from secure cookie or secondary Authorization Header
    let token = req.cookies?.auth_token;
    
    if (!token && req.headers.authorization) {
        if (req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: Missing Authentication Token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mnit2026_hackathon_alpha_key');
        req.user = decoded;
        next();
    } catch (err) {
        console.warn("[Auth Matrix] Alert: Invalid or expired token interception blocked.");
        return res.status(401).json({ error: 'Access Denied: Token Signature Invalid' });
    }
};

module.exports = authMiddleware;
