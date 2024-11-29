import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Exhibit } from '../exhibits/exhibits.entity';
import { User } from '../users/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique comment id' })
    id: number;

    @Column()
    @ApiProperty({
        example: 'Amazing exhibit!',
        description: 'Content of the comment',
    })
    text: string;

    @ManyToOne(() => Exhibit, (exhibit) => exhibit.comments, {
        onDelete: 'CASCADE',
        eager: false,
        nullable: false,
    })
    @JoinColumn({ name: 'exhibitId' })
    exhibit: Exhibit;

    @Column()
    exhibitId: number;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        nullable: false,
        eager: true,
    })
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @Column()
    ownerId: number;

    @CreateDateColumn()
    @ApiProperty({
        example: '2024-11-28T12:34:56.000Z',
        description: 'Date and time when the comment was created',
    })
    createdAt: Date;
}
