import projectModel from "../models/project.model.js";
import {createProject, getAllProjectByUserId,addUsersToProject,getProjectById} from "../services/project.service.js";
import userModel from '../models/user.model.js'
import project from "../models/project.model.js";



export const createProjectController = async (req,res) =>{
    
    try{
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email:req.user.email });
    const userId = loggedInUser._id;

    const newProject = await createProject({name,userId})

    res.status(201).json({
        message:'project crated successfully',
        newProject,
    });
    }
    catch(err){
        console.log(err)
        res.status(400).send(err.message);
    }
    
}

export const getAllProject = async(req,res)=>{
    try{
        const loggedInUser = await userModel.findOne({
            email:req.user.email,
        })
        
        const allUserProjects = await getAllProjectByUserId({
            userId:loggedInUser._id,
        })
        
        
        return res.status(200).json({
            
            
            projects: allUserProjects,
        })

    }catch(err){
        console.log(err);
        res.status(400).json({error:err.message})
    }
}

export const addUserToProject = async(req,res) =>{
    try{
       const {projectId, users } = req.body

       const loggedInUser = await userModel.findOne({
        email:req.user.email
       })
       const project = await addUsersToProject({
        projectId,
        users,
        userId:loggedInUser._id,
       })

       return res.status(200).json({
            project,
       })

    }catch(err){
        console.log(err);
        res.status(400).json({error:err.message})
    }
}
export const getProject = async(req,res) =>{
    try{
       const {projectId } = req.params

    //    const loggedInUser = await userModel.findOne({
    //     email:req.user.email
    //    })
       const project = await getProjectById({ projectId })

       return res.status(200).json({
            project,
       })

    }catch(err){
        console.log(err);
        res.status(400).json({error:err.message})
    }
}

