const router = require ("express").Router(); 
const User = require ("../models/User");
const CryptoJS = require ("crypto-js");
const verify = require ("../verifyToken"); 
const { Router } = require("express");

// Update user 

router.put ("/:id", verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.admin) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(

                req.body.password, 
                process.env.SECRET_KEY
            ) . toString(); 
        }
        try{
            const UpdateUser = await User.findByIdAndUpdate (
                req.params.id, {$set: req.body}, {new: true }
            ); 
            res.status(200).json(UpdateUser); 
   } catch (err) {
       res.status(500).json(err); 
   }
}else {
    res.status(403).json("You cannot update other's account"); 
}
});

// DELETE 

router.delete("/:id", verify , async(req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin){
        try{
            await User.findOneAndDelete(req.params.id);
            res.status(200).json("User has been deleted...");
        }catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You cannot delete other's account!!"); 
    }
}); 

// GET

router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id); 
        const {password, ...other } = user._doc;
        res.status(200).json(other); 
    }catch (err) {
        res.status(500).json(err);
    }
}); 

// GET ALL

router.get("/", verify, async(req, res) => 
{
const query = req.query.new;
if (req.user.isAdmin){
    try{
        const user = query
        ? await User.find().sort({_id: -1}).limit(5)
        : await User.find(); 
    res.status(200).json(users);
    } catch (err){
        res.status(500).json(err);
    }
} else{
    res.status(403).json("você não tem privilegio para ver todos os usuários");
}
}); 

// GET USER STATS

router.get("/stats", async (req, res) => {
try{
    const data = await User.aggregate([
        {$project:{ month: {$month: "$createdAt"}}},
        {$group: {_id: "$month", total: {$sum: 1}}},
    ]);
    res.status(200).json(data)
}catch (err){
    res.status(500).json(err)
}
});

module.exports = Router