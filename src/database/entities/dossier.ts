import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Token } from './token';
import { User } from './user';

@Entity()
export class Dossier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    nomUtilisateur: string;

    @Column()
    type: string;

    @ManyToOne(() => Token, token => token.dossiers)
    token: Token;

    @ManyToOne(() => Dossier, dossier => dossier.enfants)
    dossier: Dossier | null | undefined;

    @OneToMany(() => Dossier, dossier => dossier.dossier)
    enfants: Dossier[];

    @ManyToOne(() => Token, user => user.dossiers)
    user: User;



    constructor(id :number ,nom: string, nomUtilisateur: string, type: string, token: Token, dossier: Dossier, enfants: Dossier[], user: User) {
        this.id = id;
        this.nom = nom;
        this.nomUtilisateur = nomUtilisateur;
        this.type = type;
        this.token = token;
        this.dossier = dossier;
        this.enfants = enfants;
        this.user = user;
    }
}