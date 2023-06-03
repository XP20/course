import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({name: 'users'})
export class OrmUser {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    email: string;

    @Column()
    pass: string;

    @Column()
    is_deleted: boolean;

    @Column()
    created: Date;
}