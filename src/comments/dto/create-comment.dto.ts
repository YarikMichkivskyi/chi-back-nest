import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ example: 'Amazing exhibit!', description: 'Text of the comment' })
    @MinLength(1, { message: 'Comment text must be at least 1 character long' })
    text: string;
}