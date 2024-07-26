"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const token_1 = require("./token");
const tache_1 = require("./tache");
const parrainageDemande_1 = require("./parrainageDemande");
const participationAG_1 = require("./participationAG");
const vote_1 = require("./vote");
const dossier_1 = require("./dossier");
const evenementUser_1 = require("./evenementUser");
const adherent_1 = require("./adherent");
const cotisation_1 = require("./cotisation");
var UserRole;
(function (UserRole) {
    UserRole["Administrateur"] = "Administrateur";
    UserRole["Utilisateur"] = "Utilisateur";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    constructor(id, nom, prenom, email, numTel, motDePasse, profession, role, dateInscription, estBenevole, taches, parrainageDemandes, parraine, tokens, participationsAg, votes, dossiers, evenementUsers, cotisations) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateInscription = dateInscription;
        this.estBenevole = estBenevole;
        this.numTel = numTel;
        this.profession = profession;
        this.estEnLigne = false;
        this.parrainageDemandes = parrainageDemandes;
        this.parraine = parraine;
        this.taches = taches;
        this.tokens = tokens;
        this.participationsAg = participationsAg;
        this.votes = votes;
        this.dossiers = dossiers;
        this.evenementUsers = evenementUsers;
        this.cotisations = cotisations;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "motDePasse", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "numTel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: UserRole,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], User.prototype, "dateInscription", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "estBenevole", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "estEnLigne", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tache_1.Tache, tache => tache.responsable),
    __metadata("design:type", Array)
], User.prototype, "taches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parrainageDemande_1.ParrainageDemande, parrainageDemandes => parrainageDemandes.parrain),
    __metadata("design:type", Array)
], User.prototype, "parrainageDemandes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adherent_1.Adherent, adherents => adherents.parrain),
    __metadata("design:type", Array)
], User.prototype, "parraine", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => token_1.Token, token => token.user),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cotisation_1.Cotisation, cotisations => cotisations.user),
    __metadata("design:type", Array)
], User.prototype, "cotisations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participationAG_1.ParticipationAG, participationAG => participationAG.user),
    __metadata("design:type", Array)
], User.prototype, "participationsAg", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_1.Vote, vote => vote.user),
    __metadata("design:type", Array)
], User.prototype, "votes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dossier_1.Dossier, dossier => dossier.user),
    __metadata("design:type", Array)
], User.prototype, "dossiers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evenementUser_1.EvenementUser, evenementUser => evenementUser.user),
    __metadata("design:type", Array)
], User.prototype, "evenementUsers", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, String, String, Date, Boolean, Array, Array, Array, Array, Array, Array, Array, Array, Array])
], User);
