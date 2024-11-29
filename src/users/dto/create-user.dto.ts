import { MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'username123', description: 'Username for the user', minLength: 4 })
    @MinLength(4, { message: 'Username should be at least 4 characters long' })
    username: string;

    @ApiProperty({ example: 'password123', description: 'Password for the user', minLength: 4 })
    @MinLength(4, { message: 'Password should be at least 4 characters long' })
    password: string;
}