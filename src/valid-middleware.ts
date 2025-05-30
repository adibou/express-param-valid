import { NextFunction, Response, Request } from 'express';
import FullArgError from './arg-error';

export default function catchArgs(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof FullArgError) {
        console.log('ArgError', err.message, err.field, req.originalUrl);
        res.status(400).json({
            code: 400,
            error: err.message,
            errorCode: err.code,
            errorDetails: err.errorDetails,
            field: err.field,
            url: req.originalUrl,
        });
    } else {
        next(err); 
    }
}   
