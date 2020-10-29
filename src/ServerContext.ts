import { Request, Response } from "express";

export interface ServerContext {
    res: Response;
    req: Request;
    payload?: {userId: string};
}