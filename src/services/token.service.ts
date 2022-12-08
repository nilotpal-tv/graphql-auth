import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

export type JwtPayload = {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
};

class TokenService {
  generateTokens = (payload: JwtPayload): string => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });
    return accessToken;
  };

  verifyToken = (token: string) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
      if (error.name === 'JsonWebTokenError')
        throw new AuthenticationError('Invalid token.');
      throw new AuthenticationError('Session expired. Please login again.');
    }
  };
}

export default new TokenService();
