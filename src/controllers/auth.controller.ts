import bcryptjs from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

import { User } from "../entities/user.entity";
import { AppDataSource } from "../data-source";

export const Register = async (req: Request | any, res: Response | any) => {
    try {
        const { name, email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User); 
        const user = await userRepository.save({
            name,
            email,
            password: await bcryptjs.hash(password, 12)
        })
    
        res.send({
            user,
            message: 'User successfully registered'
        });
    } catch(error) {
        console.log(error);
        return res.status(400).send({
            message: 'Email already exists!'
        })
    }
};

export const Login = async (req: Request | any, res: Response | any) => {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User); 

    const user = await userRepository.findOne({
        where: {
            email: email,
        }
    });
    if(!user) {
        return res.status(400).send({
            message: 'Invalid email!',
        })
    };
    const userPassword = await bcryptjs.compare(password, user.password);
    if(!userPassword) {
        return res.status(400).send({
            message: 'Invalid password!',
        })
    };

    const accessToken = sign({
        id: user.id,
    }, 'access_secret',  { expiresIn: 60 * 60 });

    const refreshToken = sign({
        id: user.id,
    }, 'refresh_secret', { expiresIn: 24 * 60 * 60 });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //equivalent to 1 day
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 //equivalent to 7 days
    });

    res.send({
        message: 'You have successfully logged in'
    });
};

export const Logout = async (req: Request | any, res: Response | any) => {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });

    res.send({
        message: 'You have successfully logged out'
    });
};

export const AuthenticatedUser = async (req: Request | any, res: Response | any) => {
    try {
        console.log(req.cookie);
        const userRepository = AppDataSource.getRepository(User); 
        const accessToken = req.cookies['accessToken'];
        const payload: any = verify(accessToken, "access_secret");

        if(!payload) {
            return res.status(401).send({
                message: 'Unauthenticated!'
            })
        }

        const user = await userRepository.findOne({
            where: {
                email: req.body.email,
            }
        });
        if(!user) {
            return res.status(401).send({
                message: 'Unauthenticated!',
            })
        };

        res.send({
            user,
            accessToken,
            message: 'You are in the system',
        });
    } catch(error) {
        console.log(error)
        return res.status(401).send({
            message: 'Unauthenticated'
        })
    }
};

export const Refresh = async (req: Request | any, res: Response | any) => {
    try {
        const refreshToken = req.cookies['refreshToken'];
        const payload: any = verify(refreshToken, "refresh_secret");

        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        };

        const accessToken = sign({
            id: payload.id,
        }, "access_secret", { expiresIn: 60 * 60 });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.send({
            accessToken,
            refreshToken,
            message: 'Access and refresh tokens are exist'
        });

    } catch(error) {
        console.log(error)
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
}