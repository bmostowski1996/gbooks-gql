import express from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import path from 'node:path';

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

import dotenv from 'dotenv';

import { fileURLToPath } from 'url';

import { authenticateToken } from './services/auth.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const startApolloServer = async() => {
  // TODO: Implement MERN authentication

  await server.start();
  await db();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
  console.log('NODE_ENV is:', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    console.log('We are in production mode!');
    app.use(express.static(path.join(__dirname, '../../client/dist')));
  
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    });
  }

  

  // Every graphql route will go through this middleware
  // Student note: Not every route needs to actually use the context!
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
