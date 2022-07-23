const jwt = require("jsonwebtoken")
const User = require("../models/User")

//Verificacion de usuario autenticado y que el jwt sea válido

const checkAuth = async (req, res, next) => {
    let token
    
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")
            
            return next()
        }catch(error){
            return res.status(404).json({msg: "There was an error"})
        }
    }
    if(!token){
        const error = new Error("Ivalid Token")
        return res.status(401).json({msg: error.message})
    }

    next()
}

module.exports = checkAuth