import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Evenement } from "./evenement"
import { Ressource } from "./ressource"


export enum StatutTache {
    Fini = "Fini",
    EnCours = "En cours"
}

@Entity()
export class Tache {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    dateDebut: Date

    @Column()
    dateFin: Date


    @Column({
        type: "enum",
        enum: StatutTache,
    })

    statut: StatutTache;

    
    @ManyToOne(() => User, user => user.taches)
    responsable: User

    @ManyToOne(() => Ressource, ressource => ressource.taches)
    ressource: Ressource



    constructor(id: number, description:string,dateDebut:Date,dateFin:Date,statut:StatutTache,responsable:User,ressource:Ressource){ 
        this.id = id;
        this.description = description;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
        this.responsable = responsable;
        this.ressource = ressource;

    }

}