import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Dossier } from "./dossier";
import { Adherent } from "./adherent";

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"varchar", length:255})
    token: string;

    @Column({ type: "varchar", length: 255 })
    blobName: string;

    @ManyToOne(() => User, user => user.tokens)
    user: User;

    @ManyToOne(() => Adherent, adherent => adherent.tokens)
    adherent: Adherent;

    @OneToMany(() => Dossier, dossier => dossier.token)
    dossiers: Dossier[];

    constructor(id: number, token: string, blobName:string ,user: User, dossiers: Dossier[], adherent: Adherent) {
        this.id = id
        this.token = token
        this.blobName = blobName
        this.user = user
        this.adherent = adherent
        this.dossiers = dossiers
    }
}