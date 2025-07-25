const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// middleware for home page
const homeMiddleware = ((req, res, next) => {
    try {
        let tokenAuth = req.header('Authorization');
        if(tokenAuth) {
            const token = tokenAuth.split(' ')[1];
            if(!token) {
                return res.status(401).send({ message: "Invalid Token"})    
            }
            const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decodedUser;
            next();
        } else {
            res.status(401).json({ message: 'No token Provided' });
        }
    } catch(err) {
        console.error('Error:', err.message);
        res.status(401).json({ message: 'Unauthorized' });
    }
})

module.exports = homeMiddleware;