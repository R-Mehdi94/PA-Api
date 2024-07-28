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
exports.Vote = void 0;
const typeorm_1 = require("typeorm");
const proposition_1 = require("./proposition");
const user_1 = require("./user");
let Vote = class Vote {
    constructor(id, proposition, user, choix, numTour) {
        this.id = id;
        this.proposition = proposition;
        this.user = user;
        this.choix = choix;
        this.numTour = numTour;
    }
};
exports.Vote = Vote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Vote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Vote.prototype, "choix", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Vote.prototype, "numTour", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proposition_1.Proposition, proposition => proposition.votes),
    __metadata("design:type", proposition_1.Proposition)
], Vote.prototype, "proposition", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.votes),
    __metadata("design:type", user_1.User)
], Vote.prototype, "user", void 0);
exports.Vote = Vote = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, proposition_1.Proposition, user_1.User, String, Number])
], Vote);
