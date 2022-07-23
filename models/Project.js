const mongoose = require("mongoose")

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true
    },
    description: {
        type: String,
        trim: true,
        require: true
    },
    deliveryDate: {
        type: Date,
        dafault: Date.now()
    },
    client: {
        type: String,
        trim: true,
        require: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tasks:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Task"
        }
    ],
    collaborators: [{
            type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },],
},{
    timestamps: true,
})

const Project = mongoose.model("Project", projectSchema)

module.exports = Project