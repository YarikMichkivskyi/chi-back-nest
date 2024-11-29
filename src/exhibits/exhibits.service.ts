import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exhibit } from './exhibits.entity';
import { CreateExhibitDto } from './dto/create-exhibit.dto';
import { User } from '../users/users.entity';
import { unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { NotificationsGateway } from '../notifications/notifications.gateway';

const unlinkAsync = promisify(unlink);

@Injectable()
export class ExhibitsService {
    constructor(
        @InjectRepository(Exhibit)
        private readonly exhibitRepository: Repository<Exhibit>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly notificationsGateway: NotificationsGateway,
    ) {}

    async create(data: CreateExhibitDto, ownerId: number): Promise<Exhibit> {
        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!owner) {
            throw new NotFoundException('User not found');
        }

        const exhibit = this.exhibitRepository.create({
            ...data,
            ownerId: owner.id,
            owner,
        });

        const savedExhibit = await this.exhibitRepository.save(exhibit);

        this.notificationsGateway.sendNotification(ownerId);

        return savedExhibit;
    }

    async findAll(): Promise<Exhibit[]> {
        return this.exhibitRepository.find({
            relations: ['owner'],
        });
    }

    async findByUser(userId: number): Promise<Exhibit[]> {
        return this.exhibitRepository.find({
            where: { ownerId: userId },
            relations: ['owner'], // Включаем владельца в результат
        });
    }

    async findOne(id: number): Promise<Exhibit> {
        const exhibit = await this.exhibitRepository.findOne({
            where: { id },
            relations: ['owner', 'comments'],
        });

        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }

        return exhibit;
    }

    async remove(id: number, ownerId: number): Promise<void> {
        const exhibit = await this.findOne(id);

        if (exhibit.ownerId !== ownerId) {
            throw new ForbiddenException('You are not the owner of this exhibit');
        }

        const filePath = join(process.cwd(), exhibit.imageUrl);
        console.log(filePath);
        try {
            await unlinkAsync(filePath);
            console.log(`File deleted: ${filePath}`);
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
        }

        await this.exhibitRepository.remove(exhibit);
    }
}