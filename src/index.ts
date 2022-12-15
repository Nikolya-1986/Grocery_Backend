import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';

createConnection().then(() => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200'],
        credentials: true
    }));

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with");
        next(); 
    });

    //for 404
    app.use((req,res,next)=>{
        const err = new Error('Not Found');
        err.name='404';
        next(err);
    });
    
    //error handler
    app.use((err: { message: any; status: any; },req: any,res: { status: (arg0: any) => void; json: (arg0: { error: { message: any; }; }) => void; },next: any) => {
            console.log(err.message);
            res.status(err.status || 500);
            res.json({error:{
            message:err.message
        }});
    });

    app.set('port', process.env.PORT || 8008);
    app.listen(app.get('port'), () => {
        console.log(`Listening to port: ${app.get('port')}`);
    });
})

