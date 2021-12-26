const router = require("express").Router();
const req = require("express/lib/request");
const User = require("../models/User"); 
const CryptoJS = require ("crypto-js"); 
const jwt = require ("jsonwebtoken"); 

// REGISTER 
router.post("/register", async(req, res) =>
 {
    const userData = new User ({
        username : req.body.username,
        email:  req.body.email,
        password:  CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
        ).toString(), 
    }); 
        try {
            const user = await userData.save(); 
            res.status(201).json(user); 
        }catch (err) {
            res.status(500).json(err);
        }
});

// LOGIN 

router.post("/login", async (req, res) =>
 {
    try {
        const user = await User.findOne({email: req.body.email}); 
        !user && res.status(401).json("login ou senha incorreta!!"); 

        const bytes = CryptoJS.AES.descrypt(user.password, process.env.SECRET_KEY); 
        const origPassword = bytes.toString(CryptoJS.Utf8); 

        origPassword !== req.body.password &&
            res.status(401).json("Wrong password or username"); 

        const acessToken =jwt.sign(
            {id : user._id, isAdmin :  user.isAdmin},
            process.env.SECRET_KEY, 
            {expiresIn :  "5d"}
        );

            const {passwrod, ...other } = user._doc; 
            res.status(200).json(other, acessToken);  
    } catch (err) {
        res.status(500).json(err); 
    }
}
)

module.exports = router; 