import jwt, { decode } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const whitelist = [
    '/api/register',
    '/api/login',
    '/api/logout',
    '/score',
    'api/solomatches',
    '/api/solomatches/highscore',
    '/api/games',
];

const authenticate = (req, res, next) => {
    try{
        if (whitelist.some(path => req.path.startsWith(path))) return next();

        const authHeader = req.headers.authorization;
        if (!authHeader) 
            return res.status(403).send('Token Required');

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('user', decoded);
        req.user = decoded;

        next();
    }
    catch(err){
        if(err) return res.status(401).send('Token Expired')
    }
}

export default authenticate