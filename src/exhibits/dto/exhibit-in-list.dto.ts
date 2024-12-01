import { Expose, Type } from 'class-transformer';
import { UserShortDto } from './user-short.dto';

export class ExhibitInListDto {
    @Expose()
    id: number;

    @Expose()
    imageUrl: string;

    @Expose()
    description: string;

    @Expose()
    createdAt: Date;

    @Expose()
    commentCount: number;

    @Expose()
    @Type(() => UserShortDto)
    owner: UserShortDto;
}