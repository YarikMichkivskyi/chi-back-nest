import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comments.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'exhibits' })
export class Exhibit {
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique exhibit id' })
    id: number;

    @Expose()
    @Column()
    @ApiProperty({
        example: 'An ancient vase from the Ming dynasty',
        description: 'Description of the exhibit',
    })
    description: string;

    @Expose()
    @Column()
    @ApiProperty({
        example: '/static/uploads/vase.png',
        description: 'URL to the exhibit image',
    })
    imageUrl: string;

    @ManyToOne(() => User, (user) => user.exhibits, {
        onDelete: 'CASCADE',
        nullable: false,
        eager: true,
    })
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @Exclude()
    @Column()
    ownerId: number;

    @OneToMany(() => Comment, (comment) => comment.exhibit, { cascade: true })
    @ApiProperty({
        type: () => [Comment],
        description: 'Comments under the exhibit',
    })
    comments: Comment[];

    @Expose()
    @CreateDateColumn()
    @ApiProperty({
        example: '2024-11-28T12:34:56.000Z',
        description: 'Date and time when the exhibit was created',
    })
    createdAt: Date;
}
