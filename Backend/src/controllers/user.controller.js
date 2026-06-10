import userModel from '../models/user.model.js'
import userService from '../services/user.service.js'
import redisClient from '../services/redis.service.js'

export const createUserController = async (req,res)=>{

    try {
        const user = await userService.createUser(req.body);
        const token = user.generateJWT();
        res.cookie("token",token);
        delete user._doc.password;
        res.status(201).json({user,token});
    }
    catch(err){
        res.status(400).send(err.message);
    }
}
export const loginController = async (req,res)=>{

    try {
        const {email , password} = req.body;

        const user = await userModel.findOne({email}).select("+password ");

        if(!user){
            return res.status(401).json({
                errors: "Invalid Credentials"
            })
        }
        const isMatchPassword = await user.isValidPassword(password);
        if(!isMatchPassword){
            return res.status(401).json({
                errors: "Invalid Credentials"
            })
        }
        const token = await user.generateJWT()

        res.cookie("token",token)
        delete user._doc.password;
        res.status(201).json({
        message:"User logged in successfully",
        user
    })
    }
    catch(err){
        res.status(400).send(err.message);
    }
}
export const profileController = async (req,res)=>{

    try {
        res.status(201).json({
            user:req.user
    })
    }
    catch(err){
        res.status(400).send(err.message);
    }
}
export const logoutController = async (req,res)=>{

    try {
        const token = req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

        await redisClient.set(token,'logout', 'EX' , 60*60*24);

        res.clearCookie("token");

        res.status(200).json({
            message: 'Logged out successfully'
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }
}

export const getAllUsersController = async(req,res)=>{
    try {
        const loggedInUser = await userModel.findOne({
            email:req.user.email
        })
        const allUsers = await userService.getAllUsers({ userId:loggedInUser._id }); 

        res.status(200).json({
            allUsers
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }
}

