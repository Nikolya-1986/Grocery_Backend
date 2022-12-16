import "reflect-metadata"
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "node_grocery",
    entities: [User],
    synchronize: true,
    logging: false,
});

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully")
    })
    .catch((error: Error) => console.log(error))