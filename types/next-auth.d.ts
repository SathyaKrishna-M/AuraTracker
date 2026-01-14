import { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: Role
            aura: number
        } & DefaultSession["user"]
    }

    interface User {
        role: Role
        aura: number
    }
}
