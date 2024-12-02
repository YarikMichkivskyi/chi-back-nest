import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user && (await this.comparePasswords(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '30d' });

        return {
            access_token: accessToken,
        };
    }

    private async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plainText, hashed);
    }
}
