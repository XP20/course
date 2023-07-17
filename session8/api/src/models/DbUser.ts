import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity('users')
export class DbUser {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    photo_url: string;
}
