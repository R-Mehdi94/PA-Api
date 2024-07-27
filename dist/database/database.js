"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
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
/*ssl: {
    rejectUnauthorized: false // Ajustez selon vos besoins de sécurité
  },
"driver": require('mysql2')*/
/*export const AppDataSource = new DataSource({
      type: process.env.TYPE as any,
      host: process.env.HOST,
      port: process.env.PORTDB as any,
      username: process.env.USERMYSQL,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      logging: true,
      synchronize: false,
      entities:[
          "dist/database/entities/*.js"
          //"src/database/entities/*.ts"
  
      ],
      migrations:[
         "dist/database/migrations/*.js"
         //"src/database/migrations/*.ts"
  
      ],
      ssl: {
          rejectUnauthorized: false
        },
      "driver": require('mysql2')
  
  })*/ 
