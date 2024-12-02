import {DataSource} from 'typeorm';
import {User} from "./users/users.entity";
import {Exhibit} from "./exhibits/exhibits.entity";
import {Comment} from "./comments/comments.entity";
import {config} from 'dotenv'

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    migrations: ['./src/migrations/*.ts'],
    synchronize: false,
    entities: [User, Comment, Exhibit]
});

