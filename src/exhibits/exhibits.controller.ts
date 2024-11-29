import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
    Req,
    UploadedFile,
    UseInterceptors, BadRequestException,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { ExhibitsService } from './exhibits.service';
import { CreateExhibitDto } from './dto/create-exhibit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('exhibits')
@Controller('exhibits')
export class ExhibitsController {
    constructor(private readonly exhibitsService: ExhibitsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new exhibit' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary' },
                description: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Exhibit created successfully' })
    @ApiResponse({
        status: 400,
        description: 'Validation error or missing data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './static/uploads',
                filename: (_, file, callback) => {
                    const uniqueSuffix = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, `${file.fieldname}-${uniqueSuffix}`);
                },
            }),
        }),
    )
    async create(
        @Body() createExhibitDto: CreateExhibitDto,
        @UploadedFile() image: Express.Multer.File,
        @Req() req: any,
    ) {
        if (!image) {
            throw new BadRequestException('Image file is required');
        }

        const owner = req.user;
        const data = {
            ...createExhibitDto,
            imageUrl: `/static/uploads/${image.filename}`,
        };
        return this.exhibitsService.create(data, owner.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all exhibits' })
    @ApiResponse({
        status: 200,
        description: 'List of exhibits retrieved successfully',
    })
    async findAll() {
        return this.exhibitsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-posts')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all exhibits created by the current user' })
    @ApiResponse({
        status: 200,
        description: 'List of user-owned exhibits retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async findMyPosts(@Req() req: any) {
        const userId = req.user.sub;
        return this.exhibitsService.findByUser(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get exhibit by ID' })
    @ApiResponse({ status: 200, description: 'Exhibit retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    async findOne(@Param('id') id: number) {
        if (id <= 0) {
            throw new BadRequestException('ID must be a positive number');
        }
        return this.exhibitsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete an exhibit by ID' })
    @ApiResponse({ status: 200, description: 'Exhibit deleted successfully' })
    @ApiResponse({
        status: 403,
        description: 'User is not the owner of the exhibit',
    })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    async remove(@Param('id') id: number, @Req() req: any) {
        if (id <= 0) {
            throw new BadRequestException('ID must be a positive number');
        }
        const ownerId = req.user.sub;
        return this.exhibitsService.remove(id, ownerId);
    }
}
