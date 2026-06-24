import { pool } from "../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const handleRegister=async(req,res)=>{
    const{name,email,password}=req.body;

    if(!name || !email || !password){
        console.log("all fields are mandatory");
        return res.status(400).json({
            message:"Invalid request! all fields are mandatory"
        });
    }
 ;

 const hashedPass=await bcrypt.hash(password,10);

        try{

const result=await pool.query(`INSERT INTO users (name,email,password)
     VALUES ($1,$2,$3)
     RETURNING name,email;
     `,[name,email,hashedPass]);

console.log('Data Inserted successfylly');

return res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: result.rows[0]
});


        }catch(error){
            
            return res.status(409).json({
                message:"Email alrady exists"
            })
        }
        
    

};

export const handleLogin=async(req,res)=>{
    const{email,password}=req.body;

    if(!email || !password){
        console.log("all fields are mandatory");
        return res.status(400).json({
            message:"Invalid request! all fields are mandatory"
        });
    }
    try{

const result=await pool.query(`
    SELECT * FROM users 
    WHERE email=$1
    ;
    `,[email]);

    if(result.rows.length ==0){
        return res.status(401).json({
            message:"Invalid credentials"
        });
    };



    const resultPass=result.rows[0].password;

    const comparedPass=await bcrypt.compare(password,resultPass);

    if(!comparedPass){
         return res.status(401).json({
            message:"Unauthorized"
        })
    }

    const payload={
        userId:result.rows[0].id,
        name:result.rows[0].name,
        email:result.rows[0].email
    };

    const token=jwt.sign(payload,process.env.JWT_SECRET,{
        
        expiresIn:'1d'
    })

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
});

    return res.status(200).json({
        success:true,
        message:"Login successfull",
        payload
    })
   
     }catch(error){
            return res.status(500).json({
                message:"Internal server error"
            })
        }
    

};