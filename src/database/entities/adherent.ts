import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Inscription } from "./inscription"
import { Cotisation } from "./cotisation"
import { Token } from "./token"
import { Transaction } from "./transaction"
import { Demande } from "./demande"
import { AideProjet } from "./aideProjet"

@Entity()
export class Adherent {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    email: string

    @Column()
    motDePasse: string

    @Column()
    nom: string

    @Column()
    prenom: string

    @Column()
    age: number

    @Column()
    numTel: string

    @Column()
    adresse: string

    @Column()
    profession: string

    @Column()
    estBanie: boolean

    @Column()
    @CreateDateColumn({type: "datetime"})
    dateInscription: Date

    @Column()
    estBenevole: boolean

    @ManyToOne(() => User, user => user.parraine, { nullable: true })
    parrain: User | null; 

    @OneToMany(() => Inscription, inscriptions => inscriptions.adherent)
    inscriptions: Inscription[];
    
    @OneToMany(() => Cotisation, cotisations => cotisations.adherent)
    cotisations: Cotisation[];

    @OneToMany(() => Token, token => token.adherent)
    tokens: Token[];

    @OneToMany(() => Transaction, transactions => transactions.adherent)
    transactions: Transaction[];

    @OneToMany(() => Demande, demandes => demandes.visiteur)
    demandes: Demande[];

    @OneToMany(() => AideProjet, aideProjets => aideProjets.adherent)
    aideProjets: AideProjet[];

    constructor(id:number,motDePasse:string,estBanie:boolean,nom: string, prenom: string, email: string, age: number, numTel: string, adresse: string, profession: string, dateInscription: Date, estBenevole: boolean, parrain: User, inscriptions: Inscription[], cotisations: Cotisation[], tokens: Token[], transactions: Transaction[], demandes: Demande[], aideProjets: AideProjet[]) {
        this.id = id
        this.motDePasse = motDePasse
        this.estBanie = estBanie
        this.nom = nom
        this.prenom = prenom
        this.email = email
        this.age = age
        this.numTel = numTel
        this.adresse = adresse
        this.profession = profession
        this.dateInscription = dateInscription
        this.estBenevole = estBenevole
        this.parrain = parrain
        this.inscriptions = inscriptions
        this.cotisations = cotisations
        this.tokens = tokens
        this.transactions = transactions
        this.demandes = demandes    
        this.aideProjets = aideProjets    
    }
}