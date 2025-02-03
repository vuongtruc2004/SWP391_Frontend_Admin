import { } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: UserResponse;
        accessToken: string;
        expireAt: string;
        refreshToken: string;
    }

    interface DefaultUser {
        user: UserResponse;
        accessToken: string;
        expireAt: string;
        refreshToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: UserResponse;
        accessToken: string;
        expireAt: string;
        refreshToken: string;
    }
}