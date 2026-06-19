

export const handleRegister=async(req,res)=>{
    const{name,email,password}=req.body;

    if(!name || !email || !password){
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