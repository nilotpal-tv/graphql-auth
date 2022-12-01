import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: [
    'https://studio.apollographql.com',
    'https://lucasconstantino.github.io/graphiql-online',
    'http://localhost:4000',
    'http://localhost:4000/graphql',
  ],
  credentials: false,
};

export default corsOptions;
