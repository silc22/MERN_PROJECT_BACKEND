const router = require("express").Router()
const checkAuth = require('../middleware/checkAuth')

const { 
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
} 
= require("../controllers/taskController")

router.post('/', checkAuth, addTask)
router.route('/:id')
        .get(checkAuth, getTask)
        .put(checkAuth, updateTask)
        .delete(checkAuth, deleteTask)
router.post('/status/:id', checkAuth, changeState)


module.exports = router