import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Visiteur } from './visiteur';
import { Adherent } from './adherent';

@Entity()
export class AideProjet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titre: string;

    @Column()
    descriptionProjet: string;

    @Column()
    budget: number;

    @Column()
    deadline: Date;


    @ManyToOne(() => Visiteur, visiteur => visiteur.aideProjets)
    visiteur:Visiteur

    @ManyToOne(() => Adherent, adherent => adherent.aideProjets)
    adherent:Adherent

    constructor(id: number, nom: string, descriptionProjet: string, budget: number, deadline: Date, visiteur: Visiteur, adherent: Adherent) {
        this.id = id;
        this.titre = nom;
        this.descriptionProjet = descriptionProjet;
        this.budget = budget;
        this.deadline = deadline;
        this.visiteur = visiteur;
        this.adherent = adherent;
    }
}
