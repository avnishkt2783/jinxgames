import jwt from "jsonwebtoken"

const authenticate = (req, res, next) =>{
    try{
        const authHeader = req.header('Authorization')
        if(!authHeader){
            return res.status(401).json({message: 'Access Denied. No Token Provided'})
        }

        const token = authHeader.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_KEY)

        req.user = decoded
        next()
    }
    catch(err){
        console.error('JWT ERROR: ', err)
        return res.status(401).json({message: 'Invalid or Token Expired.'})
    }
}

export default authenticate