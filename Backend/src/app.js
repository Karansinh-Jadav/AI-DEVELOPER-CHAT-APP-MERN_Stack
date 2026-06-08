import express from 'express'
import morgan from 'morgan'
import userRoutes from './routes/user.route.js';
import cookieParser from "cookie-parser";


const app = express();

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

app.use('/api/auth',userRoutes)

app.get('/',async function (req,res) {
    res.status(200).json({
        message:"Hello"
    })
})
export default app;