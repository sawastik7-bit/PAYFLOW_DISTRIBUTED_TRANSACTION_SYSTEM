import { pool } from "../config/db.js";


export const handleRegister=async(req,res)=>{
    const{name,email,password}=req.body;

    if(!name || !email || !password){
        console.log("all fields are mandatory");
        return res.status(400).json({
            message:"Invalid request! all fields are mandatory"
        });
    }
 ;


        try{

const result=await pool.query(`INSERT INTO users (name,email,password)
     VALUES ($1,$2,$3)
     RETURNING name,email;
     `,[name,email,password]);

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





        }catch(error){
            return res.status(500).json({
                message:"Internal server error"
            })
        }
    

};