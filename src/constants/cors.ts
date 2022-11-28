import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  allowedHeaders: [
    'access-control-allow-methods',
    'access-control-allow-origin',
  ],
  origin: ['studio.apollographql.com'],
  credentials: false,
};

export default corsOptions;
