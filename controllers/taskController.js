const Task = require("../models/Task")
const Project = require("../models/Project")

const addTask = async (req, res)=>{
    const { project } = req.body

    const projectExists = await Project.findById(project)
    if(!projectExists){
        const error = new Error("Project doesn't exist")
        return res.status(404).json({msg : error.message})
    }
  
    if(projectExists.creator.toString() !== req.user._id.toString()){
        const error = new Error("You don't have the permissions to add tasks")
        return res.status(403).json({msg : error.message})
    }

    try{
        const storedTask = await Task.create(req.body)
        projectExists.tasks.push(storedTask._id)
        await projectExists.save()
        res.json(storedTask)
    }catch(error){
        console.log(error)
    }

}

const getTask = async (req, res)=>{
    const { id } = req.params
    
    const task = await Task.findById(id).populate("project")
    
    if(!task){
        const error = new Error("Requested task doesn't exist")
        return res.status(404).json({msg : error.message})
    }
    
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error("You don't have the permissions to perform this action")
        return res.status(403).json({msg : error.message})
    }

    res.json(task)
}

const updateTask = async (req, res)=>{
    const { id } = req.params
    
    const task = await Task.findById(id).populate("project")
    
    if(!task){
        const error = new Error("Requested task doesn't exist")
        return res.status(404).json({msg : error.message})
    }
    
    if(task.project.creator.toString() !== (req.user._id).toString()){
        const error = new Error("You don't have the permissions to perform this action")
        return res.status(403).json({msg : error.message})
    }

   
    task.name = req.body.name || task.name
    task.description = req.body.description || task.description
    task.priority = req.body.priority || task.priority
    task.deliveryDate = req.body.deliveryDate || task.deliveryDate

    try{
        const storedTask = await task.save()
        res.json(storedTask)
    }catch(error){
        console.log(error)
    }
}

const deleteTask = async (req, res)=>{
    const { id } = req.params
    
    const task = await Task.findById(id).populate("project")
    
    if(!task){
        const error = new Error("Requested task doesn't exist")
        return res.status(404).json({msg : error.message})
    }
    
    if(task.project.creator.toString() !== (req.user._id).toString()){
        const error = new Error("You don't have the permissions to perform this action")
        return res.status(403).json({msg : error.message})
    }

    try{

        const project = await Project.findById(task.project)
        project.tasks.pull(task._id)

        await Promise.allSettled([await project.save(), await task.deleteOne()])

        res.json("Task was successfully deleted")
    }catch(error){
        console.log(error)
    }

}

const changeState = async (req, res)=>{
    const { id } = req.params
    
    const task = await Task.findById(id).populate("project")
    
    if(!task){
        const error = new Error("Requested task doesn't exist")
        return res.status(404).json({msg : error.message})
    }
    
    if(task.project.creator.toString() !== (req.user._id).toString() && !task.project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())){
        const error = new Error("You don't have the permissions to perform this action")
        return res.status(403).json({msg : error.message})
    }

   task.status = !task.status;
   task.completed = req.user._id;
   await task.save()

   const taskStored = await Task.findById(id)
                                .populate("project")
                                .populate("completed")

   res.json(taskStored)
}

module.exports = { addTask, getTask, updateTask, deleteTask, changeState}
