import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();
export const authMiddleware=async(req,res,next)=>{
    const token=req.cookies.token;

    if(!token){
       return res.status(401).json({
            message:"Unauthorized access"
        });
    }
        try{
const result=  jwt.verify(token,process.env.JWT_SECRET);


req.user=result;

    console.log("auth successfull");

next();
}catch(error){
            console.log(error);
            return res.status(401).json({
    success: false,
    message: "Unauthorized access"
});
        }
    
}