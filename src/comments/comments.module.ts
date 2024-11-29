import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.entity';
import { Exhibit } from '../exhibits/exhibits.entity';
import { ExhibitsModule } from '../exhibits/exhibits.module';
import { TokenModule } from '../token/token.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Exhibit]),
        ExhibitsModule,
        TokenModule
    ],
    providers: [CommentsService],
    controllers: [CommentsController],
    exports: [CommentsService],
})
export class CommentsModule {}