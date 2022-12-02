import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
 token: string | JwtPayload;
}

const SECRET_KEY: Secret = process.env.TOKEN_SECRET as Secret

export const auth = async (req: Request, res: Response, next: NextFunction) => {
 try {
   const token = req.header('Authorization')?.substring(7)

   if (!token) {
     throw new Error();
   }

   const decodedToken = jwt.verify(token, SECRET_KEY)

   req.body.decodedToken = decodedToken

   next();
 } catch (err) {
   res.status(401).send('Authorization failure');
 }
};