import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitsService } from './exhibits.service';
import { ExhibitsController } from './exhibits.controller';
import { Exhibit } from './exhibits.entity';
import { UsersModule } from '../users/users.module';
import { TokenModule } from '../token/token.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Exhibit]),
        UsersModule,
        TokenModule,
        NotificationsModule
    ],
    providers: [ExhibitsService],
    controllers: [ExhibitsController],
    exports: [ExhibitsService],
})
export class ExhibitsModule {}