import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Auth header received:', authHeader);
    if (!authHeader) {
        console.log('No Authorization header provided');
        return res.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log('No token found in Authorization header');
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