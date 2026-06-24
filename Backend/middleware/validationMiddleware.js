import { userRegistrationSchema,userLoginSchema } from "../validation/validateData"

export const LoginvalidationMiddleware=(req,res,next)=>{

    try{
        const result=userLoginSchema.safeParse(req.body);
        if(!result.success){

return res.status(400).json({
    success:false,
    errors:result.error.issues
});
}

next();
    }catch(error){
        return res.status(500).json("Internal server error");
    }

}
export const registerValidationMiddleware=(req,res,next)=>{

    try{
        const result=userRegistrationSchema.safeParse(req.body);
        if(!result.success){

return res.status(400).json({
    success:false,
    errors:result.error.issues
});
}

next();
    }catch(error){
        return res.status(500).json("Internal server error");
    }

}