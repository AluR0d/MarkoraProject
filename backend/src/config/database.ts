import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { UserRole } from '../models/UserRole';
import { Owner } from '../models/Owner';
import { Place } from '../models/Place';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Role, UserRole, Owner, Place],
  logging: false,
});
