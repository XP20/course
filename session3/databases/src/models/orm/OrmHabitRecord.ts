import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import {OrmHabit} from "./OrmHabit";

@Entity({name: 'habit_record'})
export class OrmHabitRecord {
    @PrimaryGeneratedColumn()
    habit_record_id: number;

    @Column()
    habit_id: number;

    @Column()
    created: Date;

    @OneToOne(type => OrmHabit)
    @JoinColumn({
        name: 'habit_id'
    })
    habit?: OrmHabit;
}