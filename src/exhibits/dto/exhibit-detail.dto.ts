import { Expose, Type } from 'class-transformer';
import { ExhibitInListDto} from './exhibit-in-list.dto';
import { UserShortDto } from './user-short.dto';

export class ExhibitDetailDto extends ExhibitInListDto {
    @Expose()
    @Type(() => CommentDetailDto)
    comments: CommentDetailDto[];
}

export class CommentDetailDto {
    @Expose()
    text: string;

    @Expose()
    @Type(() => UserShortDto)
    owner: UserShortDto;
}