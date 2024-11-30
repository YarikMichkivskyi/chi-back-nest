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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),
        NotificationsModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static'),
            serveRoot: '/static',
        }),
        AuthModule,
        UsersModule,
        ExhibitsModule,
        CommentsModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User, Comment, Exhibit],
            synchronize: false,
        }),
        TokenModule
    ],
})
export class AppModule {}
