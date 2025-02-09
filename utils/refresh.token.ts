import dayjs from "dayjs"
import { JWT } from "next-auth/jwt";
import { redirect } from "next/navigation";
import { apiUrl } from "./url";
import { sendRequest } from "./fetch.api";

export const shouldRefreshToken = (expireAt: string) => {
    const expirationTime = dayjs(expireAt);
    const bufferTime = expirationTime.subtract(5, 'minutes');
    const currentTime = dayjs();
    return currentTime.isAfter(bufferTime);
}

export const letRefreshToken = async (token: JWT): Promise<JWT> => {
    if (!token) {
        redirect("/login");
    } else {
        const response = await sendRequest<ApiResponse<LoginResponse>>({
            url: `${apiUrl}/auth/refresh`,
            queryParams: {
                refresh_token: token.refreshToken
            }
        })
        if (response.status === 200) {
            console.log(">>> refresh token successfully!");
            return {
                ...token,
                accessToken: response.data.accessToken,
                expireAt: response.data.expireAt,
                refreshToken: response.data.refreshToken
            }
        }
        return token;
    }
}