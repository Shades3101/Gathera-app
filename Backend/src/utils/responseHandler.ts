import type { Response } from "express";

export const response = ( res: Response, statusCode: number, message: string, data?: any ) => { 
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data: data ?? null
    });
};
