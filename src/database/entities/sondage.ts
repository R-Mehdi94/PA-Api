import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proposition } from './proposition';

export enum TypeSondage {
    unTour = "UN_TOUR",
    deuxTours = "DEUX_TOURS",
}

@Entity()

export class Sondage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    nom: string;

    @Column('datetime')
    dateDebut: Date;

    @Column('datetime')
    dateFin: Date;

    @Column('text')
    description: string;

    @Column()
    typeSondage: TypeSondage;

    @OneToMany(() => Proposition, proposition => proposition.sondage)
    propositions: Proposition[];

    constructor(id:number,nom: string, dateFin: Date,dateDebut:Date,  description: string, type: TypeSondage, propositions:Proposition[]) {
        this.id = id;
        this.nom = nom;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.description = description;
        this.typeSondage = type;
        this.propositions = propositions
    }
}
