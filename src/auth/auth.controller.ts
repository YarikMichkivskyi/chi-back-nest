import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login user and return access token' })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in.'
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials.',
    })
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        const { access_token } = await this.authService.login(user);

        const response = {
            access_token,
            userName: loginDto.username,
            userRole: user.role,
            userId: user.id,
        };

        return res.status(HttpStatus.OK).json(response);
    }
}