import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        req.body.id = decoded.id;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).send({ error: 'Invalid token' });
    }
};

export default authMiddleware;