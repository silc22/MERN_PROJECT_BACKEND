const User = require("../models/User")
const generateJWT = require("../helpers/generateJWT")
const generateId = require("../helpers/generateId")
const {registrationEmail, emailForgotPassword} = require("../helpers/email")

const registerUser = async (req,res) =>{
    
    const {email} = req.body
    const userExists = await User.findOne({email})

    if(userExists){
        const error = new Error("User already registered")
        return res.status(400).json({ msg: error.message })
    }

    try{
        const user = new User(req.body)
        user.token = generateId();
        await user.save()

        //confirmation mail
        registrationEmail({
            name: user.name, 
            email: user.email,
            token: user.token            
        })

        res.json({msg : "User successfully created, check your email to confirm your account"})
    }catch (error) {
        console.log(error)
    }
}

const authUser = async (req, res) =>{

    const {email, password } = req.body

    const user = await User.findOne({email})
    if(!user){
        const error = new Error('User does not exist')
        return res.status(404).json({msg: error.message})
    }

    if(!user.confirmed){
        const error = new Error('Your account is not confirmed')
        return res.status(403).json({msg: error.message})
    }

    if (await user.checkPassword(password)){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id)
        })
    }else{
        const error = new Error("Your password is incorrect")
        return res.status(403).json({msg : error.message})
    }

}

const confirmUser = async (req, res) =>{
    const {token} = req.params
    const userConfirm = await User.findOne({token})
    console.log(userConfirm)

    if(!userConfirm){
        const error = new Error("Invalid Token")
        return res.status(403).json({msg: error.message})
    }

    try{
        userConfirm.confirmed = true;
        userConfirm.token = '';
        await userConfirm.save()
        res.json({msg: 'User successfully confirmed'})
    }catch(error){
        console.log(error)
    }
}

const forgotPassword = async (req,res) =>{
    const {email} = req.body

    const user = await User.findOne({email})
    if(!user){
        const error = new Error('User does not exist')
        return res.status(404).json({msg: error.message})
    }

    try{
        user.token = generateId()
        await user.save()

        //forgot password mail
        emailForgotPassword({
            name: user.name,
            email: user.email,
            token: user.token
        })
        res.json({msg: "We have sent an email with instructions"})
    }catch(error){
       console.log(error)
    }

}

const checkToken = async (req, res) => {
    const {token} = req.params

    const tokenValid = await User.findOne({token})

    if(tokenValid){
       res.json({msg: "Valid token and user exists"})
    }else{
        const error = new Error("Invalid token")
        return res.status(404).json({msg: error.message})
    }
}

const newPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body

    const user = await User.findOne({token})

    if(user){
      user.password = password
      user.token = "";
      try{
        await user.save()
        res.json({msg: "Password successfully modified"})
      }catch(error){
        console.log("Invalid token")
        }
    }
}

const profile = async (req, res) =>{
    const {user} = req;
    res.json(user)
}

module.exports = {
    registerUser,
    authUser,
    confirmUser,
    forgotPassword,
    checkToken,
    newPassword,
    profile
}
