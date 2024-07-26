import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { Adherent } from "./adherent"
import { User } from "./user"

export enum typeCotisation {
    cadre = "cadre",
    etudiant = "etudiant",
    chefEntreprise = "chefEntreprise",
    autre = "autre"
}

@Entity()
export class Cotisation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: typeCotisation

    @Column()
    Ajours: boolean

    @Column()
    @CreateDateColumn({type: "datetime"})
    date: Date

    @ManyToOne(() => User, user => user.cotisations)
    user: User;

    @ManyToOne(() => Adherent, adherent => adherent.cotisations)
    adherent: Adherent;


    constructor(id:number,type: typeCotisation, Ajours: boolean, date: Date, user: User, adherent: Adherent) {
        this.id = id;
        this.type = type
        this.Ajours = Ajours
        this.date = date
        this.user = user
        this.adherent = adherent
    }
}