import express from "express";
import { prismaClient } from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook",async(req,res)=>{
    const paymentInformation:{
        token:string,
        userId:string,
        amount:string
    } = {
        token:req.body.token,
        userId:req.body.user_identifier,
        amount:req.body.amount
    }

    try {
        await prismaClient.$transaction([
            prismaClient.balance.updateMany({
                where:{
                    userId:Number(paymentInformation.userId)
                },
                data:{
                    amount:{
                        increment:Number(paymentInformation.amount)
                    }
                }
            }),
            prismaClient.onRampTransaction.updateMany({
                where:{
                    token:paymentInformation.token
                },
                data:{
                    status:"Success"
                }
            })
        ])

        res.json({
            message:"Captured"
        })
    } catch (error) {
        console.log(error);
        res.status(411).json({
            message:"Error while processing webhook"
        })
    }
})

app.listen(3003);