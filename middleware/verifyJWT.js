const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    /* old version of auth
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    console.log(authHeader); //bearer token
    const token = authHeader.split(' ')[1];
    */
    const cookies = req.cookies;
    if(!cookies?.jwt_at) return res.sendStatus(401);//this is optional chaining. if cookies exist, we are also looking if jwt_at exists
    console.log("jwt_at:", cookies.jwt_at);
    const token = cookies.jwt_at;
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.username; //what does this do???
            next();
        }
    );
}

module.exports = verifyJWT;