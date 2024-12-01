import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class CommentOwnerDto {
    @ApiProperty({ example: 1, description: 'Unique owner id' })
    @Expose()
    id: number;

    @ApiProperty({ example: 'username123', description: 'Username of the owner' })
    @Expose()
    username: string;
}

export class CommentDto {
    @ApiProperty({ example: 1, description: 'Unique comment id' })
    @Expose()
    id: number;

    @ApiProperty({ example: 'Great exhibit!', description: 'Comment text' })
    @Expose()
    text: string;

    @ApiProperty({ example: '2024-11-28T12:34:56.000Z', description: 'Creation timestamp' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ type: () => CommentOwnerDto, description: 'Owner of the comment' })
    @Expose()
    @Type(() => CommentOwnerDto)
    owner: CommentOwnerDto;
}