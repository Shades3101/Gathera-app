import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
})

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
})

export const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});


