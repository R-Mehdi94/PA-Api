import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import "reflect-metadata"
import { EvenementUser } from "./evenementUser"
import { EvenementRessource } from "./evenementRessource"
import { Tache } from "./tache"

export enum TypeRessource{
    Vetement = "Vetement",
    Argent = "Argent",
    Alimentaire = "Alimentaire",
    MaterielMaisonDivers = "Matériel maison divers",
    Materiel = "Materiel",
    Autre = "Autre"
}



@Entity()
export class Ressource {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column({
        type: "enum",
        enum: TypeRessource,
    })
    type: TypeRessource;

    @Column()
    quantite: number

    @Column()
    emplacement: string

    @OneToMany(() => EvenementRessource, evenementRessource => evenementRessource.ressource)
    evenementRessources: EvenementRessource[];

    @OneToMany(() => EvenementUser, evenementUser => evenementUser.user)
    evenementUsers: EvenementUser[]; 

    @OneToMany(() => Tache, tache => tache.ressource)
    taches: Tache[]; 


    constructor(id: number, nom:string,type:TypeRessource,emplacement:string, quantite:number ,evenementRessources:EvenementRessource[], evenementUsers:EvenementUser[], taches:Tache[]){ 
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.quantite = quantite;
        this.emplacement = emplacement;
        this.evenementRessources = evenementRessources;
        this.evenementUsers = evenementUsers;
        this.taches = taches;
    }
}