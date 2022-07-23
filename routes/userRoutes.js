const router = require('express').Router();

const {
    registerUser,
    authUser,
    confirmUser,
    forgotPassword,
    checkToken,
    newPassword,
    profile
} = require("../controllers/userController") 

const checkAuth = require("../middleware/checkAuth")

//Autenticación, Registro y confirmación de usuarios

router.post('/', registerUser) 
router.post('/login', authUser) 
router.get('/confirm/:token', confirmUser) 
router.post('/forgot-password', forgotPassword) 
router.route('/forgot-password/:token')
        .get(checkToken)
        .post(newPassword) 


router.get('/profile', checkAuth, profile)       


module.exports = router