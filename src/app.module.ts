import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Exhibit } from './exhibits/exhibits.entity';
import { Comment } from './comments/comments.entity';
import { ConfigModule } from '@nestjs/config';
import { ExhibitsModule } from './exhibits/exhibits.module';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// const DataSource = TypeOrmModule.forRoot({
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     entities: [User, Comment, Exhibit],
//     synchronize: false,
// });

const DataSource = TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'exhibits_admin',
    password: 'password',
    database: 'exhibits_db',
    entities: [User, Comment, Exhibit],
    synchronize: false,
});

@Module({
    imports: [
        NotificationsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static'),
            serveRoot: '/static',
        }),
        AuthModule,
        UsersModule,
        ExhibitsModule,
        CommentsModule,
        DataSource,
        TokenModule
    ],
})
export class AppModule {}
