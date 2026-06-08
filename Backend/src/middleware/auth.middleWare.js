import jwt from 'jsonwebtoken';


const authVAlidate = async (req,res,next)=>{
    const token = req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = decoded;
        next()
    }
    catch(err){
        
        return res.status(401).json({message: "Unauthorized uers"})
        
    }
}

export default authVAlidate;