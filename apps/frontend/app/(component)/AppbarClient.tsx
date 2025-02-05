"use client"
import { useSession,signIn,signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Appbar } from "./(ui)/Appbar";

export default function AppbarClient(){
    const session = useSession();
    const router = useRouter();

    return (
        <div>
            <Appbar
                    onSignin={signIn}
                    onSignout={async()=>{
                        await signOut()
                        router.push("/api/auth/signin")
                    }}
                    user={session.data?.user}
            />
        </div>
    )
}