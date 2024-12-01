import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
    HttpStatus,
    BadRequestException, NotFoundException, Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { User } from './users.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'New user registration' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or user already exists' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.createUser(createUserDto);
        return plainToInstance(User, user, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get profile of the authenticated user' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Profile retrieved successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
    @Get('my-profile')
    async getMyProfile(@Req() req: any) {
        const userId = Number(req.user.sub);
        console.log(req.user);
        if (!userId || userId <= 0) {
            throw new BadRequestException('Invalid user ID in token');
        }

        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return plainToInstance(User, user, { excludeExtraneousValues: true });
    }

    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID' })
    @ApiParam({ name: 'id', description: 'User ID', example: 1 })
    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        if (id <= 0) {
            throw new BadRequestException('ID must be a positive integer');
        }
        const user:User = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return plainToInstance(User, user, { excludeExtraneousValues: true });
    }


}