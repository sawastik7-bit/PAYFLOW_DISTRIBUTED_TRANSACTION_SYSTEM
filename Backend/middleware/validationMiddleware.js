
export const validationMiddleware=async(schema)=>{

 return (req,res,next)=>{
        
         try{
        const result=schema.safeParse(req.body);
        if(!result.success){

return res.status(400).json({
    success:false,
    errors:result.error
});
}

req.body=result.data;

next();
    }catch(error){
        return res.status(500).json("Internal server error");
    }

}

    }

