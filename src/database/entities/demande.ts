import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EvenementDemande } from "./evenementDemande";
import { AideProjetDemande } from "./aideProjetDemande";
import { ParrainageDemande } from "./parrainageDemande";
import { Visiteur } from "./visiteur";
import { AutreDemande } from "./autreDemande";
import { Adherent } from "./adherent";



export enum TypeDemande {
    Projet = "Projet",
    Evenement = "Evénement",
    Parrainage = "Parrainage",
    Autre = "Autre"
}

export enum StatutDemande {
    EnAttente = "En attente",
    Acceptee = "Acceptée",
    Refusee = "Refusée"
}
 
@Entity()
export class Demande {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: TypeDemande;


    @Column()
    dateDemande: Date;

    @Column()
    statut: StatutDemande;



    @ManyToOne(() => Adherent, adherent => adherent.demandes)
    adherent: Adherent;

    @ManyToOne(() => Visiteur, visiteur => visiteur.demandes)
    visiteur: Visiteur;

    @OneToMany(() => AutreDemande, autreDemande => autreDemande.demande)
    autreDemandes: AutreDemande[];

    @OneToMany(() => EvenementDemande, evenementDemande => evenementDemande.demande)
    evenementDemandes: EvenementDemande[];

    @OneToMany(() => AideProjetDemande, aideProjetDemande => aideProjetDemande.demande)
    aideProjetDemandes: AideProjetDemande[];

    @OneToMany(() => ParrainageDemande, parrainageDemande => parrainageDemande.demande)
    parrainageDemandes: ParrainageDemande[];

    constructor(id: number, type: TypeDemande,dateDemande :Date,statut:StatutDemande, evenementDemandes: EvenementDemande[], aideProjetDemandes:AideProjetDemande[], parrainageDemandes:ParrainageDemande[], autreDemandes: AutreDemande[], adherent: Adherent, visiteur: Visiteur) {
        this.id = id
        this.type = type
        this.dateDemande = dateDemande
        this.statut = statut
        this.autreDemandes = autreDemandes
        this.evenementDemandes = evenementDemandes
        this.aideProjetDemandes = aideProjetDemandes
        this.parrainageDemandes = parrainageDemandes
        this.adherent = adherent
        this.visiteur = visiteur    
    }
}