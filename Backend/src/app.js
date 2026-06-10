import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import morgan from 'morgan'
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import cookieParser from "cookie-parser";
import cors from 'cors';


const app = express();

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
app.use(cors({    
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

app.use('/users',userRoutes)
app.use('/project',projectRoutes)

app.get('/',async function (req,res) {
    res.status(200).json({
        message:"Hello"
    })
})
export default app;