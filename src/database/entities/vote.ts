import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Proposition } from './proposition';
import { User } from './user';


@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    choix: string;

    @Column()
    numTour: number;

    @ManyToOne(() => Proposition, proposition => proposition.votes)
    proposition: Proposition;

    @ManyToOne(() => User, user => user.votes)
    user: User;

    constructor(id:number,proposition: Proposition, user: User, choix: string,numTour:number) {
        this.id = id;
        this.proposition = proposition;
        this.user = user;
        this.choix = choix;
        this.numTour = numTour;

    }
}
