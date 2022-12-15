import { Entity } from "typeorm";
import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        unique: true
    })
    email!: string;

    @Column()
    password!: string;
}
//https://progressivecoder.com/nodejs-express-login-authentication-with-jwt-and-mysql/
// https://github.com/dashsaurabh/node-express-login-demo/tree/master/src/entity