import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import "reflect-metadata"
import { Evenement } from "./evenement"
import { Visiteur } from "./visiteur"
import { Adherent } from "./adherent"


@Entity()
export class Inscription {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Evenement, evenement => evenement.inscriptions)
    evenement:Evenement

    @ManyToOne(() => Visiteur, visiteur => visiteur.inscriptions)
    visiteur:Visiteur

    @ManyToOne(() => Adherent, adherent => adherent.inscriptions)
    adherent:Adherent
    
    constructor(id: number,visiteur:Visiteur,evenement:Evenement,adherent:Adherent) {
        this.id = id;
        this.visiteur = visiteur;
        this.adherent = adherent;
        this.evenement = evenement;
    }
}