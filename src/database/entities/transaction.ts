import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany} from "typeorm"
import "reflect-metadata"
import { Visiteur } from "./visiteur"
import { Adherent } from "./adherent"


export enum TypeTransaction {
    Don = "Don",
    PaiementCotisations = "Cotisation",
    Inscription = "Inscription"
}


@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    montant: number

    @Column()
    methodePaiement: string

    @Column({
        type: "enum",
        enum: TypeTransaction,
    })
    type: TypeTransaction;

    @CreateDateColumn({type: "datetime"})
    dateTransaction?:Date
    
    @ManyToOne(() => Visiteur, visiteur => visiteur.transactions)
    visiteur: Visiteur;

    @ManyToOne(() => Adherent, adherent => adherent.transactions)
    adherent: Adherent;



    constructor(id: number, montant:number,type:TypeTransaction,methodePaiement:string,visiteur:Visiteur,adherent:Adherent) {
        this.id = id;
        this.montant = montant;
        this.type = type;
        this.methodePaiement = methodePaiement;
        this.visiteur = visiteur;
        this.adherent = adherent;
    }
}