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
exports.Transaction = exports.TypeTransaction = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const visiteur_1 = require("./visiteur");
const adherent_1 = require("./adherent");
var TypeTransaction;
(function (TypeTransaction) {
    TypeTransaction["Don"] = "Don";
    TypeTransaction["PaiementCotisations"] = "Cotisation";
    TypeTransaction["Inscription"] = "Inscription";
})(TypeTransaction || (exports.TypeTransaction = TypeTransaction = {}));
let Transaction = class Transaction {
    constructor(id, montant, type, methodePaiement, visiteur, adherent) {
        this.id = id;
        this.montant = montant;
        this.type = type;
        this.methodePaiement = methodePaiement;
        this.visiteur = visiteur;
        this.adherent = adherent;
    }
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transaction.prototype, "montant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "methodePaiement", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: TypeTransaction,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Transaction.prototype, "dateTransaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visiteur_1.Visiteur, visiteur => visiteur.transactions),
    __metadata("design:type", visiteur_1.Visiteur)
], Transaction.prototype, "visiteur", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adherent_1.Adherent, adherent => adherent.transactions),
    __metadata("design:type", adherent_1.Adherent)
], Transaction.prototype, "adherent", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, Number, String, String, visiteur_1.Visiteur, adherent_1.Adherent])
], Transaction);
