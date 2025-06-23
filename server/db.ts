// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import ws from "ws";
// import * as schema from "@shared/schema";
// import dotEnv from "dotenv";
// // require("dotenv").config();
// dotEnv.config();
// neonConfig.webSocketConstructor = ws;
// // const DATABASE_URL = 'postgresql://postgres:password@localhost:5432/portfolio'
// // process.env.DATABASE_URL
// if (!process.env.DATABASE_URL) {
//   console.log("ppp", process.env.DATABASE_URL);
  
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to provision a database?",
//   );
// }

// export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool, schema });

// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from 'pg';
import dotEnv from "dotenv";
// require("dotenv").config();
dotEnv.config();
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432'),
});

export const db = drizzle(pool);

 
// const result = await db.execute('select 1');
