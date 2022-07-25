const express = require('express')
const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require("./routes/taskRoutes")
const cors = require("cors")

require('dotenv').config();
require('./config/database');


const app = express()
app.use(express.json())


//CORS CONFIGURATION
const whiteList = [process.env.FRONTEND_URL];

const corsOption = {
    origin: function(origin, callback){
            if(whiteList.includes(origin)){
                callback(null, true)
        }else{
            callback(new Error("CORS error"))
        }
    }
}

app.use(cors(corsOption))

//Routing
app.use('/users', userRoutes)
app.use('/projects', projectRoutes)
app.use('/task', taskRoutes)


const PORT = process.env.PORT || 4000

const server = app.listen(PORT, ()=>{
    console.log(`Server listen on port ${PORT}`)
})

//socket.io

const { Server } =  require('socket.io')

const io = new Server(server,{
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
})

io.on("connection", (socket) =>{
    // console.log("connected to socket.io")

    //Socket.io events
   socket.on('open project', (project)=>{
    socket.join(project)
   });

   socket.on('new task', (task) =>{
       const project = task.project
        socket.to(project).emit('added task', task)
   });

   socket.on("delete task", task =>{
        const project = task.project
        socket.to(project).emit("deleted task", task)
   });

   socket.on("update task", task => {
        const project = task.project._id
        socket.to(project).emit("updated task", task)
   });

   socket.on("change status", task =>{
        const project = task.project._id
        socket.to(project).emit("new state", task)
   })
})