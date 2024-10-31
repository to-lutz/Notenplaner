// apiKeyMiddleware.js
module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY; 

    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(403).json({ error: 'Zugriff verweigert: Ungültiger API-Key' });
    }
};