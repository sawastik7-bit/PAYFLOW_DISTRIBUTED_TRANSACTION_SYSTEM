import { pool } from "../config/db"
export const connectDB=async()=>{

     try {
        await pool.query("SELECT NOW()");
        console.log("PostgreSQL Connected");
}catch(error){
    console.log("Database connection failed");
}
}