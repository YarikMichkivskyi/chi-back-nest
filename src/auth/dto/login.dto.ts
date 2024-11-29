import { IsNotEmpty, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'username123', description: 'Username' })
    @IsString({message: 'Username must be a string'})
    @IsNotEmpty({message: 'Username is required'})
    username: string;

    @ApiProperty({ example: 'password123', description: 'Password' })
    @IsString({message: 'Passwords must be a string'})
    @IsNotEmpty({message: 'Passwords is required'})
    password: string;
}