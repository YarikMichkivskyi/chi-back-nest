import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { TokenModule } from '../token/token.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,
        TokenModule,
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    controllers: [AuthController],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}