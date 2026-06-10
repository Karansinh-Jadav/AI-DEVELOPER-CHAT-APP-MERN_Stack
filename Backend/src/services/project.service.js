import projectModel from '../models/project.model.js'
import mongoose from 'mongoose'

export const createProject = async({
    name,userId
})=>{
    if(!name){
        throw new Error('Name is required')
    }
    if(!userId){
        throw new Error('User is required')
    }
    let project
    try{
        project = await projectModel.create({
        name,
        users:[userId]
    })
    }
    catch(err){
        if(err.code == 11000){
            throw new Error('Project name is Already exists')
        }
        throw err;
    }

    return project;
}

export const getAllProjectByUserId = async ({userId}) =>{
    if(!userId){
        throw new Error("UserId is reqiured")
    }

    const allUserProject = await projectModel.find({
        users:userId,
    })
    
    return allUserProject;
}

export const addUsersToProject = async ({projectId, users,userId}) =>{
    if(!projectId){
        throw new Error("Project is Reqired")
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID");
    }
    if(!userId){
        throw new Error("userId is Reqired")
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID");
    }
    if(!users){
        throw new Error("users is Reqired")
    }
    
    if ( !Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Users must be a non-empty array");
    }
    const project = await projectModel.find({
        _id: projectId,
        users: userId
    })

    if(!project){
        throw new Error("User not belong to this project")
    }

    const updatedproject = await projectModel.findOneAndUpdate({
        _id:projectId
    },{
        $addToSet:{
            users:{
                $each: users
            }
        }
    },{
        new: true
    })

    return updatedproject;
}

export const getProjectById = async ({projectId}) =>{
    if(!projectId){
        throw new Error("Project is Reqired")
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID");
    }

    const project = await projectModel.findOne({
        _id: projectId,
    }).populate('users',"email")

    return project;
}