import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Inscription } from "./inscription"
import { Cotisation } from "./cotisation"
import { Transaction } from "./transaction"
import { Demande } from "./demande"


@Entity()
export class Visiteur {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    email: string

    @Column()
    nom: string

    @Column()
    prenom: string

    @Column()
    age: number

    @Column()
    numTel: string

    @Column()
    profession: string

    @Column()
    estBanie: boolean


    @Column()
    @CreateDateColumn({type: "datetime"})
    dateInscription: Date

    @OneToMany(() => Inscription, inscriptions => inscriptions.visiteur)
    inscriptions: Inscription[];


    @OneToMany(() => Transaction, transactions => transactions.visiteur)
    transactions: Transaction[];

    @OneToMany(() => Demande, demandes => demandes.visiteur)
    demandes: Demande[];



    constructor(id:number,nom: string, prenom: string, email: string, age: number, numTel: string, adresse: string, profession: string, dateInscription: Date, estBenevole: boolean, parrain: User, inscriptions: Inscription[], cotisations: Cotisation[], transactions: Transaction[], estBanie: boolean, demandes: Demande[]) {
        this.id = id;
        this.nom = nom
        this.prenom = prenom
        this.email = email
        this.age = age
        this.numTel = numTel
        this.profession = profession
        this.dateInscription = dateInscription
        this.inscriptions = inscriptions
        this.transactions = transactions
        this.estBanie = estBanie
        this.demandes = demandes
    }
}