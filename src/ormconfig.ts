import {DataSource} from 'typeorm';
import {User} from "./users/users.entity";
import {Exhibit} from "./exhibits/exhibits.entity";
import {Comment} from "./comments/comments.entity";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'exhibits_admin',
    password: 'password',
    database: 'exhibits_db',
    migrations: ['./src/migrations/*.ts'],
    synchronize: false,
    entities: [User, Comment, Exhibit]
});