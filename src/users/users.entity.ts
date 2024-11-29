import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Exhibit } from '../exhibits/exhibits.entity';
import { Comment } from '../comments/comments.entity';

@Entity({ name: 'users' })
export class User {
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique user id' })
    id: number;

    @Expose()
    @Column({ unique: true })
    @ApiProperty({ example: 'username123', description: 'Unique username' })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: false })
    @ApiProperty({
        example: false,
        description: 'Indicates whether the user is an admin',
    })
    isAdmin: boolean;

    @OneToMany(() => Exhibit, (exhibit) => exhibit.owner, { cascade: true })
    @ApiProperty({
        type: () => [Exhibit],
        description: 'Exhibits created by the user',
    })
    exhibits: Exhibit[];

    // @OneToMany(() => Comment, (comment) => comment.owner)
    // @ApiProperty({ type: () => [Comment], description: 'Comments made by the user' })
    // comments: Comment[];
}
