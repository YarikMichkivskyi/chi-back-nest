import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exhibit } from './exhibits.entity';
import { CreateExhibitDto } from './dto/create-exhibit.dto';
import { User } from '../users/users.entity';
import { unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { ExhibitInListDto } from './dto/exhibit-in-list.dto';
import { plainToInstance } from 'class-transformer';
import { ExhibitDetailDto } from './dto/exhibit-detail.dto';

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

    async create(
        data: CreateExhibitDto,
        ownerId: number,
    ): Promise<ExhibitDetailDto> {
        const owner = await this.userRepository.findOne({
            where: { id: ownerId },
        });
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

        const exhibitWithRelations = await this.exhibitRepository.findOne({
            where: { id: savedExhibit.id },
            relations: ['owner', 'comments', 'comments.owner'],
        });

        return plainToInstance(ExhibitDetailDto, exhibitWithRelations, {
            excludeExtraneousValues: true,
        });
    }

    async findAll(
        page: number,
        limit: number,
    ): Promise<{
        data: ExhibitInListDto[];
        total: number;
        page: number;
        lastPage: number;
    }> {
        const [result, total] = await this.exhibitRepository.findAndCount({
            //todo new dto
            relations: ['owner', 'comments'],
            skip: (page - 1) * limit,
            take: limit,
        });

        const data = plainToInstance(
            ExhibitInListDto,
            result.map((exhibit) => ({
                ...exhibit,
                commentCount: exhibit.comments?.length || 0,
            })),
            { excludeExtraneousValues: true },
        );

        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }

    async findByUser(
        userId: number,
        page: number,
        limit: number,
    ): Promise<{
        //todo new dto
        data: ExhibitInListDto[];
        total: number;
        page: number;
        lastPage: number;
    }> {
        const [result, total] = await this.exhibitRepository.findAndCount({
            relations: ['owner', 'comments'],
            where: { ownerId: userId },
            skip: (page - 1) * limit,
            take: limit,
        });

        const data = plainToInstance(
            ExhibitInListDto,
            result.map((exhibit) => ({
                ...exhibit,
                commentCount: exhibit.comments?.length || 0,
            })),
            { excludeExtraneousValues: true },
        );

        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }

    async findOne(id: number): Promise<ExhibitDetailDto> {
        const exhibit = await this.exhibitRepository.findOne({
            where: { id },
            relations: ['owner', 'comments', 'comments.owner'],
        });

        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }

        return plainToInstance(
            ExhibitDetailDto,
            {
                ...exhibit,
                commentCount: exhibit.comments?.length || 0,
            },
            { excludeExtraneousValues: true },
        );
    }

    async remove(id: number, ownerId: number): Promise<ExhibitDetailDto> {
        const exhibit = await this.exhibitRepository.findOne({
            where: { id },
            relations: ['owner', 'comments', 'comments.owner'],
        });

        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }

        if (exhibit.owner.id !== ownerId) {
            throw new ForbiddenException(
                'You are not the owner of this exhibit',
            );
        }

        const filePath = join(process.cwd(), exhibit.imageUrl);
        try {
            await unlinkAsync(filePath);
            console.log(`File deleted: ${filePath}`);
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
        }

        await this.exhibitRepository.remove(exhibit);

        return plainToInstance(ExhibitDetailDto, exhibit, {
            excludeExtraneousValues: true,
        });
    }
}
