import { JWT_SECRET } from "../secrets";

const jwt = require('jsonwebtoken');

export const generateResetPasswordToken = (userId:any) => {
    // Generate token valid for 5 minutes
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '5m' });
};