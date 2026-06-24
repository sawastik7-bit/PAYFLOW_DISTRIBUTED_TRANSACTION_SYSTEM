import {z} from 'zod';

export const userRegistrationSchema=z.object({
    name:z.string().trim().min(3,{
        message:"Name must contain at least 3 characters"
    }),
    email:z.string().trim().email({
        message:"Invalid Email address"
    }),
    password:z.string().trim().min(8,{
        message:"Password must be atleast 8 characters"
    }),
});

export const userLoginSchema=z.object({
    email:z.string().trim().email({
        message:"Invalid Email address"
    }),
    password:z.string().trim().min(8,{
        message:"Password must be atleast 8 characters long"
    }),

})