import {prismaClient} from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import {number, z} from "zod";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            name: { label: "Name", type: "text", placeholder: "Aryan" },
            email: { label: "Email", type: "email", placeholder: "aryan@gmail.com" },
            number: { label: "Phone number", type: "text", placeholder: "1231231231" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials: any) {

            const schemaValidation = z.object({
              email:z.string(),
              name:z.string(),
              number:z.string(),
              password:z.string()
            })

            console.log("after zod init")

            const parsedData = schemaValidation.safeParse({
              email:credentials.email,
              name:credentials.name,
              number:credentials.number,
              password:credentials.password
            })

            console.log("after schema checking")

            if(!parsedData.success){
              console.log(" checking fail")
              return null;
            }

            try {
                console.log("checking pass")
                const hashedPassword = await bcrypt.hash(credentials.password,5);
                const existingUser = await prismaClient.user.findFirst({
                  where:{
                    number:credentials.number
                  }
                })

                if(existingUser){
                  console.log("existing user")
                  const isPasswordCorrect =await bcrypt.compare(credentials.password,existingUser.password);

                  if(isPasswordCorrect){
                    return {
                      id:existingUser.id.toString(),
                      name:existingUser.name,
                      email:existingUser.email
                    }
                  }else{
                    return null;
                  }
                }else{
                  console.log("create user")

                  const createUser = await prismaClient.user.create({
                    data:{
                      email:credentials.email,
                      name:credentials.name,
                      number:credentials.number,
                      password:hashedPassword
                    }
                  })

                  return {
                    id:createUser.id.toString(),
                    name:createUser.name,
                    email:createUser.email
                  }
                }
            } catch (error) {
              console.error(error)
                return null
            }
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub
                                                                                                 
            return session
        }
    }
  }
 