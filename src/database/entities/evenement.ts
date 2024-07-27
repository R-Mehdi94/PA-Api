import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import "reflect-metadata";
import { Inscription } from "./inscription";
import { EvenementUser } from "./evenementUser"; // Importez la nouvelle entité
import { EvenementRessource } from "./evenementRessource";

@Entity()
export class Evenement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @CreateDateColumn({ type: "datetime" })
    date: Date;

    @Column()
    description: string;

    @Column()
    lieu: string;

    @Column()
    estReserve: boolean;

    @Column()
    nbPlace: number;

    @OneToMany(() => EvenementRessource, evenementRessource => evenementRessource.evenement)
    evenementRessources: EvenementRessource[]; // Ajoutez cette relation



    @OneToMany(() => Inscription, inscriptions => inscriptions.evenement)
    inscriptions: Inscription[];

    @OneToMany(() => EvenementUser, evenementUser => evenementUser.evenement)
    evenementUsers: EvenementUser[]; // Ajoutez cette relation 

    constructor(id: number, nom: string, date: Date, description: string, lieu: string, inscriptions: Inscription[], evenementRessource: EvenementRessource[], estReserve: boolean, nbPlace: number, evenementUsers: EvenementUser[]) {
        this.id = id;
        this.nom = nom;
        this.date = date;
        this.description = description;
        this.lieu = lieu;
        this.estReserve = estReserve;
        this.nbPlace = nbPlace;
        this.inscriptions = inscriptions;
        this.evenementRessources = evenementRessource;
        this.evenementUsers = evenementUsers
    }
}