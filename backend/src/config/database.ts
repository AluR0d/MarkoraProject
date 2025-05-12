import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { UserRole } from '../models/UserRole';
import { Owner } from '../models/Owner';
import { Place } from '../models/Place';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const sequelizeConfig: any = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Role, UserRole, Owner, Place],
  logging: false,
};

if (process.env.NODE_ENV === 'production') {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

export const sequelize = new Sequelize(sequelizeConfig);
