const jwt = require ("jsonwebtoken"); 

function verify (req, res, next) {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ") [1];

        jwt.verify(token, token, process.env.SECRET_KEy, (err, user) => {
            if (err) res.status(403).json("Token is not valid"); 
            req.user = user;
            next();
        });
    } else{
        return res.status(401).json("You are not autheticated!!");  
}

}

module.exports = verify; 