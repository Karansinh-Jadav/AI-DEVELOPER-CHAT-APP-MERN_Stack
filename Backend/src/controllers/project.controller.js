import projectModel from "../models/project.model.js";
import {createProject} from "../services/project.service.js";
import userModel from '../models/user.model.js'



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