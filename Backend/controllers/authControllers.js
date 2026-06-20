import { pool } from "../config/db.js";
import bcrypt from 'bcrypt';

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
            console.log(error);
            return res.status(500).json({
                message:"Internal server error"
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
        return res.status(404).json({
            message:"User not found"
        });
    };



    const resultPass=result.rows[0].password;

    const comparedPass=await bcrypt.compare(password,resultPass);

    if(!comparedPass){
         return res.status(400).json({
            message:"Bad request"
        })
    }

    return res.status(200).json({
        message:"Login was successful , yayyyyyy!"
    })

    
    
        }catch(error){
            return res.status(500).json({
                message:"Internal server error"
            })
        }
    

};