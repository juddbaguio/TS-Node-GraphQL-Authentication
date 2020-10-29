import { Response } from "express";
import { sign } from "jsonwebtoken";
import { User } from "src/entity/User";

export const createAccessToken =  (user: User): string => {
    return sign({userId: user.id}, process.env.ACCESS_TOKEN_KEY!, {
        expiresIn: "1h"
    })
}

export const createRefreshToken = (user: User) => {
    return sign({userId: user.id}, process.env.REFRESH_TOKEN_KEY!, {
        expiresIn: "15m"
    })
}

export const sendRefreshToken = (res: Response, rfToken: string) => {
    res.cookie("user_cookie", rfToken)
}