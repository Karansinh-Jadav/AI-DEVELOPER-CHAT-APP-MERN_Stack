import dotenv from 'dotenv';
dotenv.config()
console.log("FRONTEND_URL =", process.env.FRONTEND_URL);

import http from 'http'
import app from './src/app.js'
import { log } from 'console';
import connectDB from './src/db/db.js';

connectDB();

const port = process.env.PORT || 3000;

const server =http.createServer(app);


server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})