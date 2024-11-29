import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const existingUser = await this.userRepository.findOne({ where: { username: createUserDto.username } });
        if (existingUser) {
            throw new BadRequestException('User with this username already exists');
        }

        const user = this.userRepository.create({ username: createUserDto.username, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async findByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User> {
        if (id <= 0) {
            throw new BadRequestException('ID must be a positive integer');
        }

        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}