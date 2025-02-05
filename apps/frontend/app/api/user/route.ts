import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(lib)/auth";

export const GET = async ()=>{
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
        user:session.user.id
    })
}