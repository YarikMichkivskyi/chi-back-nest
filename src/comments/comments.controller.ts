import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    UseGuards,
    Req,
    ParseIntPipe, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@Controller('exhibits/:exhibitId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a comment for an exhibit' })
    @ApiResponse({ status: 201, description: 'Comment successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid input or exhibit not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post()
    async createComment(
        @Param('exhibitId', ParseIntPipe) exhibitId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() req: any,
    ) {
        if (exhibitId <= 0) {
            throw new BadRequestException('Exhibit ID must be a positive number');
        }
        return this.commentsService.createComment(exhibitId, createCommentDto, req.user.sub);
    }

    @ApiOperation({ summary: 'Get all comments for an exhibit' })
    @ApiResponse({ status: 200, description: 'List of comments' })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    @Get()
    async getComments(@Param('exhibitId', ParseIntPipe) exhibitId: number) {
        if (exhibitId <= 0) {
            throw new BadRequestException('Exhibit ID must be a positive number');
        }
        return this.commentsService.findCommentsByExhibit(exhibitId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete a comment by ID' })
    @ApiResponse({ status: 200, description: 'Comment successfully deleted' })
    @ApiResponse({ status: 403, description: 'Forbidden: Not the owner of the comment' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    @Delete(':commentId')
    async deleteComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Req() req: any,
    ) {
        if (commentId <= 0) {
            throw new BadRequestException('Comment ID must be a positive number');
        }
        return this.commentsService.deleteComment(commentId, req.user.sub);
    }
}