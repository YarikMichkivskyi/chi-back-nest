import { ApiProperty } from '@nestjs/swagger';
import { IsString} from 'class-validator';

export class CreateExhibitDto {
    @ApiProperty({
        example: 'A portrait by Leonardo da Vinci',
        description: 'Description of the exhibit',
    })
    @IsString({message: 'Description must be a string'})
    description: string;
}