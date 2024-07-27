"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
require("dotenv/config");
/*export const AppDataSource = new DataSource({
    type: "mysql",
    host: 'db',
    port: 3306,
    username: 'ecafUser',
    password: 'azerty',
    database: 'ECAF',
    logging: true,
    synchronize: false,
    entities: [
        "src/database/entities/*.ts"
    ]
});
/*  ssl: {
    rejectUnauthorized: false // Ajustez selon vos besoins de sécurité
  },
"driver": require('mysql2')*/
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.TYPE,
    host: process.env.HOST,
    port: process.env.PORTDB,
    username: process.env.USERMYSQL,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    logging: true,
    synchronize: false,
    entities: [
        "dist/database/entities/*.js"
        //"src/database/entities/*.ts"
    ],
    migrations: [
        "dist/database/migrations/*.js"
        //"src/database/migrations/*.ts"
    ],
    ssl: {
        rejectUnauthorized: false
    },
    "driver": require('mysql2')
});
