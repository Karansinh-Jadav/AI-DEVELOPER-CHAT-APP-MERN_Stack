import dotenv from 'dotenv';
dotenv.config()
import http from 'http'
import app from './src/app.js'
import { log } from 'console';
import connectDB from './src/db/db.js';
import {Server} from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import projectModel from './src/models/project.model.js'
import {generateResult} from './src/services/ai.service.js'
import userModel from './src/models/user.model.js'

connectDB();

const port = process.env.PORT || 3000;

const server =http.createServer(app);

const io = new Server(server,{
    cors:{    
    origin: process.env.FRONTEND_URL,
    credentials: true}
});
io.engine.on("connection_error", (err) => {
    console.log("Connection Error");
    console.log(err.code);
    console.log(err.message);
    console.log(err.context);
});
io.use(async (socket,next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        const projectId = socket.handshake.query.projectId;

        console.log("Socket Connection Attempt - Project ID:", projectId);

        if (!token) {
            console.error("Socket Auth Failed: Token missing");
            return next(new Error("Authentication error: Token missing"));
        }
        if(!mongoose.Types.ObjectId.isValid(projectId)){
            console.error("Socket Auth Failed: Invalid Project ID format:", projectId);
            return next(new Error("ProjectId error: Invalid ProjectId")); 
        }
        
        const project = await projectModel.findById(projectId);
        if (!project) {
            console.error("Socket Auth Failed: Project not found in DB:", projectId);
            return next(new Error("ProjectId error: Project not found"));
        }
        socket.project = project;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;

        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            console.error("Socket Auth Failed: User not found in DB:", decoded.email);
            return next(new Error("Authentication error: User not found"));
        }

        const isMember = project.users.some(userId => userId.toString() === user._id.toString());
        if (!isMember) {
            console.error("Socket Auth Failed: User", user.email, "is not a member of project", project.name);
            return next(new Error("Authentication error: User does not belong to this project"));
        }
    
        console.log("Socket Auth Success: User", user.email, "connected to project", project.name);
        next(); 
    } catch (err) {
        console.error("Socket Auth Exception:", err);
        next(err);
    }
})

io.on('connection',socket =>{
    socket.roomId = socket.project._id.toString();
    console.log('a user connected');
    socket.join(socket.roomId)

    socket.on('project-message',async data =>{

        socket.broadcast.to(socket.roomId).emit('project-message',data)
        const message = data.message;

        const aiIsPresentInMessage = message.includes('@ai');

        if(aiIsPresentInMessage){
            const prompt = message.replace('@ai','');

            const result = await generateResult(prompt);

            io.to(socket.roomId).emit('project-message',{
                message: result,
                sender: "AI"
            })

            
        }
        
        
    })
    socket.on('disconnect', ()=>{
        console.log("user disconnected");
        socket.leave(socket.roomId)
    }) 
});


server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})