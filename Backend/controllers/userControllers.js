import { pool } from "../config/db.js";


export const handleSearchUser=async(req,res)=>{
    const name=req.query.name;
const userId=req.user.userId;
    if(name){
        return res.status(400).json({
            success:false,
            message:"All fields are mandatory"});
    }

    try{
    const result=await pool.query(
        `
        SELECT id, name, email
FROM users
WHERE name ILIKE '%' || $1 || '%'
AND id <> $2
LIMIT 10; `,[name,userId]
    );

    if(result.rowCount==0) return res.status(404).json({
        success:false,
        message:"No user found!"
    });

res.status(200).json({
    success:true,
    message:"Data fetched successfully",
    users:result.rows,
})

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
            
        })
    }
}
