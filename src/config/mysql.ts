import mysql from "mysql2";
import config from "./config";
import { User } from "../interfaces/userInterface";
import { Gig, SimplifiedGig } from "../interfaces/gigInterface";

const params = {
  user: config.mysql.user,
  password: config.mysql.pass,
  host: config.mysql.host,
  database: config.mysql.database,
};

const Connect = () =>
  new Promise<mysql.Connection>((resolve, reject) => {
    const connection = mysql.createConnection(params);

    connection.connect((error) => {
      if (error) {
        reject("No connection to the database could be established");
        return;
      }

      resolve(connection);
    });
  });

const UserQuery = (
  connection: mysql.Connection,
  query: string
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.query<User[]>(query, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });

const TempQuery = (
  connection: mysql.Connection,
  query: string
): Promise<SimplifiedGig[]> =>
  new Promise((resolve, reject) => {
    connection.query<SimplifiedGig[]>(query, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });

const GigQuery = (
  connection: mysql.Connection,
  query: string
): Promise<Gig[]> =>
  new Promise((resolve, reject) => {
    connection.query<Gig[]>(query, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });

const ParamQuery = (
  connection: mysql.Connection,
  query: string,
  pArray: String[]
) =>
  new Promise((resolve, reject) => {
    connection.query(query, pArray, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });

export { Connect, UserQuery, GigQuery, ParamQuery, TempQuery };
