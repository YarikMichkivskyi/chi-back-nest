import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Exhibit } from '../exhibits/exhibits.entity';
import { CommentDto } from './dto/comment.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
        @InjectRepository(Exhibit)
        private readonly exhibitsRepository: Repository<Exhibit>,
    ) {}

    async createComment(
        exhibitId: number,
        createCommentDto: CreateCommentDto,
        ownerId: number,
    ): Promise<Comment> {

        const exhibit = await this.exhibitsRepository.findOne({ where: { id: exhibitId } });
        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }
        const comment = this.commentsRepository.create({ ...createCommentDto, exhibitId:exhibitId, ownerId: ownerId });
        return this.commentsRepository.save(comment);
    }

    async findCommentsByExhibit(exhibitId: number): Promise<CommentDto[]> {
        if (exhibitId <= 0) {
            throw new NotFoundException('Exhibit ID must be a positive number');
        }

        const comments = await this.commentsRepository.find({
            where: { exhibit: { id: exhibitId } },
            relations: ['owner'],
        });

        if (comments.length === 0) {
            throw new NotFoundException('No comments found for this exhibit');
        }

        return plainToInstance(CommentDto, comments, { excludeExtraneousValues: true });
    }

    async deleteComment(commentId: number, userId: number): Promise<void> {
        const comment = await this.commentsRepository.findOne({ where: { id: commentId }, relations: ['owner'] });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        if (comment.owner?.id !== userId) {
            throw new ForbiddenException('You are not the owner of this comment');
        }
        await this.commentsRepository.remove(comment);
    }
}